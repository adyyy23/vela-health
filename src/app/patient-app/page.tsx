import PublicNavbar from "@/components/PublicNavbar";
import PatientAppInstall from "@/components/PatientAppInstall";
export const metadata = { title: "Get the patient app | VELA Health" };
export default function PatientAppPage() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-16">
        <PatientAppInstall />
      </main>
    </>
  );
}
