import assert from "node:assert/strict";
const base = process.env.VELA_TEST_BASE_URL;
if (!base || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw Error("Set VELA_TEST_BASE_URL to the isolated local test server.");
let checks = 0;
async function call(path, { method = "GET", body, cookie } = {}) {
  const r = await fetch(base + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { html: text };
  }
  return {
    status: r.status,
    data,
    cookie: r.headers.get("set-cookie")?.split(";")[0],
    location: r.headers.get("location"),
  };
}
function expect(response, status, label) {
  assert.equal(
    response.status,
    status,
    label + ": " + JSON.stringify(response.data).slice(0, 180),
  );
  checks++;
}
expect(await call("/api/appointments"), 401, "Guests cannot read appointments");
expect(
  await call("/api/appointments/apt-today-1"),
  401,
  "Guests cannot read appointment detail",
);
expect(
  await call("/api/auth/login", {
    method: "POST",
    body: { email: 42, password: [] },
  }),
  400,
  "Malformed credentials rejected",
);
const sessions = {};
for (const [role, email, password] of [
  ["patient", "patient@velahealth.com", "PatientPass123!"],
  ["doctor", "doctor.reyes@velahealth.com", "DoctorPass123!"],
  ["admin", "admin@velahealth.com", "AdminPass123!"],
]) {
  const result = await call("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  expect(result, 200, role + " sign-in");
  assert.ok(result.cookie);
  sessions[role] = result.cookie;
}
const patient = sessions.patient,
  doctor = sessions.doctor,
  admin = sessions.admin;
expect(
  await call("/api/admin", { cookie: patient }),
  403,
  "Patient denied admin data",
);
expect(
  await call("/api/doctor/patients", { cookie: patient }),
  403,
  "Patient denied clinical panel",
);
const wrongRole = await call("/doctor", { cookie: patient });
assert.ok(
  ([307, 308].includes(wrongRole.status) &&
    wrongRole.location === "/patient") ||
    (wrongRole.status === 200 &&
      wrongRole.data.html?.includes("NEXT_REDIRECT") &&
      wrongRole.data.html.includes("/patient")),
);
checks++;
expect(
  await call("/api/appointments", {
    cookie: doctor,
    method: "POST",
    body: { doctorId: "usr-doc-1" },
  }),
  403,
  "Doctor cannot book as patient",
);
expect(
  await call("/api/saved", {
    cookie: patient,
    method: "POST",
    body: { itemId: "usr-doc-1", itemType: "ADMIN" },
  }),
  400,
  "Invalid saved type rejected",
);
expect(
  await call("/api/saved", {
    cookie: patient,
    method: "POST",
    body: { itemId: "usr-doc-1", itemType: "DOCTOR" },
  }),
  200,
  "Saved physician persists",
);
expect(
  await call("/api/waitlist", {
    cookie: patient,
    method: "POST",
    body: {
      doctorId: "usr-doc-1",
      preferredStartDate: "2026-02-30",
      preferredEndDate: "2026-03-01",
      preferredTimeRange: "Any",
    },
  }),
  400,
  "Invalid waitlist date rejected",
);
let date, slots;
for (let i = 15; i < 23; i++) {
  date = new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
  const result = await call(
    `/api/availability?doctorId=usr-doc-1&date=${date}&type=IN_PERSON`,
  );
  expect(result, 200, "Availability loads");
  slots = result.data.slots;
  if (slots.length >= 4) break;
}
assert.ok(slots?.length >= 4, "Need four published slots");
const payload = {
  doctorId: "usr-doc-1",
  clinicId: "clinic-central",
  scheduledDate: date,
  scheduledTime: slots[0],
  consultationType: "IN_PERSON",
  reason: "Isolated workflow verification",
};
const booked = await call("/api/appointments", {
  cookie: patient,
  method: "POST",
  body: payload,
});
expect(booked, 201, "Patient books published slot");
assert.ok(booked.data.referenceNo);
const id = booked.data.appointmentId;
expect(
  await call("/api/appointments", {
    cookie: patient,
    method: "POST",
    body: payload,
  }),
  400,
  "Duplicate booking prevented",
);
expect(
  await call(`/api/appointments/${id}`, {
    cookie: patient,
    method: "PATCH",
    body: { status: "COMPLETED" },
  }),
  403,
  "Patient cannot complete encounter",
);
expect(
  await call(`/api/appointments/${id}/check-in`, {
    cookie: patient,
    method: "POST",
  }),
  400,
  "Future check-in blocked",
);
const failed = await call("/api/appointments", {
  cookie: patient,
  method: "POST",
  body: { ...payload, rescheduleId: id, scheduledTime: "23:59" },
});
expect(failed, 400, "Invalid reschedule rejected");
const retained = await call(`/api/appointments/${id}`, { cookie: patient });
assert.equal(retained.data.appointment.status, "CONFIRMED");
checks++;
const rescheduled = await call("/api/appointments", {
  cookie: patient,
  method: "POST",
  body: { ...payload, rescheduleId: id, scheduledTime: slots[1] },
});
expect(rescheduled, 201, "Atomic reschedule succeeds");
assert.equal(
  (await call(`/api/appointments/${id}`, { cookie: patient })).data.appointment
    .status,
  "CANCELLED",
);
checks++;
const replacement = rescheduled.data.appointmentId;
expect(
  await call(`/api/appointments/${replacement}/clinical-workspace`, {
    cookie: patient,
    method: "POST",
    body: { clinicalNotes: "Test", markCompleted: true },
  }),
  403,
  "Patients cannot write clinical notes",
);
const conversation = (
  await call("/api/messages", { cookie: patient })
).data.conversations.find((c) => c.doctorId === payload.doctorId);
assert.ok(conversation);
checks++;
expect(
  await call("/api/messages", {
    cookie: patient,
    method: "POST",
    body: {
      conversationId: conversation.id,
      content: "Local workflow test — no medical information",
    },
  }),
  200,
  "Patient message sent",
);
const received = await call(`/api/messages?conversationId=${conversation.id}`, {
  cookie: doctor,
});
expect(received, 200, "Treating doctor receives message");
assert.ok(
  received.data.messages.some((m) => m.content.includes("Local workflow")),
);
checks++;
expect(
  await call(`/api/appointments/${replacement}/clinical-workspace`, {
    cookie: doctor,
    method: "POST",
    body: {
      clinicalNotes: "Synthetic test encounter.",
      prescription: "None",
      followUpInstructions: "Test instructions.",
      markCompleted: true,
    },
  }),
  200,
  "Doctor completes encounter",
);
const documents = await call("/api/documents", { cookie: patient });
expect(documents, 200, "Patient documents load");
assert.ok(
  documents.data.documents.some((d) => d.appointmentId === replacement),
);
checks++;
const publishedDocument = documents.data.documents.find(
  (d) => d.appointmentId === replacement,
);
expect(
  await call(`/api/documents/${publishedDocument.id}`, { cookie: patient }),
  200,
  "Published document download",
);
expect(
  await call(`/api/documents/${publishedDocument.id}`),
  401,
  "Document downloads require authentication",
);
expect(
  await call(`/api/appointments/${replacement}/review`, {
    cookie: patient,
    method: "POST",
    body: { doctorRating: 6, clinicRating: 5 },
  }),
  400,
  "Out-of-range review rejected",
);
expect(
  await call(`/api/appointments/${replacement}/review`, {
    cookie: patient,
    method: "POST",
    body: { doctorRating: 5, clinicRating: 4, comment: "Synthetic test" },
  }),
  200,
  "Verified review recorded",
);
expect(
  await call(`/api/appointments/${replacement}/review`, {
    cookie: patient,
    method: "POST",
    body: { doctorRating: 5, clinicRating: 4 },
  }),
  400,
  "Duplicate review rejected",
);
const profile = (await call("/api/profile", { cookie: patient })).data;
expect(
  await call("/api/profile", {
    cookie: patient,
    method: "PATCH",
    body: {
      firstName: profile.user.firstName,
      lastName: profile.user.lastName,
      phone: profile.user.phone,
      address: profile.profile?.address || "",
      emergency_contact_name: "Test contact",
      emergency_contact_phone: "4155550100",
    },
  }),
  200,
  "Patient profile saves",
);
expect(
  await call("/api/notifications", { cookie: patient }),
  200,
  "Notification center loads",
);
expect(
  await call("/api/admin", { cookie: admin }),
  200,
  "Admin overview loads",
);
const schedule = (
  await call("/api/availability?schedule=true", { cookie: doctor })
).data;
assert.ok(schedule);
checks++;
expect(
  await call("/api/availability", {
    cookie: patient,
    method: "PUT",
    body: { days: [] },
  }),
  403,
  "Patient cannot edit physician schedule",
);
const clinicRecord = (await call("/api/admin", { cookie: admin })).data
  .clinics[0];
expect(
  await call("/api/admin", {
    cookie: admin,
    method: "PATCH",
    body: {
      kind: "clinic",
      id: clinicRecord.id,
      name: clinicRecord.name,
      phone: clinicRecord.phone,
      operatingHours: clinicRecord.operatingHours,
    },
  }),
  200,
  "Clinic update persists",
);
expect(
  await call("/api/admin", {
    cookie: admin,
    method: "PATCH",
    body: { kind: "doctor", id: "usr-doc-1", isActive: false },
  }),
  200,
  "Physician suspension persists",
);
assert.deepEqual(
  (
    await call(
      `/api/availability?doctorId=usr-doc-1&date=${date}&type=IN_PERSON`,
    )
  ).data.slots,
  [],
);
checks++;
expect(
  await call("/api/admin", {
    cookie: admin,
    method: "PATCH",
    body: { kind: "doctor", id: "usr-doc-1", isActive: true },
  }),
  200,
  "Physician activation persists",
);
const days = Array.from({ length: 7 }, (_, i) => {
  const block = schedule.blocks.find((b) => b.day_of_week === (i + 1) % 7);
  return {
    active: !!block,
    start: block?.start_time || "09:00",
    end: block?.end_time || "17:00",
  };
});
expect(
  await call("/api/availability", {
    cookie: doctor,
    method: "PUT",
    body: {
      blocks: schedule.blocks,
      slotDuration: 30,
      telehealthEnabled: true,
      inPersonEnabled: true,
    },
  }),
  200,
  "Published availability saves",
);
expect(
  await call("/api/availability", {
    cookie: doctor,
    method: "PUT",
    body: {
      blocks: [schedule.blocks[0], schedule.blocks[0]],
      telehealthEnabled: true,
      inPersonEnabled: true,
    },
  }),
  400,
  "Overlapping availability windows rejected",
);
const newAccount = {
  firstName: "Workflow",
  lastName: "Fixture",
  email: `local-test-${Date.now()}@example.invalid`,
  password: "LocalFixturePass123!",
  phone: "4155550100",
};
expect(
  await call("/api/auth/register", {
    method: "POST",
    body: { ...newAccount, password: "short" },
  }),
  400,
  "Weak registration password rejected",
);
const registered = await call("/api/auth/register", {
  method: "POST",
  body: newAccount,
});
expect(registered, 200, "Patient registration succeeds");
expect(
  await call(`/api/appointments/${replacement}`, { cookie: registered.cookie }),
  404,
  "Unrelated patient cannot read visit",
);
expect(
  await call(`/api/messages?conversationId=${conversation.id}`, {
    cookie: registered.cookie,
  }),
  404,
  "Unrelated patient cannot read messages",
);
expect(
  await call("/api/messages", {
    cookie: registered.cookie,
    method: "POST",
    body: { conversationId: conversation.id, content: "Unauthorized" },
  }),
  400,
  "Unrelated patient cannot send message",
);
expect(
  await call("/api/documents", { cookie: registered.cookie }),
  200,
  "New patient document empty state",
);
assert.equal(
  (await call("/api/documents", { cookie: registered.cookie })).data.documents
    .length,
  0,
);
checks++;
expect(
  await call(`/api/documents/${publishedDocument.id}`, {
    cookie: registered.cookie,
  }),
  404,
  "Document download ownership enforced",
);
expect(
  await call("/api/auth/register", { method: "POST", body: newAccount }),
  400,
  "Duplicate registration rejected",
);
expect(
  await call("/api/auth/logout", { cookie: patient, method: "POST" }),
  200,
  "Sign-out succeeds",
);
expect(
  await call("/api/appointments", { cookie: patient }),
  401,
  "Signed-out session cannot access records",
);
console.log(`PASS: ${checks} local HTTP workflow checks.`);
