-- ==============================================================================
-- VELA HEALTHCARE — SUPABASE POSTGRESQL SCHEMA & INITIAL DATA SEED
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to initialize all tables, indexes, RLS policies, and seed data.
-- ==============================================================================

-- 1. CLEANUP EXISTING TABLES (IF RE-RUNNING)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS saved_items CASCADE;
DROP TABLE IF EXISTS waitlists CASCADE;
DROP TABLE IF EXISTS patient_documents CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS appointment_status_history CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_availabilities CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS doctor_profiles CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE CORE TABLES

-- Users (Patients, Doctors, Admins)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient Profiles
CREATE TABLE patient_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth TEXT,
  gender TEXT,
  blood_type TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  address TEXT
);

-- Specialties
CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL
);

-- Clinics (Physical facilities)
CREATE TABLE clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  parking_info TEXT,
  accessibility_info TEXT,
  image_url TEXT NOT NULL
);

-- Doctor Profiles
CREATE TABLE doctor_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialty_id TEXT REFERENCES specialties(id),
  clinic_id TEXT REFERENCES clinics(id),
  license_number TEXT NOT NULL,
  bio TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  consultation_fee NUMERIC(10, 2) NOT NULL,
  languages JSONB NOT NULL DEFAULT '["English"]',
  is_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  telehealth_available BOOLEAN DEFAULT TRUE,
  in_person_available BOOLEAN DEFAULT TRUE
);

-- Services
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  specialty_id TEXT REFERENCES specialties(id),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  standard_fee NUMERIC(10, 2) NOT NULL
);

-- Doctor Weekly Availability
CREATE TABLE doctor_availabilities (
  id TEXT PRIMARY KEY,
  doctor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 30,
  is_telehealth BOOLEAN DEFAULT FALSE
);

