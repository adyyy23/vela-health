import PublicNavbar from "@/components/PublicNavbar";
import ClinicExplorer from "@/components/ClinicExplorer";
export default function Page() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <ClinicExplorer />
      </main>
    </>
  );
}
