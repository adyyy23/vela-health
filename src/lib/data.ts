import { getDb } from "./db";
import {
  Clinic,
  DoctorProfile,
  Specialty,
  Service,
  Appointment,
  Conversation,
  Message,
  Notification,
  Review,
  PatientDocument,
  WaitlistEntry,
  AuditLog,
  ConsultationType,
  AppointmentStatus,
} from "@/types";

// ==========================================
// CLINICS
// ==========================================
export function getAllClinics(): Clinic[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.*, 
      (SELECT COUNT(DISTINCT user_id) FROM doctor_profiles WHERE clinic_id = c.id) as doctor_count
    FROM clinics c
    ORDER BY c.name ASC
  `).all() as any[];

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    city: r.city,
    state: r.state,
    postalCode: r.postal_code,
    latitude: r.latitude,
    longitude: r.longitude,
    phone: r.phone,
    email: r.email,
    operatingHours: r.operating_hours,
    parkingInfo: r.parking_info,
    accessibilityInfo: r.accessibility_info,
    imageUrl: r.image_url,
    doctorCount: r.doctor_count,
    nextAvailableSlot: "Today 2:30 PM",
  }));
}

export function getClinicById(id: string): Clinic | null {
  const db = getDb();
  const r = db.prepare(`
    SELECT c.*, 
      (SELECT COUNT(DISTINCT user_id) FROM doctor_profiles WHERE clinic_id = c.id) as doctor_count
    FROM clinics c
    WHERE c.id = ? OR c.slug = ?
  `).get(id, id) as any;

  if (!r) return null;

  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    city: r.city,
    state: r.state,
    postalCode: r.postal_code,
    latitude: r.latitude,
    longitude: r.longitude,
    phone: r.phone,
    email: r.email,
    operatingHours: r.operating_hours,
    parkingInfo: r.parking_info,
    accessibilityInfo: r.accessibility_info,
    imageUrl: r.image_url,
    doctorCount: r.doctor_count,
    nextAvailableSlot: "Available Today",
  };
}

// ==========================================
// SPECIALTIES & CARE FINDER
// ==========================================
export function getAllSpecialties(): Specialty[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM specialties ORDER BY name ASC").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    iconName: r.icon_name,
  }));
}

export * from "./constants";

// ==========================================
// DOCTORS
// ==========================================
export function getDoctors(filters?: {
  specialtyId?: string;
  clinicId?: string;
  consultationType?: ConsultationType;
  search?: string;
}): DoctorProfile[] {
  const db = getDb();
  let query = `
    SELECT 
      dp.*,
      u.first_name, u.last_name, u.email, u.phone, u.avatar_url,
      s.name as specialty_name,
      c.name as clinic_name
    FROM doctor_profiles dp
    JOIN users u ON dp.user_id = u.id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    LEFT JOIN clinics c ON dp.clinic_id = c.id
    WHERE dp.is_active = 1
  `;
  const params: any[] = [];

  if (filters?.specialtyId) {
    query += ` AND dp.specialty_id = ?`;
    params.push(filters.specialtyId);
  }

  if (filters?.clinicId) {
    query += ` AND dp.clinic_id = ?`;
    params.push(filters.clinicId);
  }

  if (filters?.consultationType === "TELEHEALTH") {
    query += ` AND dp.telehealth_available = 1`;
  } else if (filters?.consultationType === "IN_PERSON") {
    query += ` AND dp.in_person_available = 1`;
  }

  if (filters?.search) {
    query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR s.name LIKE ? OR c.name LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  query += ` ORDER BY dp.rating DESC, dp.experience_years DESC`;

  const rows = db.prepare(query).all(...params) as any[];

  return rows.map((r) => ({
    userId: r.user_id,
    specialtyId: r.specialty_id,
    specialtyName: r.specialty_name,
    licenseNumber: r.license_number,
    bio: r.bio,
    experienceYears: r.experience_years,
    consultationFee: r.consultation_fee,
    languages: JSON.parse(r.languages || "[]"),
    isVerified: Boolean(r.is_verified),
    isActive: Boolean(r.is_active),
    rating: r.rating,
    reviewCount: r.review_count,
    telehealthAvailable: Boolean(r.telehealth_available),
    inPersonAvailable: Boolean(r.in_person_available),
    clinicId: r.clinic_id,
    clinicName: r.clinic_name,
    user: {
      id: r.user_id,
      email: r.email,
      role: "DOCTOR",
      firstName: r.first_name,
      lastName: r.last_name,
      phone: r.phone,
      avatarUrl: r.avatar_url,
      createdAt: "",
    },
  }));
}

export function getDoctorById(userId: string): (DoctorProfile & { services: Service[]; reviews: Review[] }) | null {
  const db = getDb();
  const r = db.prepare(`
    SELECT 
      dp.*,
      u.first_name, u.last_name, u.email, u.phone, u.avatar_url,
      s.name as specialty_name,
      c.name as clinic_name
    FROM doctor_profiles dp
    JOIN users u ON dp.user_id = u.id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    LEFT JOIN clinics c ON dp.clinic_id = c.id
    WHERE dp.user_id = ?
  `).get(userId) as any;

  if (!r) return null;

  const services = db.prepare(`
    SELECT * FROM services WHERE specialty_id = ? ORDER BY standard_fee ASC
  `).all(r.specialty_id) as any[];

  const reviews = db.prepare(`
    SELECT rev.*, u.first_name || ' ' || substr(u.last_name, 1, 1) || '.' as patient_name
    FROM reviews rev
    JOIN users u ON rev.patient_id = u.id
    WHERE rev.doctor_id = ?
    ORDER BY rev.created_at DESC
  `).all(userId) as any[];

  return {
    userId: r.user_id,
    specialtyId: r.specialty_id,
    specialtyName: r.specialty_name,
    licenseNumber: r.license_number,
    bio: r.bio,
    experienceYears: r.experience_years,
    consultationFee: r.consultation_fee,
    languages: JSON.parse(r.languages || "[]"),
    isVerified: Boolean(r.is_verified),
    isActive: Boolean(r.is_active),
    rating: r.rating,
    reviewCount: r.review_count,
    telehealthAvailable: Boolean(r.telehealth_available),
    inPersonAvailable: Boolean(r.in_person_available),
    clinicId: r.clinic_id,
    clinicName: r.clinic_name,
    user: {
      id: r.user_id,
      email: r.email,
      role: "DOCTOR",
      firstName: r.first_name,
      lastName: r.last_name,
      phone: r.phone,
      avatarUrl: r.avatar_url,
      createdAt: "",
    },
    services: services.map((s) => ({
      id: s.id,
      specialtyId: s.specialty_id,
      name: s.name,
      description: s.description,
      durationMinutes: s.duration_minutes,
      standardFee: s.standard_fee,
    })),
    reviews: reviews.map((rev) => ({
      id: rev.id,
      appointmentId: rev.appointment_id,
      patientId: rev.patient_id,
      doctorId: rev.doctor_id,
      clinicId: rev.clinic_id,
      doctorRating: rev.doctor_rating,
      clinicRating: rev.clinic_rating,
      comment: rev.comment,
      patientName: rev.patient_name,
      createdAt: rev.created_at,
    })),
  };
}

// ==========================================
// SMART SCHEDULING & REAL AVAILABILITY
// ==========================================
export function getAvailableSlots(
  doctorId: string,
  dateStr: string, // YYYY-MM-DD
  consultationType: ConsultationType
): string[] {
  const db = getDb();
  const dateObj = new Date(dateStr + "T00:00:00Z");
  const dayOfWeek = dateObj.getUTCDay(); // 0 is Sunday, 1 is Monday...

  // Sunday or Saturday outside clinic hours might have no slots
  if (dayOfWeek === 0) return [];

  // Query doctor availability blocks
  const isTele = consultationType === "TELEHEALTH" ? 1 : 0;
  let blocks = db.prepare(`
    SELECT * FROM doctor_availabilities
    WHERE doctor_id = ? AND day_of_week = ? AND is_telehealth = ?
  `).all(doctorId, dayOfWeek, isTele) as any[];

  // Fallback if no specific telehealth block, use general block
  if (blocks.length === 0) {
    blocks = db.prepare(`
      SELECT * FROM doctor_availabilities
      WHERE doctor_id = ? AND day_of_week = ?
    `).all(doctorId, dayOfWeek) as any[];
  }

  if (blocks.length === 0) {
    // Default standard hours 09:00 - 16:30
    blocks = [{ start_time: "09:00", end_time: "17:00", slot_duration_minutes: 30 }];
  }

  // Find existing bookings on this date for this doctor that are not cancelled
  const bookedAppointments = db.prepare(`
    SELECT scheduled_time FROM appointments
    WHERE doctor_id = ? AND scheduled_date = ? AND status NOT IN ('CANCELLED', 'NO_SHOW')
  `).all(doctorId, dateStr) as { scheduled_time: string }[];

  const bookedSet = new Set(bookedAppointments.map((b) => b.scheduled_time));

  // Generate slots
  const slots: string[] = [];
  for (const block of blocks) {
    const [startH, startM] = block.start_time.split(":").map(Number);
    const [endH, endM] = block.end_time.split(":").map(Number);
    const duration = block.slot_duration_minutes || 30;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + duration <= endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const slotTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      // Check not booked
      if (!bookedSet.has(slotTime)) {
        slots.push(slotTime);
      }
      currentMinutes += duration;
    }
  }

  return slots;
}

// ==========================================
// APPOINTMENTS
// ==========================================
export function getAppointmentsForUser(userId: string, role: string): Appointment[] {
  const db = getDb();
  let query = `
    SELECT 
      a.*,
      pu.first_name as patient_first_name, pu.last_name as patient_last_name, pu.email as patient_email, pu.phone as patient_phone,
      du.first_name as doctor_first_name, du.last_name as doctor_last_name, du.avatar_url as doctor_avatar,
      s.name as doctor_specialty,
      c.name as clinic_name, c.address as clinic_address, c.latitude as clinic_lat, c.longitude as clinic_lng,
      srv.name as service_name,
      dp.consultation_fee as doctor_fee,
      (SELECT id FROM reviews WHERE appointment_id = a.id) as review_id
    FROM appointments a
    JOIN users pu ON a.patient_id = pu.id
    JOIN users du ON a.doctor_id = du.id
    LEFT JOIN doctor_profiles dp ON du.id = dp.user_id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    LEFT JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN services srv ON a.service_id = srv.id
  `;

  let rows: any[] = [];
  if (role === "PATIENT") {
    query += ` WHERE a.patient_id = ? ORDER BY a.scheduled_date DESC, a.scheduled_time DESC`;
    rows = db.prepare(query).all(userId) as any[];
  } else if (role === "DOCTOR") {
    query += ` WHERE a.doctor_id = ? ORDER BY a.scheduled_date ASC, a.scheduled_time ASC`;
    rows = db.prepare(query).all(userId) as any[];
  } else {
    // ADMIN sees all
    query += ` ORDER BY a.scheduled_date DESC, a.scheduled_time DESC`;
    rows = db.prepare(query).all() as any[];
  }

  return rows.map(mapAppointmentRow);
}

export function getAppointmentById(id: string): Appointment | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT 
      a.*,
      pu.first_name as patient_first_name, pu.last_name as patient_last_name, pu.email as patient_email, pu.phone as patient_phone,
      du.first_name as doctor_first_name, du.last_name as doctor_last_name, du.avatar_url as doctor_avatar,
      s.name as doctor_specialty,
      c.name as clinic_name, c.address as clinic_address, c.latitude as clinic_lat, c.longitude as clinic_lng,
      srv.name as service_name,
      dp.consultation_fee as doctor_fee,
      (SELECT id FROM reviews WHERE appointment_id = a.id) as review_id
    FROM appointments a
    JOIN users pu ON a.patient_id = pu.id
    JOIN users du ON a.doctor_id = du.id
    LEFT JOIN doctor_profiles dp ON du.id = dp.user_id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    LEFT JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN services srv ON a.service_id = srv.id
    WHERE a.id = ? OR a.reference_no = ?
  `).get(id, id) as any;

  if (!row) return null;
  return mapAppointmentRow(row);
}

function mapAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    referenceNo: row.reference_no,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    clinicId: row.clinic_id,
    serviceId: row.service_id,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    durationMinutes: row.duration_minutes,
    consultationType: row.consultation_type,
    status: row.status,
    reason: row.reason,
    clinicalNotes: row.clinical_notes,
    prescription: row.prescription,
    followUpInstructions: row.follow_up_instructions,
    checkedInAt: row.checked_in_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    patientName: `${row.patient_first_name} ${row.patient_last_name}`,
    patientEmail: row.patient_email,
    patientPhone: row.patient_phone,
    doctorName: `Dr. ${row.doctor_first_name} ${row.doctor_last_name}`,
    doctorSpecialty: row.doctor_specialty,
    doctorAvatar: row.doctor_avatar,
    doctorConsultationFee: row.doctor_fee,
    clinicName: row.clinic_name,
    clinicAddress: row.clinic_address,
    clinicLatitude: row.clinic_lat,
    clinicLongitude: row.clinic_lng,
    serviceName: row.service_name,
    hasReview: Boolean(row.review_id),
  };
}

// ==========================================
// APPOINTMENT CREATION & MUTATION
// ==========================================
export function createAppointment(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  serviceId?: string;
  scheduledDate: string;
  scheduledTime: string;
  consultationType: ConsultationType;
  reason: string;
}): { success: boolean; appointmentId?: string; error?: string } {
  const db = getDb();

  // Validate date is not in the past
  const today = new Date().toISOString().split("T")[0];
  if (data.scheduledDate < today) {
    return { success: false, error: "Cannot book appointments in the past." };
  }

  // Check double booking
  const existing = db.prepare(`
    SELECT id FROM appointments
    WHERE doctor_id = ? AND scheduled_date = ? AND scheduled_time = ? AND status NOT IN ('CANCELLED', 'NO_SHOW')
  `).get(data.doctorId, data.scheduledDate, data.scheduledTime);

  if (existing) {
    return { success: false, error: "This time slot was just taken. Please pick another available time or join the waitlist." };
  }

  const id = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const refNo = `VELA-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO appointments (
      id, reference_no, patient_id, doctor_id, clinic_id, service_id,
      scheduled_date, scheduled_time, duration_minutes, consultation_type,
      status, reason, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    refNo,
    data.patientId,
    data.doctorId,
    data.clinicId,
    data.serviceId || null,
    data.scheduledDate,
    data.scheduledTime,
    30,
    data.consultationType,
    "CONFIRMED",
    data.reason,
    now,
    now
  );

  // Status history
  db.prepare(`
    INSERT INTO appointment_status_history (id, appointment_id, status, note, changed_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`ash-${Date.now()}`, id, "CONFIRMED", "Booked and confirmed", data.patientId, now);

  // Notification for patient
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `notif-${Date.now()}-1`,
    data.patientId,
    "Appointment Confirmed",
    `Your appointment has been confirmed for ${data.scheduledDate} at ${data.scheduledTime}. Reference: ${refNo}.`,
    "APPOINTMENT",
    `/patient/appointments/${id}`,
    now
  );

  // Notification for doctor
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `notif-${Date.now()}-2`,
    data.doctorId,
    "New Patient Scheduled",
    `A new appointment has been scheduled for ${data.scheduledDate} at ${data.scheduledTime}.`,
    "APPOINTMENT",
    `/doctor/appointments`,
    now
  );

  // Create initial conversation if not exists
  const existingConv = db.prepare(`
    SELECT id FROM conversations WHERE patient_id = ? AND doctor_id = ?
  `).get(data.patientId, data.doctorId) as { id: string } | undefined;

  if (!existingConv) {
    db.prepare(`
      INSERT INTO conversations (id, appointment_id, patient_id, doctor_id, last_message_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`conv-${Date.now()}`, id, data.patientId, data.doctorId, now);
  }

  return { success: true, appointmentId: id };
}

// Digital Check-in
export function performDigitalCheckIn(appointmentId: string, patientId: string): boolean {
  const db = getDb();
  const apt = db.prepare("SELECT * FROM appointments WHERE id = ?").get(appointmentId) as any;
  if (!apt || apt.patient_id !== patientId) return false;

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE appointments 
    SET status = 'CHECKED_IN', checked_in_at = ?, updated_at = ?
    WHERE id = ?
  `).run(now, now, appointmentId);

  db.prepare(`
    INSERT INTO appointment_status_history (id, appointment_id, status, note, changed_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`ash-${Date.now()}`, appointmentId, "CHECKED_IN", "Digital check-in completed by patient", patientId, now);

  // Notify doctor
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `notif-${Date.now()}`,
    apt.doctor_id,
    "Patient Checked In",
    "Your patient has checked in and is seated in the waiting area.",
    "APPOINTMENT",
    `/doctor/workspace/${appointmentId}`,
    now
  );

  return true;
}

// Doctor Clinical Workspace: save consultation notes & complete
export function saveClinicalConsultation(
  appointmentId: string,
  doctorId: string,
  data: {
    clinicalNotes: string;
    prescription?: string;
    followUpInstructions?: string;
    markCompleted: boolean;
  }
): boolean {
  const db = getDb();
  const apt = db.prepare("SELECT * FROM appointments WHERE id = ?").get(appointmentId) as any;
  if (!apt || apt.doctor_id !== doctorId) return false;

  const now = new Date().toISOString();
  const newStatus = data.markCompleted ? "COMPLETED" : "IN_CONSULTATION";

  db.prepare(`
    UPDATE appointments 
    SET clinical_notes = ?, prescription = ?, follow_up_instructions = ?, status = ?, updated_at = ?
    WHERE id = ?
  `).run(data.clinicalNotes, data.prescription || null, data.followUpInstructions || null, newStatus, now, appointmentId);

  db.prepare(`
    INSERT INTO appointment_status_history (id, appointment_id, status, note, changed_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(`ash-${Date.now()}`, appointmentId, newStatus, `Clinical notes saved. Consultation ${newStatus.toLowerCase()}.`, doctorId, now);

  if (data.markCompleted) {
    // Generate patient document for visit summary
    const docId = `doc-${Date.now()}`;
    db.prepare(`
      INSERT INTO patient_documents (id, patient_id, appointment_id, title, doc_type, file_path_or_summary, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      docId,
      apt.patient_id,
      appointmentId,
      `Clinical Visit Summary — ${apt.scheduled_date}`,
      "VISIT_SUMMARY",
      `Diagnosis & Notes: ${data.clinicalNotes}\nPrescription: ${data.prescription || "None"}\nFollow-Up: ${data.followUpInstructions || "As needed"}`,
      now
    );

    // Notify patient
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      apt.patient_id,
      "Consultation Summary Ready",
      "Your doctor has finalized your visit summary and instructions. Tap to review.",
      "DOCUMENT",
      `/patient/documents`,
      now
    );
  }

  return true;
}

// ==========================================
// IN-APP MESSAGING
// ==========================================
export function getConversationsForUser(userId: string): Conversation[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT 
      c.*,
      pu.first_name as patient_first_name, pu.last_name as patient_last_name, pu.avatar_url as patient_avatar,
      du.first_name as doctor_first_name, du.last_name as doctor_last_name, du.avatar_url as doctor_avatar,
      s.name as doctor_specialty,
      (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg,
      (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND recipient_id = ? AND read_at IS NULL) as unread_count
    FROM conversations c
    JOIN users pu ON c.patient_id = pu.id
    JOIN users du ON c.doctor_id = du.id
    LEFT JOIN doctor_profiles dp ON du.id = dp.user_id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    WHERE c.patient_id = ? OR c.doctor_id = ?
    ORDER BY c.last_message_at DESC
  `).all(userId, userId, userId) as any[];

  return rows.map((r) => ({
    id: r.id,
    appointmentId: r.appointment_id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    lastMessageAt: r.last_message_at,
    unreadCount: r.unread_count,
    patientName: `${r.patient_first_name} ${r.patient_last_name}`,
    patientAvatar: r.patient_avatar,
    doctorName: `Dr. ${r.doctor_first_name} ${r.doctor_last_name}`,
    doctorAvatar: r.doctor_avatar,
    doctorSpecialty: r.doctor_specialty,
    lastMessage: r.last_msg || "No messages yet",
  }));
}

export function getMessagesForConversation(conversationId: string, currentUserId: string): Message[] {
  const db = getDb();

  // Mark unread messages as read
  db.prepare(`
    UPDATE messages SET read_at = ? WHERE conversation_id = ? AND recipient_id = ? AND read_at IS NULL
  `).run(new Date().toISOString(), conversationId, currentUserId);

  const rows = db.prepare(`
    SELECT m.*, u.first_name, u.last_name, u.role
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `).all(conversationId) as any[];

  return rows.map((r) => ({
    id: r.id,
    conversationId: r.conversation_id,
    senderId: r.sender_id,
    recipientId: r.recipient_id,
    content: r.content,
    readAt: r.read_at,
    createdAt: r.created_at,
    senderName: r.role === "DOCTOR" ? `Dr. ${r.first_name} ${r.last_name}` : `${r.first_name} ${r.last_name}`,
    senderRole: r.role,
  }));
}

export function sendInAppMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
}): Message | null {
  const db = getDb();
  const conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(data.conversationId) as any;
  if (!conv) return null;

  const recipientId = conv.patient_id === data.senderId ? conv.doctor_id : conv.patient_id;
  const now = new Date().toISOString();
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, recipient_id, content, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.conversationId, data.senderId, recipientId, data.content, now);

  db.prepare(`
    UPDATE conversations SET last_message_at = ? WHERE id = ?
  `).run(now, data.conversationId);

  // Notify recipient
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `notif-${Date.now()}`,
    recipientId,
    "New Healthcare Message",
    data.content.length > 50 ? `${data.content.slice(0, 50)}...` : data.content,
    "MESSAGE",
    `/messages?conv=${data.conversationId}`,
    now
  );

  return {
    id,
    conversationId: data.conversationId,
    senderId: data.senderId,
    recipientId,
    content: data.content,
    createdAt: now,
  };
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export function getNotificationsForUser(userId: string): Notification[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30
  `).all(userId) as any[];

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    title: r.title,
    message: r.message,
    type: r.type,
    link: r.link,
    isRead: Boolean(r.is_read),
    createdAt: r.created_at,
  }));
}

export function markNotificationRead(id: string, userId: string): void {
  const db = getDb();
  db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(id, userId);
}

// ==========================================
// REVIEWS
// ==========================================
export function submitReview(data: {
  appointmentId: string;
  patientId: string;
  doctorRating: number;
  clinicRating: number;
  comment?: string;
}): { success: boolean; error?: string } {
  const db = getDb();
  const apt = db.prepare("SELECT * FROM appointments WHERE id = ?").get(data.appointmentId) as any;
  if (!apt) return { success: false, error: "Appointment not found." };
  if (apt.patient_id !== data.patientId) return { success: false, error: "Unauthorized." };
  if (apt.status !== "COMPLETED") {
    return { success: false, error: "Reviews can only be submitted for completed consultations." };
  }

  const existing = db.prepare("SELECT id FROM reviews WHERE appointment_id = ?").get(data.appointmentId);
  if (existing) {
    return { success: false, error: "You have already submitted a review for this appointment." };
  }

  const id = `rev-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO reviews (id, appointment_id, patient_id, doctor_id, clinic_id, doctor_rating, clinic_rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.appointmentId, data.patientId, apt.doctor_id, apt.clinic_id, data.doctorRating, data.clinicRating, data.comment || null, now);

  // Recalculate doctor rating
  const avg = db.prepare(`
    SELECT AVG(doctor_rating) as avg_rating, COUNT(*) as count FROM reviews WHERE doctor_id = ?
  `).get(apt.doctor_id) as { avg_rating: number; count: number };

  db.prepare(`
    UPDATE doctor_profiles SET rating = ?, review_count = ? WHERE user_id = ?
  `).run(Number(avg.avg_rating.toFixed(2)), avg.count, apt.doctor_id);

  return { success: true };
}