-- Appointments
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  reference_no TEXT UNIQUE NOT NULL,
  patient_id TEXT REFERENCES users(id),
  doctor_id TEXT REFERENCES users(id),
  clinic_id TEXT REFERENCES clinics(id),
  service_id TEXT REFERENCES services(id),
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('IN_PERSON', 'TELEHEALTH')),
  status TEXT NOT NULL CHECK (status IN ('REQUESTED', 'CONFIRMED', 'UPCOMING', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW')),
  reason TEXT NOT NULL,
  clinical_notes TEXT,
  prescription TEXT,
  follow_up_instructions TEXT,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointment Status History
CREATE TABLE appointment_status_history (
  id TEXT PRIMARY KEY,
  appointment_id TEXT REFERENCES appointments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  changed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  appointment_id TEXT REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id TEXT REFERENCES users(id),
  doctor_id TEXT REFERENCES users(id),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT REFERENCES users(id),
  recipient_id TEXT REFERENCES users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  appointment_id TEXT UNIQUE REFERENCES appointments(id),
  patient_id TEXT REFERENCES users(id),
  doctor_id TEXT REFERENCES users(id),
  clinic_id TEXT REFERENCES clinics(id),
  doctor_rating INTEGER NOT NULL,
  clinic_rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient Documents
CREATE TABLE patient_documents (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  appointment_id TEXT REFERENCES appointments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  file_path_or_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Waitlists
CREATE TABLE waitlists (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  preferred_start_date TEXT NOT NULL,
  preferred_end_date TEXT NOT NULL,
  preferred_time_range TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved Items
CREATE TABLE saved_items (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(patient_id, item_type, item_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX idx_appointments_date ON appointments(scheduled_date, scheduled_time);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id, status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id, status);
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- For the portfolio/demo platform, enable open read/write access:
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to users" ON users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to patient_profiles" ON patient_profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to specialties" ON specialties FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to clinics" ON clinics FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to doctor_profiles" ON doctor_profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to services" ON services FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE doctor_availabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to doctor_availabilities" ON doctor_availabilities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE appointment_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to appointment_status_history" ON appointment_status_history FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to messages" ON messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to patient_documents" ON patient_documents FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE waitlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to waitlists" ON waitlists FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to saved_items" ON saved_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- Specialties
INSERT INTO specialties (id, name, slug, description, icon_name) VALUES
('spec-derma', 'Dermatology', 'dermatology', 'Advanced medical and cosmetic skin, hair, and nail treatments.', 'Sparkles'),
('spec-cardio', 'Cardiology', 'cardiology', 'Heart disease prevention, lipid diagnostics, and hypertension care.', 'HeartPulse'),
('spec-general', 'Family & General Medicine', 'general-medicine', 'Comprehensive primary care, chronic illness, and annual physicals.', 'Stethoscope'),
('spec-pedia', 'Pediatrics & Child Health', 'pediatrics', 'Developmental screening, childhood wellness, and vaccinations.', 'Baby'),
('spec-women', 'Women''s Health & OB-GYN', 'womens-health', 'Reproductive care, prenatal counseling, and preventative screening.', 'ShieldAlert'),
('spec-mental', 'Mental & Behavioral Wellness', 'mental-wellness', 'Cognitive therapy, anxiety treatment, and emotional wellness.', 'Smile'),
('spec-dental', 'Dental & Oral Care', 'dental', 'Preventive cleanings, periodontal health, and restorative care.', 'Activity'),
('spec-eye', 'Ophthalmology & Eye Care', 'eye-care', 'Vision diagnostics, corneal health, and laser evaluations.', 'Eye');

-- Clinics
INSERT INTO clinics (id, name, slug, address, city, state, postal_code, latitude, longitude, phone, email, operating_hours, parking_info, accessibility_info, image_url) VALUES
('clinic-central', 'Vela Central Pavilion', 'vela-central-pavilion', '450 Sutter St, Suite 800', 'San Francisco', 'CA', '94108', 37.7896, -122.4082, '(415) 890-4100', 'central@velahealth.com', 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 3:00 PM', 'Underground parking validation available on Sutter St entrance.', 'ADA Compliant with dedicated elevator bank and barrier-free access.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'),
('clinic-mission-bay', 'Vela Mission Bay Health Hub', 'vela-mission-bay', '1600 Owens Street, 3rd Floor', 'San Francisco', 'CA', '94158', 37.7682, -122.3921, '(415) 890-4200', 'missionbay@velahealth.com', 'Mon - Fri: 7:30 AM - 6:30 PM | Sat: 8:30 AM - 2:00 PM', 'Direct garage parking next to UCSF Mission Bay campus.', 'Wheelchair accessible, hearing loop installed at reception.', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'),
('clinic-marina', 'Vela Marina Wellness Studio', 'vela-marina', '2210 Chestnut Street', 'San Francisco', 'CA', '94123', 37.8002, -122.4391, '(415) 890-4300', 'marina@velahealth.com', 'Mon - Sat: 8:30 AM - 6:00 PM', 'Street metered parking & Lombard St public garage within 2 blocks.', 'Ground level entry with zero steps, wide doorways.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'),
('clinic-pac-heights', 'Vela Pacific Heights Diagnostic Center', 'vela-pacific-heights', '2100 Webster St, Suite 400', 'San Francisco', 'CA', '94115', 37.7905, -122.4314, '(415) 890-4400', 'pacheights@velahealth.com', 'Mon - Fri: 8:00 AM - 5:30 PM', 'Valet parking available at building entrance.', 'Full accessibility suite with braille signage and tactile indicators.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80');

-- Users
-- Password hashes (bcrypt):
-- PatientPass123! -> $2a$10$w3U/4X9/o/2sV1w8K2E2UeGq/57R5Xq3Z0V9I5lX9Q7G0D5K1W0S2
-- DoctorPass123!  -> $2a$10$w3U/4X9/o/2sV1w8K2E2UeGq/57R5Xq3Z0V9I5lX9Q7G0D5K1W0S2
-- AdminPass123!   -> $2a$10$w3U/4X9/o/2sV1w8K2E2UeGq/57R5Xq3Z0V9I5lX9Q7G0D5K1W0S2
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, avatar_url) VALUES
('usr-patient-1', 'patient@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'PATIENT', 'Alex', 'Johnson', '(415) 555-0182', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
('usr-patient-2', 'clara.santos@gmail.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'PATIENT', 'Maria Clara', 'Santos', '(415) 555-0199', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'),
('usr-doctor-1', 'doctor@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'DOCTOR', 'Elena', 'Reyes', '(415) 890-4101', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'),
('usr-doctor-2', 'marcus.vance@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'DOCTOR', 'Marcus', 'Vance', '(415) 890-4201', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'),
('usr-doctor-3', 'sarah.lin@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'DOCTOR', 'Sarah', 'Lin', '(415) 890-4301', 'https://images.unsplash.com/photo-1594824813639-44d471ffae0f?auto=format&fit=crop&w=300&q=80'),
('usr-doctor-4', 'james.wilson@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'DOCTOR', 'James', 'Wilson', '(415) 890-4401', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80'),
('usr-admin-1', 'admin@velahealth.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkF7H3u76V.C76q172aIq0f6v7f5YxG', 'ADMIN', 'Eleanor', 'Perez', '(415) 890-4000', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80');

-- Patient Profiles
INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_type, emergency_contact_name, emergency_contact_phone, address) VALUES
('usr-patient-1', '1992-06-14', 'Non-Binary', 'O+', 'Taylor Johnson', '(415) 555-0183', '842 Folsom St, San Francisco CA 94107'),
('usr-patient-2', '1995-04-18', 'Female', 'A+', 'Carlos Santos', '(415) 555-0199', '1240 Valencia St, San Francisco CA 94110');

-- Doctor Profiles
INSERT INTO doctor_profiles (user_id, specialty_id, clinic_id, license_number, bio, experience_years, consultation_fee, languages, is_verified, is_active, rating, review_count, telehealth_available, in_person_available) VALUES
('usr-doctor-1', 'spec-derma', 'clinic-central', 'CA-MD-892147', 'Board-certified dermatologist specializing in precision dermatoscopy, acne therapies, and procedural aesthetic medicine. Stanford Medical School alumnus.', 12, 160.00, '["English", "Spanish"]', TRUE, TRUE, 4.96, 128, TRUE, TRUE),
('usr-doctor-2', 'spec-cardio', 'clinic-mission-bay', 'CA-MD-730194', 'Preventive cardiologist focused on early arterial diagnostics, lipid panel optimization, and exercise cardiology protocols. Former UCSF cardiology fellow.', 15, 210.00, '["English"]', TRUE, TRUE, 4.92, 94, TRUE, TRUE),
('usr-doctor-3', 'spec-general', 'clinic-marina', 'CA-MD-618420', 'Family medicine physician with a holistic, evidence-based focus on lifestyle interventions, executive health, and metabolic health restoration.', 9, 140.00, '["English", "Mandarin"]', TRUE, TRUE, 4.98, 175, TRUE, TRUE),
('usr-doctor-4', 'spec-pedia', 'clinic-pac-heights', 'CA-MD-529013', 'Dedicated pediatrician championing compassionate childhood milestone screening, allergy management, and adolescent medicine.', 14, 150.00, '["English", "French"]', TRUE, TRUE, 4.89, 83, TRUE, TRUE);

-- Services
INSERT INTO services (id, specialty_id, name, description, duration_minutes, standard_fee) VALUES
('srv-skin-eval', 'spec-derma', 'Comprehensive Skin Screening', 'Full-body digital dermoscopy, mole mapping, and suspicious lesion evaluation.', 30, 160.00),
('srv-acne-care', 'spec-derma', 'Targeted Acne & Rosacea Consultation', 'Personalized medical dermatological treatment plan including prescription management.', 25, 130.00),
('srv-ecg-eval', 'spec-cardio', '12-Lead Diagnostic ECG & Review', 'Clinical resting ECG with immediate cardiologist interpretation and vascular review.', 30, 210.00),
('srv-annual-phys', 'spec-general', 'Executive Annual Wellness Physical', 'Full biometric assessment, metabolic screening, and preventive health strategy.', 45, 190.00);

-- Appointments
INSERT INTO appointments (id, reference_no, patient_id, doctor_id, clinic_id, service_id, scheduled_date, scheduled_time, duration_minutes, consultation_type, status, reason, clinical_notes, prescription, follow_up_instructions, checked_in_at) VALUES
('apt-101', 'VELA-48192', 'usr-patient-1', 'usr-doctor-1', 'clinic-central', 'srv-skin-eval', CURRENT_DATE::text, '10:00 AM', 30, 'IN_PERSON', 'CHECKED_IN', 'Localized pruritic erythematous rash on left forearm for 2 weeks.', 'Mild localized eczematous patch noted on volar forearm. Dermoscopy confirms benign contact dermatitis.', 'Desonide 0.05% ointment. Apply BID x14d to affected areas.', 'Maintain skin barrier hydration with fragrance-free ceramide emollients. Follow-up in 3 weeks if no resolution.', NOW() - INTERVAL '30 minutes'),
('apt-102', 'VELA-71934', 'usr-patient-2', 'usr-doctor-1', 'clinic-central', 'srv-acne-care', CURRENT_DATE::text, '11:15 AM', 30, 'IN_PERSON', 'CONFIRMED', 'Follow-up on hormonal acne management and topical retinoid check.', NULL, NULL, NULL, NULL),
('apt-103', 'VELA-82015', 'usr-patient-1', 'usr-doctor-2', 'clinic-mission-bay', 'srv-ecg-eval', (CURRENT_DATE + 2)::text, '02:00 PM', 30, 'TELEHEALTH', 'CONFIRMED', 'Annual preventive cardiovascular checkup and cholesterol profile review.', NULL, NULL, NULL, NULL),
('apt-104', 'VELA-39108', 'usr-patient-1', 'usr-doctor-3', 'clinic-marina', 'srv-annual-phys', (CURRENT_DATE - 7)::text, '09:00 AM', 45, 'IN_PERSON', 'COMPLETED', 'Routine comprehensive annual wellness evaluation.', 'Vitals stable. BP 118/76, HR 68. Routine lab work ordered.', 'Multivitamin daily, increase hydration.', 'Routine annual visit completed. Schedule follow-up in 12 months.', NOW() - INTERVAL '7 days');

-- Conversations & Messages
INSERT INTO conversations (id, appointment_id, patient_id, doctor_id, last_message_at) VALUES
('conv-1', 'apt-101', 'usr-patient-1', 'usr-doctor-1', NOW() - INTERVAL '15 minutes');

INSERT INTO messages (id, conversation_id, sender_id, recipient_id, content, created_at) VALUES
('msg-1', 'conv-1', 'usr-patient-1', 'usr-doctor-1', 'Good morning Dr. Reyes, I just checked in at reception Area B for my 10:00 AM appointment.', NOW() - INTERVAL '25 minutes'),
('msg-2', 'conv-1', 'usr-doctor-1', 'usr-patient-1', 'Welcome Alex! I am finishing with my previous chart and will call you into Exam Room 3B in about 5 minutes.', NOW() - INTERVAL '15 minutes');

-- Notifications
INSERT INTO notifications (id, user_id, title, message, type, link, is_read) VALUES
('notif-1', 'usr-patient-1', 'Appointment Checked In', 'You are checked in for Dr. Elena Reyes. Please take a seat in Reception Area B.', 'APPOINTMENT', '/patient/appointments/apt-101', FALSE),
('notif-2', 'usr-doctor-1', 'Patient In Waiting Room', 'Alex Johnson has arrived and completed digital intake.', 'APPOINTMENT', '/doctor/workspace/apt-101', FALSE);

-- Patient Documents
INSERT INTO patient_documents (id, patient_id, appointment_id, title, doc_type, file_path_or_summary) VALUES
('doc-1', 'usr-patient-1', 'apt-104', 'Dermatology Visit Summary & Care Plan', 'VISIT_SUMMARY', 'CLINICAL VISIT SUMMARY\n\nAttending: Dr. Elena Reyes, MD\nEncounter: October 2026\nFacility: Vela Central Pavilion, Suite 800\n\nSUBJECTIVE:\nPatient presents with pruritic localized erythema on the left volar forearm for 10 days.\n\nOBJECTIVE:\nCutaneous exam reveals mild localized eczematous plaque with subtle micro-vesiculation.\n\nASSESSMENT & PLAN:\n1. Contact dermatitis, unspecified etiology.\n2. Prescribed Desonide 0.05% ointment. Apply BID x14d.\n3. Educated on barrier restoration with fragrance-free ceramide emollients.'),
('doc-2', 'usr-patient-1', 'apt-104', 'Official e-Prescription — Desonide 0.05% Ointment', 'PRESCRIPTION', 'ELECTRONIC PRESCRIPTION ORDER\n\nRx ID: #991048-CA\nPatient: Alex Johnson (DOB: 1992-06-14)\nPrescriber: Dr. Elena Reyes, MD\nDEA / NPI: 8921471029\n\nMEDICATION:\nDesonide 0.05% Topical Ointment (15g)\nSig: Apply thin film to affected forearm areas twice daily for 14 days\nRefills Authorized: 1\nDispensed To: Walgreens Pharmacy #0214, SF CA');

-- Audit Logs
INSERT INTO audit_logs (id, user_id, user_name, action, resource, details) VALUES
('log-1', 'usr-patient-1', 'Alex Johnson', 'CHECK_IN', 'appointment:apt-101', 'Digital self check-in triggered via Mobile PWA'),
('log-2', 'usr-doctor-1', 'Dr. Elena Reyes', 'OPEN_WORKSPACE', 'encounter:apt-101', 'Clinical documentation workspace opened');
