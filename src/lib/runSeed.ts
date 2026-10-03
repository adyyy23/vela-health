import { seedDatabase } from "./seed";

async function main() {
  await seedDatabase();
  console.log("Seeding execution complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
