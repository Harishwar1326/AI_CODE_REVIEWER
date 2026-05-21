import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "frontend", "dist");
const targetDir = path.join(rootDir, "dist");

async function syncDist() {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });
  console.log("Synced frontend/dist -> dist for Vercel root deployment.");
}

syncDist().catch((error) => {
  console.error("Failed to sync Vercel dist output:", error.message);
  process.exitCode = 1;
});
