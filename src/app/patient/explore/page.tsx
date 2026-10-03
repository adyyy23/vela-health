import Link from "next/link";
import ProviderDirectory from "@/components/ProviderDirectory";
export default function Page() {
  return (
    <>
      <ProviderDirectory patient />
      <section className="border-t border-vela-border mt-10 pt-8">
        <h2 className="text-2xl mb-4">Looking for a nearby clinic?</h2>
        <Link className="btn btn-secondary" href="/find-care">
          Explore clinics & map
        </Link>
      </section>
    </>
  );
}