// ==========================================
// WAITLIST
// ==========================================
export function joinWaitlist(data: {
  patientId: string;
  doctorId: string;
  preferredStartDate: string;
  preferredEndDate: string;
  preferredTimeRange: string;
  notes?: string;
}): { success: boolean; id: string } {
  const db = getDb();
  const id = `wt-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO waitlists (id, patient_id, doctor_id, preferred_start_date, preferred_end_date, preferred_time_range, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
  `).run(id, data.patientId, data.doctorId, data.preferredStartDate, data.preferredEndDate, data.preferredTimeRange, data.notes || null, now);

  return { success: true, id };
}

export function getWaitlistForPatient(patientId: string): WaitlistEntry[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT w.*, du.first_name, du.last_name, s.name as specialty_name
    FROM waitlists w
    JOIN users du ON w.doctor_id = du.id
    LEFT JOIN doctor_profiles dp ON du.id = dp.user_id
    LEFT JOIN specialties s ON dp.specialty_id = s.id
    WHERE w.patient_id = ?
    ORDER BY w.created_at DESC
  `).all(patientId) as any[];

  return rows.map((r) => ({
    id: r.id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    preferredStartDate: r.preferred_start_date,
    preferredEndDate: r.preferred_end_date,
    preferredTimeRange: r.preferred_time_range,
    notes: r.notes,
    status: r.status,
    createdAt: r.created_at,
    doctorName: `Dr. ${r.first_name} ${r.last_name}`,
    specialtyName: r.specialty_name,
  }));
}

// ==========================================
// DOCUMENTS
// ==========================================
export function getPatientDocuments(patientId: string): PatientDocument[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM patient_documents WHERE patient_id = ? ORDER BY created_at DESC
  `).all(patientId) as any[];

  return rows.map((r) => ({
    id: r.id,
    patientId: r.patient_id,
    appointmentId: r.appointment_id,
    title: r.title,
    docType: r.doc_type,
    filePathOrSummary: r.file_path_or_summary,
    createdAt: r.created_at,
  }));
}

