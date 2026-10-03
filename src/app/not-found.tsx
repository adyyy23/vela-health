import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="page-shell py-16">
      <p className="eyebrow">Page not found</p>
      <h1 className="text-4xl mt-5">Let’s get you back to care.</h1>
      <p className="text-vela-muted mt-4">
        This page may have moved or is not available.
      </p>
      <Link className="btn btn-primary mt-8" href="/">
        Return to VELA
      </Link>
    </main>
  );
}
