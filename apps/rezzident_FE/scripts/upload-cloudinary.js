import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure cloudinary with the URL from environment
cloudinary.config({
  cloud_name: import.meta.env.CLOUD_NAME,
  api_key: import.meta.env.CLOUD_API_KEY,
  api_secret: import.meta.env.CLOUD_API_SECRET
});

const assetsDir = path.join(__dirname, '../public/assets');

async function uploadAssets() {
  if (!fs.existsSync(assetsDir)) {
    console.error(`Assets directory not found: ${assetsDir}`);
    return;
  }

  const files = fs.readdirSync(assetsDir);

  for (const file of files) {
    const filePath = path.join(assetsDir, file);

    // Skip directories
    if (fs.statSync(filePath).isDirectory()) continue;

    console.log(`Uploading ${file}...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: `poietes/v1/${file.split('.')[0]}`,
        use_filename: true,
        unique_filename: false,
        resource_type: 'auto',
        overwrite: true
      });
      console.log(`✅ Uploaded: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error);
    }
  }
}

uploadAssets().catch(console.error);