// ==========================================
// SAVED ITEMS
// ==========================================
export function getSavedItemsForPatient(patientId: string): { doctors: DoctorProfile[]; clinics: Clinic[] } {
  const db = getDb();
  const saved = db.prepare("SELECT * FROM saved_items WHERE patient_id = ?").all(patientId) as any[];

  const docIds = saved.filter((s) => s.item_type === "DOCTOR").map((s) => s.item_id);
  const clinicIds = saved.filter((s) => s.item_type === "CLINIC").map((s) => s.item_id);

  const doctors = docIds.map((id) => getDoctorById(id)).filter(Boolean) as DoctorProfile[];
  const clinics = clinicIds.map((id) => getClinicById(id)).filter(Boolean) as Clinic[];

  return { doctors, clinics };
}

export function toggleSavedItem(patientId: string, itemType: "DOCTOR" | "CLINIC", itemId: string): boolean {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM saved_items WHERE patient_id = ? AND item_type = ? AND item_id = ?").get(patientId, itemType, itemId);

  if (existing) {
    db.prepare("DELETE FROM saved_items WHERE patient_id = ? AND item_type = ? AND item_id = ?").run(patientId, itemType, itemId);
    return false; // Removed
  } else {
    db.prepare("INSERT INTO saved_items (id, patient_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?, ?)").run(
      `sav-${Date.now()}`,
      patientId,
      itemType,
      itemId,
      new Date().toISOString()
    );
    return true; // Added
  }
}

