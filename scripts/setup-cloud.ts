import fs from "node:fs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Pool } from "pg";
import { SUPABASE_CA } from "../src/lib/cloud-tls";
import { getLocalDb } from "../src/lib/db";
import { seedDatabase } from "../src/lib/seed";
async function main() {
  if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is required.");
  const url = new URL(process.env.POSTGRES_URL);
  url.searchParams.delete("sslmode");
  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { ca: SUPABASE_CA, rejectUnauthorized: true },
    max: 1,
  });
  const client = await pool.connect();
  let folder: string | undefined;
  try {
    await client.query("BEGIN");
    const schema = fs.readFileSync(
      path.join(process.cwd(), "supabase/schema.sql"),
      "utf8",
    );
    await client.query(schema);
    if (process.argv.includes("--seed-demo")) {
      const existing = Number(
        (await client.query("SELECT count(*) FROM users")).rows[0].count,
      );
      if (existing)
        throw new Error(
          "Demo seeding requires an empty database. Existing records are preserved.",
        );
      folder = mkdtempSync(path.join(tmpdir(), "vela-cloud-seed-"));
      process.env.VELA_DATABASE_PATH = path.join(folder, "demo.db");
      await seedDatabase();
      const local = getLocalDb();
      const tables = [
        ...schema.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g),
      ].map((match) => match[1]);
      for (const table of tables) {
        if (table === "sessions") continue;
        for (const row of local
          .prepare(`SELECT * FROM ${table}`)
          .all() as Record<string, unknown>[]) {
          const keys = Object.keys(row);
          await client.query(
            `INSERT INTO ${table} (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")})`,
            Object.values(row),
          );
        }
      }
      local.close();
    }
    await client.query("COMMIT");
    console.log(
      "Cloud schema ready. Demo seeding runs only with --seed-demo on an empty database.",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
    if (folder) rmSync(folder, { recursive: true, force: true });
  }
}
main().catch(() => {
  console.error(
    "Cloud setup failed. Check configuration and database state; no existing data was overwritten.",
  );
  process.exitCode = 1;
});
