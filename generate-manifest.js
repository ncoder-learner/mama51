const fs = require("node:fs");
const path = require("node:path");

const imageDir = path.join(__dirname, "images");
const output = path.join(imageDir, "manifest.json");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

const photos = fs.readdirSync(imageDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && supported.has(path.extname(entry.name).toLowerCase()) && entry.name !== "manifest.json")
  .map((entry) => ({ src: `images/${entry.name}`, caption: "" }))
  .sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: "base" }));

fs.writeFileSync(output, `${JSON.stringify(photos, null, 2)}\n`);
console.log(`Generated images/manifest.json with ${photos.length} photo(s).`);
