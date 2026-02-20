import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workDir = process.cwd();
const distDir = path.join(workDir, "dist");
const publicDir = path.join(workDir, "public");
const manifestPath = path.join(distDir, "manifest.json");

// Helper to zip files (using system commands to avoid dependencies)
const zipDir = (source, out, ignore = []) => {
  // Normalize paths for PowerShell
  const sourcePath = source.replace(/\\/g, "/"); // Use forward slashes
  const outPath = out.replace(/\\/g, "/"); // Use forward slashes

  const command =
    process.platform === "win32"
      ? `powershell -Command "Compress-Archive -Path '${sourcePath}/*' -DestinationPath '${outPath}' -Force"`
      : `zip -r "${out}" "${source}"`; // Linux/Mac

  try {
    console.log(`Running zip command: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to zip ${out}`, e);
  }
};

console.log("🏗️  Building project...");
execSync("npm run build", { stdio: "inherit" });

// Read the original manifest
const baseManifest = JSON.parse(
  fs.readFileSync(path.join(publicDir, "manifest.json"), "utf-8"),
);

// ---------------------------------------------------------
// 🦊 BUILD FOR FIREFOX
// ---------------------------------------------------------
console.log("\n📦 Packaging for Firefox...");
const firefoxManifest = JSON.parse(JSON.stringify(baseManifest));

// Firefox compatibility fallback for MV3 background
firefoxManifest.background = {
  scripts: ["background.js"],
};

// Firefox requires an ID
firefoxManifest.browser_specific_settings = {
  gecko: {
    id: "prayertime@ramadancountdown.com", // Change this to your preferred ID
    strict_min_version: "140.0",
    data_collection_permissions: {
      required: ["none"],
    },
  },
  gecko_android: {
    strict_min_version: "142.0",
  },
};

// Write modified manifest to dist
fs.writeFileSync(manifestPath, JSON.stringify(firefoxManifest, null, 2));

// Create Zip
const firefoxZip = path.join(workDir, "prayer-time-firefox.zip");
zipDir(distDir, firefoxZip);
console.log(`✅ Created: ${firefoxZip}`);

// ---------------------------------------------------------
// 🔵 BUILD FOR EDGE / CHROME
// ---------------------------------------------------------
console.log("\n📦 Packaging for Edge/Chrome...");
const chromeManifest = JSON.parse(JSON.stringify(baseManifest));

// Chrome/Edge is strict about service_worker
chromeManifest.background = {
  service_worker: "background.js",
  type: "module",
};

// Clean up any Firefox keys if they existed in base
delete chromeManifest.browser_specific_settings;

// Write modified manifest to dist
fs.writeFileSync(manifestPath, JSON.stringify(chromeManifest, null, 2));

// Create Zip
const edgeZip = path.join(workDir, "prayer-time-edge.zip");
zipDir(distDir, edgeZip);
console.log(`✅ Created: ${edgeZip}`);

console.log("\n🎉 Done! Upload the respective files to the stores.");
