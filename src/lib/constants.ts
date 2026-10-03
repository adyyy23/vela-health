export interface CareCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  specialtySlug: string;
  commonSymptoms: string[];
}

export const CARE_FINDER_CATEGORIES: CareCategory[] = [
  {
    id: "care-general",
    title: "General Consultation & Physicals",
    description: "Annual checkups, illness diagnosis, fatigue, blood panels, and preventative health.",
    icon: "Stethoscope",
    specialtySlug: "general-medicine",
    commonSymptoms: ["Annual exam", "Fatigue", "Flu & viral", "Prescription renewal"],
  },
  {
    id: "care-skin",
    title: "Skin, Rash & Dermatologic Concerns",
    description: "Acne, eczema, moles, unexpected rashes, hair loss, and full-body skin scans.",
    icon: "Sparkles",
    specialtySlug: "dermatology",
    commonSymptoms: ["Severe acne", "Mole check", "Unexplained rash", "Eczema"],
  },
  {
    id: "care-heart",
    title: "Heart Health & Blood Pressure",
    description: "Hypertension, palpitations, cholesterol management, and cardiac risk checks.",
    icon: "HeartPulse",
    specialtySlug: "cardiology",
    commonSymptoms: ["High blood pressure", "Chest tightness", "High cholesterol", "Heart flutter"],
  },
  {
    id: "care-children",
    title: "Children's Health & Pediatrics",
    description: "Newborn visits, childhood illness, vaccinations, growth milestones, and school sports forms.",
    icon: "Baby",
    specialtySlug: "pediatrics",
    commonSymptoms: ["Well-child check", "Fever in child", "Vaccinations", "Earache"],
  },
  {
    id: "care-women",
    title: "Women's Health & OB-GYN",
    description: "Preventative pelvic exams, cycle irregularity, family planning, and prenatal support.",
    icon: "ShieldAlert",
    specialtySlug: "womens-health",
    commonSymptoms: ["Annual pap", "Cycle irregularity", "Hormonal check", "Contraception"],
  },
  {
    id: "care-mental",
    title: "Mental Wellness & Behavioral Health",
    description: "Stress reduction, anxiety, mood shifts, depression, and lifestyle therapy.",
    icon: "Smile",
    specialtySlug: "mental-wellness",
    commonSymptoms: ["Anxiety & burnout", "Sleep trouble", "Low mood", "Cognitive therapy"],
  },
  {
    id: "care-dental",
    title: "Dental & Oral Hygiene",
    description: "Cleanings, gum health, toothache, fillings, and routine maintenance.",
    icon: "Activity",
    specialtySlug: "dental",
    commonSymptoms: ["Tooth sensitivity", "Routine cleaning", "Gum bleeding"],
  },
  {
    id: "care-eye",
    title: "Eye Health & Vision Diagnostics",
    description: "Vision testing, dry eye treatment, eye strain, and refractive assessment.",
    icon: "Eye",
    specialtySlug: "eye-care",
    commonSymptoms: ["Blurry vision", "Dry eyes", "Digital strain", "Routine exam"],
  },
];
