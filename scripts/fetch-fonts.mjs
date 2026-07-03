// Downloads the licensed Thmanyah fonts at build time.
// The font files are intentionally NOT committed to the public repo —
// the license forbids redistributing them. They live in a private
// Supabase Storage bucket; FONTS_ARCHIVE_URL is a signed URL to it.
import { existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

const FONTS_DIR = "src/fonts";
const SENTINEL = `${FONTS_DIR}/thmanyahsans-Regular.woff2`;

if (existsSync(SENTINEL)) {
  console.log("fetch-fonts: fonts already present, skipping download.");
  process.exit(0);
}

const url = process.env.FONTS_ARCHIVE_URL;
if (!url) {
  console.error(
    "fetch-fonts: fonts are missing and FONTS_ARCHIVE_URL is not set.\n" +
      "Set it in .env.local / Vercel env vars (signed URL to the fonts archive)."
  );
  process.exit(1);
}

mkdirSync(FONTS_DIR, { recursive: true });
execSync(`curl -fsSL "${url}" | tar -xz -C "${FONTS_DIR}"`, {
  stdio: "inherit",
  shell: "/bin/bash",
});
console.log("fetch-fonts: fonts downloaded.");
