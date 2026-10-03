import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (process.env.VERCEL && !process.env.VELA_DATABASE_PATH)
    throw new Error("Persistent database configuration required.");
  const dbPath =
    process.env.VELA_DATABASE_PATH ||
    path.join(process.cwd(), "data", "vela.db");
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable WAL mode for better concurrency and performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initializeSchema(db);
  dbInstance = db;
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      avatar_url TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      date_of_birth TEXT,
      gender TEXT,
      blood_type TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS specialties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clinics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      operating_hours TEXT NOT NULL,
      parking_info TEXT,
      accessibility_info TEXT,
      image_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doctor_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      specialty_id TEXT REFERENCES specialties(id),
      clinic_id TEXT REFERENCES clinics(id),
      license_number TEXT NOT NULL,
      bio TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      consultation_fee REAL NOT NULL,
      languages TEXT NOT NULL,
      is_verified INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      telehealth_available INTEGER DEFAULT 1,
      in_person_available INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      specialty_id TEXT REFERENCES specialties(id),
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER DEFAULT 30,
      standard_fee REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doctor_availabilities (
      id TEXT PRIMARY KEY,
      doctor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      slot_duration_minutes INTEGER DEFAULT 30,
      is_telehealth INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      reference_no TEXT UNIQUE NOT NULL,
      patient_id TEXT REFERENCES users(id),
      doctor_id TEXT REFERENCES users(id),
      clinic_id TEXT REFERENCES clinics(id),
      service_id TEXT REFERENCES services(id),
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 30,
      consultation_type TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT NOT NULL,
      clinical_notes TEXT,
      prescription TEXT,
      follow_up_instructions TEXT,
      checked_in_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointment_status_history (
      id TEXT PRIMARY KEY,
      appointment_id TEXT REFERENCES appointments(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      note TEXT,
      changed_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      appointment_id TEXT REFERENCES appointments(id) ON DELETE SET NULL,
      patient_id TEXT REFERENCES users(id),
      doctor_id TEXT REFERENCES users(id),
      last_message_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT REFERENCES users(id),
      recipient_id TEXT REFERENCES users(id),
      content TEXT NOT NULL,
      read_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      appointment_id TEXT UNIQUE REFERENCES appointments(id),
      patient_id TEXT REFERENCES users(id),
      doctor_id TEXT REFERENCES users(id),
      clinic_id TEXT REFERENCES clinics(id),
      doctor_rating INTEGER NOT NULL,
      clinic_rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_documents (
      id TEXT PRIMARY KEY,
      patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      appointment_id TEXT REFERENCES appointments(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      file_path_or_summary TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS waitlists (
      id TEXT PRIMARY KEY,
      patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      doctor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      preferred_start_date TEXT NOT NULL,
      preferred_end_date TEXT NOT NULL,
      preferred_time_range TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      patient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(patient_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date, scheduled_time);
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id, status);
    CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id, status);
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
  `);
}
