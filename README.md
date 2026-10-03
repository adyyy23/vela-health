# VELA Health

Next.js 15 / React 19 / TypeScript healthcare directory and appointment platform. The public, patient, physician and operations experiences share a white, burgundy and terracotta design system.

## Local development

Use Node.js 24 and `npm ci`, then `npm run dev`. The application creates its SQLite schema but **does not create demo accounts automatically**.

For a disposable demonstration database:

```sh
export VELA_DATABASE_PATH="$(pwd)/data/vela-demo.db"
npm run seed:demo
npm run dev -- --port 3030
```

Keep this database separate from actual records. Seeding is explicit and intended for development only. Demo data and photography are illustrative; directory credentials and clinic claims are not verified real-world listings.

| Role          | Email                       | Password        |
| ------------- | --------------------------- | --------------- |
| Patient       | patient@velahealth.com      | PatientPass123! |
| Doctor        | doctor.reyes@velahealth.com | DoctorPass123!  |
| Administrator | admin@velahealth.com        | AdminPass123!   |

The development role switcher appears only with `NEXT_PUBLIC_ENABLE_DEMO=true` in development. It never appears in a production build.

## Checks

- `npm run lint`
- `npm run typecheck`
- `npm test` — disposable database tests for ownership, scheduling and clinical documents.
- `npm run build`
- `VELA_TEST_BASE_URL=http://127.0.0.1:3030 node tests/http.smoke.mjs` — destructive only to the **separately seeded local test database**; verifies registration, login, permissions, booking, rescheduling, messaging, documents, reviews, profiles, clinic/staff updates and availability. Do not point the test server at real records.

CI runs lint, types, database tests and production compilation with a temporary database.

## Data and deployment

All features now use one consistent SQLite data layer. Configure `VELA_DATABASE_PATH` to a durable writable file on a persistent Node server, with backups and appropriate access controls. On Vercel, a local function filesystem or `/tmp` is **not a persistent shared database**. The existing partial Supabase fallback was removed because authentication and clinical writes continued using SQLite and could disagree with public directory reads.

**The current implementation is not ready for Vercel serverless persistence.** Deploying the clinical workflows there requires an asynchronous shared database adapter and a full schema/data migration. An environment variable pointing at `/tmp` does not solve this. The runtime explicitly reports missing persistent configuration instead of silently losing records. `supabase/schema.sql` is retained as a legacy reference, not an active backend.

## Supported workflows and limits

- Public: searchable providers, specialty guide, clinic directory/map, truthful virtual-care information and three-step appointment booking.
- Patient: appointment management, atomic rescheduling, timed in-person check-in, messages with booked physicians, published documents, downloads/printing, saved physicians, profile/emergency contacts and notifications.
- Doctor: actual schedule and patient panel, clinical drafts/completion, published visit summaries, messages, editable independent weekly availability windows and public profile.
- Admin: actual network metrics, appointment stages, physician activation, clinic detail editing, patient directory, record-derived reports and activity history.

Times use America/Los_Angeles, matching the existing San Francisco clinic network. Availability prevents duplicate and overlapping reservations across both formats. Rescheduling only cancels the previous visit after successfully reserving the replacement.

No built-in video service, payment processing, pharmacy transmission, lab integration, automated waitlist offers, email/SMS reminders or account recovery is provided. Waitlist requests are recorded for clinic follow-up. Clinical text prescriptions are documents, not pharmacy orders. Published summaries are final; a formal clinical amendment workflow is not implemented. Doctor/admin onboarding and granular permission configuration require additional administrative workflows. Sample records should be replaced and real listings verified before launch.

Seven development-tool dependency advisories currently originate in `braces` and its Tailwind 3 / ESLint dependency chain; no patched `braces` 3 release is available. Runtime PostCSS and Sharp dependencies are overridden to patched compatible releases. Do not force an unrelated major framework migration without testing its styling and lint integration.

### Mobile patient app

Patient workspace screens are presented below 768px. Larger screens show phone installation instructions instead of the patient dashboard. Public navigation links to `/patient-app`, which offers a browser installation prompt when supported and iPhone/Android home-screen instructions otherwise. The existing web app manifest now uses VELA branding and PNG icons. This is a progressive web app, not an App Store/Google Play release. Online access is required; patient records and API responses are never cached by the service worker. Responsive visibility is a product presentation rule, not an authentication or security boundary.
