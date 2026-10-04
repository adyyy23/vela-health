"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="page-shell py-16">
      <p className="eyebrow">Something interrupted this page</p>
      <h1 className="text-3xl mt-5">Let’s try that again.</h1>
      <p className="text-vela-muted mt-4">
        We couldn’t load this page. Your previously saved information remains
        available.
      </p>
      <div className="flex gap-4 mt-8">
        <button className="btn btn-primary" onClick={reset}>
          Try again
        </button>
        <Link className="btn btn-secondary" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
