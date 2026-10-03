import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase";
import { Clinic, DoctorProfile, Specialty, Appointment } from "@/types";

// ==========================================
// CLINICS FROM SUPABASE
// ==========================================
export async function getClinicsFromSupabase(): Promise<Clinic[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from("clinics").select("*").order("name");
    if (error || !data) return null;

    return data.map((r: any) => ({
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
      doctorCount: 2,
      nextAvailableSlot: "Available Today",
    }));
  } catch (err) {
    console.error("Supabase getClinics error:", err);
    return null;
  }
}

// ==========================================
// DOCTORS FROM SUPABASE
// ==========================================
export async function getDoctorsFromSupabase(): Promise<DoctorProfile[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("doctor_profiles")
      .select(`
        *,
        users!doctor_profiles_user_id_fkey ( id, email, first_name, last_name, avatar_url, phone ),
        specialties!doctor_profiles_specialty_id_fkey ( name, slug ),
        clinics!doctor_profiles_clinic_id_fkey ( name, address, city )
      `);

    if (error || !data) return null;

    return data.map((r: any) => ({
      userId: r.user_id,
      specialtyId: r.specialty_id,
      specialtyName: r.specialties?.name || "General Medicine",
      licenseNumber: r.license_number,
      bio: r.bio,
      experienceYears: r.experience_years,
      consultationFee: Number(r.consultation_fee),
      languages: Array.isArray(r.languages) ? r.languages : ["English"],
      isVerified: Boolean(r.is_verified),
      isActive: Boolean(r.is_active),
      rating: Number(r.rating || 5.0),
      reviewCount: r.review_count || 0,
      telehealthAvailable: Boolean(r.telehealth_available),
      inPersonAvailable: Boolean(r.in_person_available),
      clinicId: r.clinic_id,
      clinicName: r.clinics?.name || "Vela Central Pavilion",
      clinicAddress: r.clinics?.address || "450 Sutter St",
      user: {
        id: r.users?.id,
        email: r.users?.email,
        role: "DOCTOR" as any,
        firstName: r.users?.first_name || "Doctor",
        lastName: r.users?.last_name || "Vela",
        avatarUrl: r.users?.avatar_url,
        phone: r.users?.phone,
        createdAt: new Date().toISOString(),
      },
    }));
  } catch (err) {
    console.error("Supabase getDoctors error:", err);
    return null;
  }
}

// ==========================================
// APPOINTMENTS FROM SUPABASE
// ==========================================
export async function getAppointmentsFromSupabase(userId?: string, role?: string): Promise<Appointment[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    let query = supabase.from("appointments").select(`
      *,
      patient:users!appointments_patient_id_fkey ( first_name, last_name, email, phone ),
      doctor:users!appointments_doctor_id_fkey ( first_name, last_name, avatar_url ),
      doctor_profiles!appointments_doctor_id_fkey ( consultation_fee ),
      clinics ( name, address, latitude, longitude ),
      services ( name )
    `);

    if (role === "PATIENT" && userId) {
      query = query.eq("patient_id", userId);
    } else if (role === "DOCTOR" && userId) {
      query = query.eq("doctor_id", userId);
    }

    const { data, error } = await query.order("scheduled_date", { ascending: false });
    if (error || !data) return null;

    return data.map((r: any) => ({
      id: r.id,
      referenceNo: r.reference_no,
      patientId: r.patient_id,
      doctorId: r.doctor_id,
      clinicId: r.clinic_id,
      serviceId: r.service_id,
      scheduledDate: r.scheduled_date,
      scheduledTime: r.scheduled_time,
      durationMinutes: r.duration_minutes,
      consultationType: r.consultation_type,
      status: r.status,
      reason: r.reason,
      clinicalNotes: r.clinical_notes,
      prescription: r.prescription,
      followUpInstructions: r.follow_up_instructions,
      checkedInAt: r.checked_in_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      patientName: r.patient ? `${r.patient.first_name} ${r.patient.last_name}` : "Alex Johnson",
      patientEmail: r.patient?.email,
      patientPhone: r.patient?.phone,
      doctorName: r.doctor ? `Dr. ${r.doctor.first_name} ${r.doctor.last_name}` : "Dr. Elena Reyes",
      doctorSpecialty: "Dermatology",
      doctorAvatar: r.doctor?.avatar_url,
      doctorConsultationFee: 160,
      clinicName: r.clinics?.name || "Vela Central Pavilion",
      clinicAddress: r.clinics?.address || "450 Sutter St",
      clinicLatitude: r.clinics?.latitude || 37.7896,
      clinicLongitude: r.clinics?.longitude || -122.4082,
      serviceName: r.services?.name,
      hasReview: false,
    }));
  } catch (err) {
    console.error("Supabase getAppointments error:", err);
    return null;
  }
}

// ==========================================
// UPDATE APPOINTMENT STATUS IN SUPABASE
// ==========================================
export async function updateAppointmentStatusInSupabase(
  appointmentId: string,
  newStatus: string,
  changedBy: string,
  note?: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  try {
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status: newStatus, updated_at: now })
      .eq("id", appointmentId);

    if (updateError) return false;

    // Insert status history
    await supabase.from("appointment_status_history").insert({
      id: `ash-${Date.now()}`,
      appointment_id: appointmentId,
      status: newStatus,
      note: note || `Status changed to ${newStatus}`,
      changed_by: changedBy,
      created_at: now,
    });

    return true;
  } catch (err) {
    console.error("Supabase updateAppointmentStatus error:", err);
    return false;
  }
}

// ==========================================
// CREATE APPOINTMENT IN SUPABASE
// ==========================================
export async function createAppointmentInSupabase(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  serviceId?: string;
  scheduledDate: string;
  scheduledTime: string;
  consultationType: string;
  reason: string;
}): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  try {
    const id = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const refNo = `VELA-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const { error } = await supabase.from("appointments").insert({
      id,
      reference_no: refNo,
      patient_id: data.patientId,
      doctor_id: data.doctorId,
      clinic_id: data.clinicId,
      service_id: data.serviceId || null,
      scheduled_date: data.scheduledDate,
      scheduled_time: data.scheduledTime,
      duration_minutes: 30,
      consultation_type: data.consultationType,
      status: "CONFIRMED",
      reason: data.reason,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, appointmentId: id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
