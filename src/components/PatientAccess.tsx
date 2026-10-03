import PatientAppInstall from "./PatientAppInstall";
export default function PatientAccess({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="main-content">
      <div className="patient-phone-only">{children}</div>
      <main id="patient-desktop-content" className="patient-desktop-only">
        <PatientAppInstall />
      </main>
    </div>
  );
}