// ==========================================
// ADMIN OPERATIONS BOARD & METRICS
// ==========================================
export function getAdminOperationsBoard() {
  const db = getDb();
  const todayStr = new Date().toISOString().split("T")[0];

  const todayAppointments = getAppointmentsForUser("", "ADMIN").filter(
    (a) => a.scheduledDate === todayStr || a.status === "CHECKED_IN" || a.status === "IN_CONSULTATION"
  );

  return {
    checkedIn: todayAppointments.filter((a) => a.status === "CHECKED_IN"),
    waiting: todayAppointments.filter((a) => a.status === "UPCOMING" || a.status === "CONFIRMED"),
    inConsultation: todayAppointments.filter((a) => a.status === "IN_CONSULTATION"),
    completed: todayAppointments.filter((a) => a.status === "COMPLETED"),
    delayed: todayAppointments.filter((a) => a.status === "RESCHEDULED" || (a.status === "REQUESTED" && a.scheduledDate <= todayStr)),
  };
}

export function getAdminOverviewMetrics() {
  const db = getDb();
  const totalAppointments = (db.prepare("SELECT COUNT(*) as count FROM appointments").get() as any).count;
  const activeDoctors = (db.prepare("SELECT COUNT(*) as count FROM doctor_profiles WHERE is_active = 1").get() as any).count;
  const totalClinics = (db.prepare("SELECT COUNT(*) as count FROM clinics").get() as any).count;
  const totalPatients = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'PATIENT'").get() as any).count;
  const checkedInNow = (db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'CHECKED_IN'").get() as any).count;
  const inConsultationNow = (db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'IN_CONSULTATION'").get() as any).count;

  // Specialty breakdown
  const specialtyStats = db.prepare(`
    SELECT s.name, COUNT(a.id) as count
    FROM specialties s
    JOIN doctor_profiles dp ON s.id = dp.specialty_id
    JOIN appointments a ON dp.user_id = a.doctor_id
    GROUP BY s.id
    ORDER BY count DESC
    LIMIT 5
  `).all() as { name: string; count: number }[];

  return {
    totalAppointments,
    activeDoctors,
    totalClinics,
    totalPatients,
    checkedInNow,
    inConsultationNow,
    specialtyStats,
  };
}

export function getAuditLogs(): AuditLog[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    action: r.action,
    resource: r.resource,
    details: r.details,
    ipAddress: r.ip_address,
    createdAt: r.created_at,
  }));
}
