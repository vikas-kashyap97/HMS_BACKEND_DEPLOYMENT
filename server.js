import app from "./app.js";
import cloudinary from "cloudinary";

// Fail fast instead of signing tokens with an undefined secret.
const REQUIRED_ENV = ["MONGO_URL", "JWT_SECRET_KEY"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.JWT_SECRET_KEY.length < 32) {
  console.warn("WARNING: JWT_SECRET_KEY should be at least 32 random characters.");
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
