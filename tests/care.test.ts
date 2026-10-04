import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  clinicDate,
  clinicTime,
  validDate,
  validTime,
} from "../src/lib/care-time";
import { canAccessAppointment, canChangeStatus } from "../src/lib/permissions";
import type { Appointment, User } from "../src/types";
const folder = mkdtempSync(join(tmpdir(), "vela-tests-"));
process.env.VELA_DATABASE_PATH = join(folder, "fixture.db");
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
import { getDb, getLocalDb } from "../src/lib/db";
import { seedDatabase } from "../src/lib/seed";
import * as data from "../src/lib/data";
test.before(async () => {
  await seedDatabase();
});
const db = getDb();
const user = (id: string, role: User["role"]) => ({ id, role }) as User;
const appointment = {
  patientId: "patient",
  doctorId: "doctor",
  status: "CONFIRMED",
} as Appointment;
test("clinic dates use Pacific time across UTC midnight", () => {
  assert.equal(clinicDate(new Date("2026-10-04T01:00:00Z")), "2026-10-03");
  assert.equal(clinicTime(new Date("2026-10-04T01:00:00Z")), "18:00");
});
test("date and time validation rejects impossible and malformed values", () => {
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validTime("24:00"), false);
  assert.equal(validTime("09:30"), true);
  assert.equal(validDate({}), false);
});
test("appointments are limited to patient, treating physician and admin", () => {
  assert.equal(
    canAccessAppointment(user("patient", "PATIENT"), appointment),
    true,
  );
  assert.equal(
    canAccessAppointment(user("other", "PATIENT"), appointment),
    false,
  );
  assert.equal(
    canAccessAppointment(user("other", "DOCTOR"), appointment),
    false,
  );
  assert.equal(canAccessAppointment(user("admin", "ADMIN"), appointment), true);
});
test("patients cannot complete visits and terminal statuses cannot reopen", () => {
  assert.equal(
    canChangeStatus(user("patient", "PATIENT"), appointment, "COMPLETED"),
    false,
  );
  assert.equal(
    canChangeStatus(user("patient", "PATIENT"), appointment, "CANCELLED"),
    true,
  );
  assert.equal(
    canChangeStatus(
      user("doctor", "DOCTOR"),
      { ...appointment, status: "COMPLETED" },
      "CONFIRMED",
    ),
    false,
  );
});
const future = "2099-01-05"; // Monday, safely after current data.
const payload = {
  patientId: "usr-patient-1",
  doctorId: "usr-doc-1",
  clinicId: "clinic-central",
  scheduledDate: future,
  scheduledTime: "09:00",
  consultationType: "IN_PERSON" as const,
  reason: "Test appointment",
};
test("availability follows published blocks and rejects unsupported/past dates", async () => {
  assert.deepEqual(
    await data.getAvailableSlots("usr-doc-1", "2000-01-01", "IN_PERSON"),
    [],
  );
  assert.deepEqual(
    await data.getAvailableSlots("usr-doc-1", "2099-01-04", "IN_PERSON"),
    [],
  );
  assert.ok(
    (await data.getAvailableSlots("usr-doc-1", future, "IN_PERSON")).includes(
      "09:00",
    ),
  );
});
test("booking validates assigned clinic and blocks duplicate and overlapping slots", async () => {
  assert.equal(
    (await data.createAppointment({ ...payload, clinicId: "clinic-marina" }))
      .success,
    false,
  );
  const first = await db
    .transaction(async () => await data.createAppointment(payload))
    .immediate();
  assert.equal(first.success, true);
  assert.equal(
    (
      await db
        .transaction(async () => await data.createAppointment(payload))
        .immediate()
    ).success,
    false,
  );
  await db
    .prepare("UPDATE appointments SET duration_minutes=60 WHERE id=?")
    .run(first.appointmentId);
  assert.equal(
    (
      await data.getAvailableSlots(payload.doctorId, future, "IN_PERSON")
    ).includes("09:30"),
    false,
  );
});
test("unrelated people cannot read or send appointment messages", async () => {
  assert.deepEqual(
    await data.getMessagesForConversation("conv-1", "usr-doc-2"),
    [],
  );
  assert.equal(
    await data.sendInAppMessage({
      conversationId: "conv-1",
      senderId: "usr-doc-2",
      content: "Unauthorized",
    }),
    null,
  );
});
test("check-in is restricted to the owning patient and arrival window", async () => {
  assert.equal(
    await data.performDigitalCheckIn("apt-today-1", "usr-patient-2"),
    false,
  );
  assert.equal(
    await data.performDigitalCheckIn("apt-upcoming-1", "usr-patient-1"),
    false,
  );
});
test("clinical completion creates one document and cannot be edited by other physicians", async () => {
  const result = await data.createAppointment({
    ...payload,
    scheduledTime: "10:30",
  });
  assert.ok(result.appointmentId);
  const notes = {
    clinicalNotes: "Test record",
    followUpInstructions: "Test follow-up",
    markCompleted: true,
  };
  assert.equal(
    await data.saveClinicalConsultation(
      result.appointmentId!,
      "usr-doc-2",
      notes,
    ),
    false,
  );
  assert.equal(
    await db
      .transaction(
        async () =>
          await data.saveClinicalConsultation(
            result.appointmentId!,
            "usr-doc-1",
            notes,
          ),
      )
      .immediate(),
    true,
  );
  assert.equal(
    await data.saveClinicalConsultation(
      result.appointmentId!,
      "usr-doc-1",
      notes,
    ),
    false,
  );
  assert.equal(
    (
      (await db
        .prepare(
          "SELECT count(*) AS n FROM patient_documents WHERE appointment_id=?",
        )
        .get(result.appointmentId)) as { n: number }
    ).n,
    1,
  );
});
test.after(() => {
  getLocalDb().close();
  rmSync(folder, { recursive: true, force: true });
});
