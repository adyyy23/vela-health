import { requireRole } from "@/lib/auth";
import { getAuditLogs } from "@/lib/data";
import { PageHeading, EmptyState } from "@/components/CareUI";
export default async function Activity() {
  await requireRole(["ADMIN"]);
  const logs = await getAuditLogs();
  return (
    <>
      <PageHeading
        eyebrow="ACCOUNTABILITY"
        title="Network activity."
        description="The most recent 50 recorded actions. Profile, availability, facility and clinician access changes are recorded here."
      />
      {logs.length ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">User</th>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>
                    {new Date(l.createdAt).toLocaleString("en-US", {
                      timeZone: "America/Los_Angeles",
                    })}{" "}
                    PT
                  </td>
                  <td>{l.userName || "System"}</td>
                  <td>{l.action.replaceAll("_", " ")}</td>
                  <td className="break-all">{l.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No activity recorded"
          description="Changes made through the supported management tools will appear here."
        />
      )}
    </>
  );
}
