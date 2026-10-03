import PublicNavbar from "@/components/PublicNavbar";
import ProviderDirectory from "@/components/ProviderDirectory";
export default function Page() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="page-shell py-12">
        <ProviderDirectory />
      </main>
    </>
  );
}
