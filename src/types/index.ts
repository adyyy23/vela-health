export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export type AppointmentStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "UPCOMING"
  | "CHECKED_IN"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "NO_SHOW";

export type ConsultationType = "IN_PERSON" | "TELEHEALTH";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface PatientProfile {
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
}

export interface DoctorProfile {
  userId: string;
  specialtyId: string;
  specialtyName?: string;
  licenseNumber: string;
  bio: string;
  experienceYears: number;
  consultationFee: number;
  languages: string[];
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  telehealthAvailable: boolean;
  inPersonAvailable: boolean;
  clinicId?: string;
  clinicName?: string;
  user?: User;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  operatingHours: string;
  parkingInfo: string;
  accessibilityInfo: string;
  imageUrl: string;
  doctorCount?: number;
  nextAvailableSlot?: string;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  specialtyId: string;
  name: string;
  description: string;
  durationMinutes: number;
  standardFee: number;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  slotDurationMinutes: number;
  isTelehealth: boolean;
}

export interface Appointment {
  id: string;
  referenceNo: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  serviceId?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  durationMinutes: number;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  reason: string;
  clinicalNotes?: string;
  prescription?: string;
  followUpInstructions?: string;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joins
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorAvatar?: string;
  doctorConsultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
  clinicLatitude?: number;
  clinicLongitude?: number;
  serviceName?: string;
  hasReview?: boolean;
}

export interface AppointmentStatusHistory {
  id: string;
  appointmentId: string;
  status: AppointmentStatus;
  note?: string;
  changedBy: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  lastMessageAt: string;
  unreadCount?: number;
  patientName?: string;
  patientAvatar?: string;
  doctorName?: string;
  doctorAvatar?: string;
  doctorSpecialty?: string;
  lastMessage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  readAt?: string;
  createdAt: string;
  senderName?: string;
  senderRole?: UserRole;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "APPOINTMENT" | "MESSAGE" | "WAITLIST" | "DOCUMENT" | "SYSTEM";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  doctorRating: number;
  clinicRating: number;
  comment?: string;
  patientName?: string;
  createdAt: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  appointmentId?: string;
  title: string;
  docType: "VISIT_SUMMARY" | "PRESCRIPTION" | "REFERRAL" | "LAB_RESULT";
  filePathOrSummary: string;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  doctorId: string;
  preferredStartDate: string;
  preferredEndDate: string;
  preferredTimeRange: string;
  notes?: string;
  status: "ACTIVE" | "OFFERED" | "FULFILLED" | "EXPIRED";
  createdAt: string;
  doctorName?: string;
  specialtyName?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
