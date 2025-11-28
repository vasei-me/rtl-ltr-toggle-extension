import path, { dirname } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 48, 64, 128];
const assetsDir = path.join(__dirname, "assets");

// Create a simple SVG-based icon
const createIcon = async (size: number) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#4CAF50"/>
      <text x="${size / 2}" y="${size / 2 + 5}" font-size="${Math.max(
    4,
    size / 3
  )}" font-weight="bold" fill="white" text-anchor="middle">RL</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, `icon${size}.png`));

  console.log(`✓ Created icon${size}.png`);
};

const generateIcons = async () => {
  console.log("🎨 Generating extension icons...");
  for (const size of sizes) {
    await createIcon(size);
  }
  console.log("✅ Icons generated successfully!");
};

generateIcons().catch((err) => {
  console.error("❌ Error generating icons:", err);
  process.exit(1);
});
