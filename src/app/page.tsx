import ProviderPortrait from "@/components/ProviderPortrait";
import Link from "next/link";
import { ArrowRight, MapPin, Video, Calendar, FileText } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import CareSearch from "@/components/CareSearch";
import VelaLogo from "@/components/VelaLogo";
import { getDoctors, getAllClinics, getAllSpecialties } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const doctors = await getDoctors();
  const clinics = await getAllClinics();
  const specialties = await getAllSpecialties();
  return (
    <div className="public-experience">
      <PublicNavbar />
      <main id="main-content">
        <section className="home-hero page-shell">
          <p className="eyebrow">VELA HEALTH · SAN FRANCISCO</p>
          <h1>
            Thoughtful care.
            <br />
            <span>A healthier everyday.</span>
          </h1>
          <p className="hero-copy">
            Find the right physician, choose a clinic close to you, and keep
            your care connected—from your first visit to your next chapter.
          </p>
          <CareSearch />
          <div className="hero-links">
            <Link href="/care-finder">
              Not sure where to start? <ArrowRight size={14} />
            </Link>
            <Link href="/telehealth">
              Explore virtual care <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hero-image">
            <img
              src={
                clinics.find((c) => c.id === "clinic-marina")?.imageUrl ||
                clinics[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=85"
              }
              alt="A bright and welcoming healthcare environment"
              fetchPriority="high"
            />
            <div className="hero-caption">
              <span>SPACE TO FEEL AT EASE</span>
              <p>Care that fits your life.</p>
              <Link href="/clinics">
                Explore our clinics <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <div className="network-strip page-shell">
          <div>
            <strong>{clinics.length}</strong>
            <span>Neighborhood clinics</span>
          </div>
          <div>
            <strong>{doctors.length}</strong>
            <span>Physicians in our directory</span>
          </div>
          <div>
            <strong>{specialties.length}</strong>
            <span>Clinical specialties</span>
          </div>
          <div>
            <strong>One place</strong>
            <span>Appointments, messages & records</span>
          </div>
        </div>
        <section className="home-section page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE RIGHT START</p>
              <h2 className="section-title">Care for every chapter.</h2>
            </div>
            <Link className="text-link" href="/services">
              Explore services <ArrowRight size={16} />
            </Link>
          </div>
          <div className="specialty-list">
            {specialties.map((s, i) => (
              <Link href={`/doctors?specialty=${s.id}`} key={s.id}>
                <span className="specialty-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    {s.description ||
                      "Explore our physicians and choose the care that fits your needs."}
                  </p>
                </div>
                <ArrowRight size={20} />
              </Link>
            ))}
          </div>
        </section>
        <section className="home-section bg-white">
          <div className="page-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">PEOPLE BEHIND YOUR CARE</p>
                <h2 className="section-title">Meet your next physician.</h2>
              </div>
              <Link href="/doctors" className="text-link">
                View all physicians <ArrowRight size={16} />
              </Link>
            </div>
            <div className="physician-editorial">
              {doctors.slice(0, 3).map((d) => (
                <article key={d.userId}>
                  <Link href={`/doctors/${d.userId}`}>
                    <ProviderPortrait
                      src={d.user?.avatarUrl}
                      name={`Dr. ${d.user?.firstName} ${d.user?.lastName}`}
                      className=""
                    />
                  </Link>
                  <p className="eyebrow mt-6">{d.specialtyName}</p>
                  <h3>
                    Dr. {d.user?.firstName} {d.user?.lastName}
                  </h3>
                  <p className="text-vela-muted text-sm mt-2">
                    {d.clinicName} · {d.experienceYears} years of experience
                  </p>
                  <div className="flex justify-between items-center gap-4 mt-5 pt-4 border-t border-vela-border">
                    <span className="text-sm">From ${d.consultationFee}</span>
                    <Link className="text-link" href={`/doctors/${d.userId}`}>
                      Meet physician <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="home-section page-shell">
          <div className="care-continuity">
            <div>
              <p className="eyebrow">YOUR CARE, CONNECTED</p>
              <h2 className="section-title">
                A little less arranging.
                <br />A lot more living.
              </h2>
              <p className="text-vela-muted mt-6 max-w-lg leading-relaxed">
                Your patient portal brings the practical details together.
                Review appointments, send a message to your care team, and
                revisit instructions after your consultation.
              </p>
              <Link href="/register" className="btn btn-primary mt-8">
                Create your account <ArrowRight size={16} />
              </Link>
            </div>
            <div className="continuity-steps">
              {[
                [
                  Calendar,
                  "Plan your visit",
                  "Choose a physician, appointment format, and available time.",
                ],
                [
                  Video,
                  "Care, wherever you are",
                  "Explore virtual consultations with participating physicians.",
                ],
                [
                  FileText,
                  "Keep your next steps close",
                  "Read the visit summaries your physician shares with you.",
                ],
              ].map(([Icon, title, copy]) => {
                const Glyph = Icon as typeof Calendar;
                return (
                  <div key={title as string}>
                    <Glyph size={22} />
                    <div>
                      <h3>{title as string}</h3>
                      <p>{copy as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="home-section page-shell border-t border-vela-border">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CLOSER TO HOME</p>
              <h2 className="section-title">Find your neighborhood clinic.</h2>
            </div>
            <Link href="/find-care" className="text-link">
              View care map <ArrowRight size={16} />
            </Link>
          </div>
          <div className="clinic-editorial">
            {clinics.map((c) => (
              <Link href={`/clinics/${c.id}`} key={c.id}>
                <MapPin size={20} />
                <div>
                  <h3>{c.name}</h3>
                  <p>
                    {c.address}, {c.city}
                  </p>
                </div>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </section>
        <section className="home-section page-shell">
          <div className="resource-section">
            <div>
              <p className="eyebrow">BEFORE YOUR VISIT</p>
              <h2 className="section-title">A clear path to care.</h2>
              <p className="mt-5 text-vela-muted">
                A few useful details to help you prepare.
              </p>
            </div>
            <div className="faq-list">
              {[
                [
                  "How do I book?",
                  "Choose a physician and an available appointment time. Sign in or create a patient account to confirm your booking.",
                ],
                [
                  "What will my visit cost?",
                  "Consultation fees are shown on physician profiles. Contact the clinic to confirm insurance coverage, tests, and any additional fees before your visit.",
                ],
                [
                  "What should I bring?",
                  "Bring identification, your medication list, relevant records, and insurance information if applicable.",
                ],
                [
                  "How does virtual care work?",
                  "Select a physician who offers telehealth. Your care team will provide joining instructions; this platform does not currently host video calls.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span>+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="page-shell pb-20">
          <div className="closing-cta">
            <p className="eyebrow">MAKE SPACE FOR YOUR HEALTH</p>
            <h2>
              Your next chapter
              <br />
              starts with a visit.
            </h2>
            <Link href="/book" className="btn btn-primary">
              Book an appointment <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <div className="page-shell">
          <div className="footer-top">
            <VelaLogo size="md" inverted />
            <p>
              Thoughtful care.
              <br />
              Connected to your everyday.
            </p>
            <nav aria-label="Footer navigation">
              {[
                ["/doctors", "Physicians"],
                ["/clinics", "Clinics"],
                ["/services", "Services"],
                ["/login", "Portal sign in"],
              ].map(([href, label]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            VELA HEALTH
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} VELA Health</span>
            <span>For emergencies, contact your local emergency services.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
