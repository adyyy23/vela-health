import bcrypt from "bcryptjs";
import { getDb } from "./db";

export async function seedDatabase() {
  const db = getDb();

  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count > 0) {
    // Already seeded
    return;
  }

  console.log("Seeding Vela Health database...");

  const patientPassHash = bcrypt.hashSync("PatientPass123!", 10);
  const doctorPassHash = bcrypt.hashSync("DoctorPass123!", 10);
  const adminPassHash = bcrypt.hashSync("AdminPass123!", 10);

  const now = new Date().toISOString();
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const lastWeekStr = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  // 1. Specialties
  const insertSpecialty = db.prepare(`
    INSERT INTO specialties (id, name, slug, description, icon_name)
    VALUES (?, ?, ?, ?, ?)
  `);

  const specialties = [
    { id: "spec-derma", name: "Dermatology", slug: "dermatology", desc: "Advanced medical and cosmetic skin, hair, and nail treatments.", icon: "Sparkles" },
    { id: "spec-cardio", name: "Cardiology", slug: "cardiology", desc: "Heart disease prevention, lipid diagnostics, and hypertension care.", icon: "HeartPulse" },
    { id: "spec-general", name: "Family & General Medicine", slug: "general-medicine", desc: "Comprehensive primary care, chronic illness, and annual physicals.", icon: "Stethoscope" },
    { id: "spec-pedia", name: "Pediatrics & Child Health", slug: "pediatrics", desc: "Developmental screening, childhood wellness, and vaccinations.", icon: "Baby" },
    { id: "spec-women", name: "Women's Health & OB-GYN", slug: "womens-health", desc: "Reproductive care, prenatal counseling, and preventative screening.", icon: "ShieldAlert" },
    { id: "spec-mental", name: "Mental & Behavioral Wellness", slug: "mental-wellness", desc: "Cognitive therapy, anxiety treatment, and emotional wellness.", icon: "Smile" },
    { id: "spec-dental", name: "Dental & Oral Care", slug: "dental", desc: "Preventive cleanings, periodontal health, and restorative care.", icon: "Activity" },
    { id: "spec-eye", name: "Ophthalmology & Eye Care", slug: "eye-care", desc: "Vision diagnostics, corneal health, and laser evaluations.", icon: "Eye" },
  ];

  for (const s of specialties) {
    insertSpecialty.run(s.id, s.name, s.slug, s.desc, s.icon);
  }

  // 2. Clinics
  const insertClinic = db.prepare(`
    INSERT INTO clinics (id, name, slug, address, city, state, postal_code, latitude, longitude, phone, email, operating_hours, parking_info, accessibility_info, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const clinics = [
    {
      id: "clinic-central",
      name: "Vela Central Pavilion",
      slug: "vela-central-pavilion",
      address: "450 Sutter St, Suite 800",
      city: "San Francisco",
      state: "CA",
      postalCode: "94108",
      lat: 37.7896,
      lng: -122.4082,
      phone: "(415) 890-4100",
      email: "central@velahealth.com",
      hours: "Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 3:00 PM",
      parking: "Underground parking validation available on Sutter St entrance.",
      access: "ADA Compliant with dedicated elevator bank and barrier-free access.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "clinic-mission-bay",
      name: "Vela Mission Bay Health Hub",
      slug: "vela-mission-bay",
      address: "1600 Owens Street, 3rd Floor",
      city: "San Francisco",
      state: "CA",
      postalCode: "94158",
      lat: 37.7682,
      lng: -122.3921,
      phone: "(415) 890-4200",
      email: "missionbay@velahealth.com",
      hours: "Mon - Fri: 7:30 AM - 6:30 PM | Sat: 8:30 AM - 2:00 PM",
      parking: "Direct garage parking next to UCSF Mission Bay campus.",
      access: "Wheelchair accessible, hearing loop installed at reception.",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "clinic-marina",
      name: "Vela Marina Wellness Studio",
      slug: "vela-marina",
      address: "2210 Chestnut Street",
      city: "San Francisco",
      state: "CA",
      postalCode: "94123",
      lat: 37.8002,
      lng: -122.4391,
      phone: "(415) 890-4300",
      email: "marina@velahealth.com",
      hours: "Mon - Sat: 8:30 AM - 6:00 PM",
      parking: "Street metered parking & Lombard St public garage within 2 blocks.",
      access: "Ground level zero-threshold entry with wide corridors.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "clinic-pac-heights",
      name: "Vela Pacific Heights Suite",
      slug: "vela-pac-heights",
      address: "2100 Webster Street, Suite 402",
      city: "San Francisco",
      state: "CA",
      postalCode: "94115",
      lat: 37.7915,
      lng: -122.4328,
      phone: "(415) 890-4400",
      email: "pacheights@velahealth.com",
      hours: "Mon - Fri: 9:00 AM - 5:30 PM",
      parking: "Valet parking available at Webster & Clay.",
      access: "Elevator accessible, certified service animal friendly.",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const c of clinics) {
    insertClinic.run(
      c.id,
      c.name,
      c.slug,
      c.address,
      c.city,
      c.state,
      c.postalCode,
      c.lat,
      c.lng,
      c.phone,
      c.email,
      c.hours,
      c.parking,
      c.access,
      c.image
    );
  }

  // 3. Services
  const insertService = db.prepare(`
    INSERT INTO services (id, specialty_id, name, description, duration_minutes, standard_fee)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const services = [
    { id: "srv-d-1", spec: "spec-derma", name: "Comprehensive Skin Health Evaluation", desc: "Full-body dermoscopy, mole mapping, and skin cancer assessment.", dur: 45, fee: 180 },
    { id: "srv-d-2", spec: "spec-derma", name: "Targeted Acne & Rosacea Consultation", desc: "Personalized medical regimen, barrier repair, and hormonal acne plan.", dur: 30, fee: 140 },
    { id: "srv-c-1", spec: "spec-cardio", name: "Preventative Cardiac Risk Screening", desc: "Advanced lipid analysis review, 12-lead ECG review, blood pressure check.", dur: 45, fee: 220 },
    { id: "srv-c-2", spec: "spec-cardio", name: "Hypertension & Heart Follow-Up", desc: "Medication adjustment, lifestyle monitoring, and telemetry check.", dur: 30, fee: 160 },
    { id: "srv-g-1", spec: "spec-general", name: "Annual Health & Longevity Physical", desc: "Head-to-toe examination, metabolic lab order, and wellness blueprint.", dur: 45, fee: 150 },
    { id: "srv-g-2", spec: "spec-general", name: "Acute Illness & Infection Visit", desc: "Rapid evaluation for respiratory, GI, or systemic symptoms.", dur: 20, fee: 110 },
    { id: "srv-p-1", spec: "spec-pedia", name: "Pediatric Wellness Check & Growth Milestone", desc: "Child growth tracking, immunizations, and developmental review.", dur: 30, fee: 130 },
  ];

  for (const s of services) {
    insertService.run(s.id, s.spec, s.name, s.desc, s.dur, s.fee);
  }

  // 4. Users & Profiles
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, avatar_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPatientProfile = db.prepare(`
    INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_type, emergency_contact_name, emergency_contact_phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDoctorProfile = db.prepare(`
    INSERT INTO doctor_profiles (user_id, specialty_id, clinic_id, license_number, bio, experience_years, consultation_fee, languages, is_verified, is_active, rating, review_count, telehealth_available, in_person_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Patient: Maria Clara Santos
  insertUser.run(
    "usr-patient-1",
    "patient@velahealth.com",
    patientPassHash,
    "PATIENT",
    "Maria",
    "Santos",
    "+1 (415) 555-0142",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    now
  );
  insertPatientProfile.run(
    "usr-patient-1",
    "1995-04-18",
    "Female",
    "O+",
    "Carlos Santos (Spouse)",
    "+1 (415) 555-0199",
    "742 Valencia St, Apt 4B, San Francisco, CA"
  );

  // Doctor 1: Dr. Elena Reyes (Dermatology)
  insertUser.run(
    "usr-doc-1",
    "doctor.reyes@velahealth.com",
    doctorPassHash,
    "DOCTOR",
    "Elena",
    "Reyes",
    "+1 (415) 555-0188",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    now
  );
  insertDoctorProfile.run(
    "usr-doc-1",
    "spec-derma",
    "clinic-central",
    "CA-MD-892147",
    "Dr. Elena Reyes is a board-certified dermatologist specializing in inflammatory skin disorders, photomedicine, and early detection of melanoma. She completed her residency at Stanford Medicine and brings 12 years of patient-centered clinical expertise.",
    12,
    160,
    JSON.stringify(["English", "Spanish"]),
    1,
    1,
    4.96,
    148,
    1,
    1
  );

  // Doctor 2: Dr. Marcus Chen (Cardiology)
  insertUser.run(
    "usr-doc-2",
    "doctor.chen@velahealth.com",
    doctorPassHash,
    "DOCTOR",
    "Marcus",
    "Chen",
    "+1 (415) 555-0177",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    now
  );
  insertDoctorProfile.run(
    "usr-doc-2",
    "spec-cardio",
    "clinic-mission-bay",
    "CA-MD-730192",
    "Dr. Marcus Chen is a Fellow of the American College of Cardiology with subspecialty focus on preventative cardiology, sports cardiology, and vascular risk modulation. Formerly lead investigator at UCSF Heart Center.",
    15,
    210,
    JSON.stringify(["English", "Mandarin", "Cantonese"]),
    1,
    1,
    4.98,
    182,
    1,
    1
  );

  // Doctor 3: Dr. Sofia Alvarez (Pediatrics)
  insertUser.run(
    "usr-doc-3",
    "doctor.alvarez@velahealth.com",
    doctorPassHash,
    "DOCTOR",
    "Sofia",
    "Alvarez",
    "+1 (415) 555-0166",
    "https://images.unsplash.com/photo-1594824813511-1a89c9223c68?auto=format&fit=crop&w=400&q=80",
    now
  );
  insertDoctorProfile.run(
    "usr-doc-3",
    "spec-pedia",
    "clinic-marina",
    "CA-MD-912048",
    "Dr. Sofia Alvarez provides gentle, evidence-based pediatric care from newborn days through adolescence. Passionate about developmental milestones and childhood nutrition.",
    8,
    130,
    JSON.stringify(["English", "Spanish"]),
    1,
    1,
    4.93,
    94,
    1,
    1
  );

  // Doctor 4: Dr. Aris Patel (Family Medicine)
  insertUser.run(
    "usr-doc-4",
    "doctor.patel@velahealth.com",
    doctorPassHash,
    "DOCTOR",
    "Aris",
    "Patel",
    "+1 (415) 555-0155",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    now
  );
  insertDoctorProfile.run(
    "usr-doc-4",
    "spec-general",
    "clinic-pac-heights",
    "CA-MD-604812",
    "Dr. Aris Patel focuses on preventative adult medicine, metabolic syndrome, and holistic lifespan wellness. He advocates for active patient partnership in clinical decisions.",
    10,
    140,
    JSON.stringify(["English", "Gujarati", "Hindi"]),
    1,
    1,
    4.91,
    115,
    1,
    1
  );

  // Admin User: Sarah Jenkins
  insertUser.run(
    "usr-admin-1",
    "admin@velahealth.com",
    adminPassHash,
    "ADMIN",
    "Sarah",
    "Jenkins",
    "+1 (415) 555-0100",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    now
  );

  // 5. Doctor Availabilities (Monday through Friday slots)
  const insertAvail = db.prepare(`
    INSERT INTO doctor_availabilities (id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_telehealth)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const docIds = ["usr-doc-1", "usr-doc-2", "usr-doc-3", "usr-doc-4"];
  let availIdx = 1;
  for (const docId of docIds) {
    for (let day = 1; day <= 5; day++) {
      // In-person morning/afternoon
      insertAvail.run(`avl-${availIdx++}`, docId, day, "09:00", "13:00", 30, 0);
      insertAvail.run(`avl-${availIdx++}`, docId, day, "14:00", "17:00", 30, 1);
    }
  }

  // 6. Appointments
  const insertAppt = db.prepare(`
    INSERT INTO appointments (id, reference_no, patient_id, doctor_id, clinic_id, service_id, scheduled_date, scheduled_time, duration_minutes, consultation_type, status, reason, clinical_notes, prescription, follow_up_instructions, checked_in_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStatusHist = db.prepare(`
    INSERT INTO appointment_status_history (id, appointment_id, status, note, changed_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Appointment 1: Today for Maria Santos with Dr. Elena Reyes (Checked in / Ready for digital check-in testing)
  insertAppt.run(
    "apt-today-1",
    "VELA-89421",
    "usr-patient-1",
    "usr-doc-1",
    "clinic-central",
    "srv-d-2",
    todayStr,
    "10:30",
    30,
    "IN_PERSON",
    "CHECKED_IN",
    "Follow-up on contact dermatitis flare-up and topical ointment review.",
    "Patient reports 70% resolution of erythematous patch on left forearm after 10 days of Desonide 0.05% ointment.",
    "Desonide 0.05% cream - Apply twice daily for 5 more days as needed.",
    "Gradually taper ointment. Switch to gentle ceramide cream (e.g. CeraVe or Cetaphil). Revisit in 4 weeks if pruritus persists.",
    new Date(Date.now() - 15 * 60000).toISOString(), // Checked in 15 mins ago
    lastWeekStr,
    now
  );
  insertStatusHist.run("ash-1", "apt-today-1", "REQUESTED", "Booking placed by patient via mobile app", "usr-patient-1", lastWeekStr);
  insertStatusHist.run("ash-2", "apt-today-1", "CONFIRMED", "Confirmed automatically by clinic scheduling system", "SYSTEM", lastWeekStr);
  insertStatusHist.run("ash-3", "apt-today-1", "CHECKED_IN", "Digital check-in completed on mobile device at reception entrance", "usr-patient-1", new Date(Date.now() - 15 * 60000).toISOString());

  // Appointment 2: Tomorrow with Dr. Marcus Chen (Upcoming)
  insertAppt.run(
    "apt-tmrw-1",
    "VELA-93042",
    "usr-patient-1",
    "usr-doc-2",
    "clinic-mission-bay",
    "srv-c-1",
    tomorrowStr,
    "14:00",
    45,
    "TELEHEALTH",
    "CONFIRMED",
    "Preventative cardiovascular health baseline & family history screening.",
    null,
    null,
    null,
    null,
    yesterdayStr,
    now
  );
  insertStatusHist.run("ash-4", "apt-tmrw-1", "REQUESTED", "Telehealth requested by patient", "usr-patient-1", yesterdayStr);
  insertStatusHist.run("ash-5", "apt-tmrw-1", "CONFIRMED", "Telehealth link generated and doctor accepted", "usr-doc-2", yesterdayStr);

  // Appointment 3: Completed last week with Dr. Elena Reyes
  insertAppt.run(
    "apt-past-1",
    "VELA-71829",
    "usr-patient-1",
    "usr-doc-1",
    "clinic-central",
    "srv-d-1",
    lastWeekStr,
    "11:00",
    45,
    "IN_PERSON",
    "COMPLETED",
    "Initial comprehensive dermoscopy & suspicious mole assessment on right shoulder.",
    "Skin Examination: Dysplastic nevus ruled benign. Mild localized eczematous lesion on left volar forearm with micro-vesiculation.",
    "Desonide 0.05% ointment 15g - apply BID for 14 days. Avoid fragrant soaps.",
    "Schedule follow-up check-in within 10-14 days.",
    lastWeekStr + "T10:48:00Z",
    new Date(Date.now() - 14 * 86400000).toISOString(),
    lastWeekStr
  );
  insertStatusHist.run("ash-6", "apt-past-1", "REQUESTED", "Booked by patient", "usr-patient-1", new Date(Date.now() - 14 * 86400000).toISOString());
  insertStatusHist.run("ash-7", "apt-past-1", "COMPLETED", "Consultation finalized by Dr. Elena Reyes", "usr-doc-1", lastWeekStr);

  // 7. Reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, appointment_id, patient_id, doctor_id, clinic_id, doctor_rating, clinic_rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertReview.run(
    "rev-1",
    "apt-past-1",
    "usr-patient-1",
    "usr-doc-1",
    "clinic-central",
    5,
    5,
    "Dr. Reyes was exceptionally thorough and calm. She clearly explained what was happening and gave me a clear treatment plan that started working in 2 days. The clinic space feels serene and unhurried.",
    lastWeekStr
  );

  // 8. Conversations & Messages
  const insertConv = db.prepare(`
    INSERT INTO conversations (id, appointment_id, patient_id, doctor_id, last_message_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMsg = db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, recipient_id, content, read_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertConv.run("conv-1", "apt-today-1", "usr-patient-1", "usr-doc-1", now);
  insertMsg.run(
    "msg-1",
    "conv-1",
    "usr-doc-1",
    "usr-patient-1",
    "Good morning Maria, I saw your digital check-in. Reception Area B is ready for you; I will call you in shortly.",
    now,
    new Date(Date.now() - 10 * 60000).toISOString()
  );
  insertMsg.run(
    "msg-2",
    "conv-1",
    "usr-patient-1",
    "usr-doc-1",
    "Thank you Dr. Reyes! I am seated by Reception Area B with the hydration bar.",
    now,
    new Date(Date.now() - 6 * 60000).toISOString()
  );

  // 9. Notifications
  const insertNotification = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNotification.run(
    "notif-1",
    "usr-patient-1",
    "Digital Check-In Available",
    "Your 10:30 AM appointment with Dr. Elena Reyes starts in 20 minutes. Tap here to check in.",
    "APPOINTMENT",
    "/patient/appointments/apt-today-1",
    1,
    new Date(Date.now() - 30 * 60000).toISOString()
  );

  insertNotification.run(
    "notif-2",
    "usr-patient-1",
    "Visit Summary Ready",
    "Clinical visit summary and prescription for your last visit are now available in your Documents.",
    "DOCUMENT",
    "/patient/documents",
    0,
    lastWeekStr
  );

  insertNotification.run(
    "notif-3",
    "usr-doc-1",
    "Patient Checked In",
    "Maria Santos has checked in for her 10:30 AM follow-up consultation in Area B.",
    "APPOINTMENT",
    "/doctor/workspace/apt-today-1",
    0,
    new Date(Date.now() - 15 * 60000).toISOString()
  );

  // 10. Patient Documents
  const insertDoc = db.prepare(`
    INSERT INTO patient_documents (id, patient_id, appointment_id, title, doc_type, file_path_or_summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertDoc.run(
    "doc-1",
    "usr-patient-1",
    "apt-past-1",
    "Dermatology Visit Summary & Care Plan",
    "VISIT_SUMMARY",
    "Clinical assessment for localized dermatitis. Desonide 0.05% prescription issued. Follow-up recommended in 2-4 weeks. Patient instructed on barrier restoration and non-comedogenic emollients.",
    lastWeekStr
  );

  insertDoc.run(
    "doc-2",
    "usr-patient-1",
    "apt-past-1",
    "Official e-Prescription — Desonide 0.05% Ointment",
    "PRESCRIPTION",
    "Rx #991048-CA | Desonide 0.05% Ointment | Sig: Apply thin film to affected areas BID x14d | Refills: 1 | Prescriber: Dr. Elena Reyes, MD (CA-MD-892147)",
    lastWeekStr
  );

  // 11. Saved Items
  const insertSaved = db.prepare(`
    INSERT INTO saved_items (id, patient_id, item_type, item_id, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertSaved.run("save-1", "usr-patient-1", "DOCTOR", "usr-doc-1", now);
  insertSaved.run("save-2", "usr-patient-1", "CLINIC", "clinic-central", now);

  // 12. Waitlist Entry
  const insertWaitlist = db.prepare(`
    INSERT INTO waitlists (id, patient_id, doctor_id, preferred_start_date, preferred_end_date, preferred_time_range, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertWaitlist.run(
    "wt-1",
    "usr-patient-1",
    "usr-doc-2",
    todayStr,
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    "Morning (09:00 - 12:00)",
    "Prefer earlier cancellation for routine cardiology check-up.",
    "ACTIVE",
    now
  );

  // 13. Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_name, action, resource, details, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run("aud-1", "usr-admin-1", "Sarah Jenkins", "SYSTEM_SEED", "DATABASE", "Initial system seed executed with verified clinics and clinicians", "127.0.0.1", now);
  insertAudit.run("aud-2", "usr-doc-1", "Dr. Elena Reyes", "UPDATE_AVAILABILITY", "SCHEDULE", "Updated weekday morning clinic hours for Vela Central Pavilion", "192.168.1.42", yesterdayStr);
  insertAudit.run("aud-3", "usr-patient-1", "Maria Santos", "DIGITAL_CHECK_IN", "APPOINTMENT:apt-today-1", "Patient verified arrival and checked in remotely via PWA", "172.56.21.90", new Date(Date.now() - 15 * 60000).toISOString());

  console.log("Database seeded successfully!");
}
