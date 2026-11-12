import fs from "fs/promises";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken, clearToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "nic",
  "dob",
  "gender",
  "password",
];

// Pick only the expected keys and require each to be a non-empty string.
// Rejects objects/arrays (e.g. {"$ne": null}) that could be abused in queries.
const pickStrings = (body, fields) => {
  const out = {};
  for (const field of fields) {
    const value = body?.[field];
    if (typeof value !== "string" || value.trim() === "") return null;
    // Passwords are kept verbatim; other fields are trimmed by the schema.
    out[field] = value;
  }
  return out;
};

const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const data = pickStrings(req.body, PROFILE_FIELDS);
  if (!data) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  const existing = await User.findOne({ email: data.email });
  if (existing) {
    return next(new ErrorHandler("User already registered!", 400));
  }

  // SECURITY: the role used to be taken from the request body, so anyone could
  // self-register with {"role": "Admin"} and take over the admin dashboard.
  const user = await User.create({ ...data, role: "Patient" });
  generateToken(user, "User registered successfully!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const creds = pickStrings(req.body, ["email", "password", "confirmPassword", "role"]);
  if (!creds) {
    return next(new ErrorHandler("Please provide all details!", 400));
  }
  const { email, password, confirmPassword, role } = creds;
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password do not match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid email or password!", 401));
  }
  if (role !== user.role) {
    return next(new ErrorHandler("User not found with this role!", 403));
  }
  generateToken(user, "User logged in successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const data = pickStrings(req.body, PROFILE_FIELDS);
  if (!data) {
    return next(new ErrorHandler("Please fill out the full form!", 400));
  }

  const isRegistered = await User.findOne({ email: data.email });
  if (isRegistered) {
    return next(new ErrorHandler("A user already exists with this email!", 400));
  }

  const admin = await User.create({ ...data, role: "Admin" });

  res.status(200).json({
    success: true,
    message: "New admin registered!",
    admin,
  });
});

// Public: used by the patient site to populate the appointment form.
// Only expose non-sensitive fields (no email, phone, NIC, DOB).
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" }).select(
    "firstName lastName doctorDepartment docAvatar"
  );
  res.status(200).json({
    success: true,
    doctors,
  });
});

// Admin only: full doctor records for the dashboard.
export const getAllDoctorsAdmin = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Logout does not require a valid token: a user with an expired/invalid
// cookie must still be able to clear it.
export const logoutAdmin = (req, res) =>
  clearToken(res, "adminToken", "Admin logged out successfully.");

export const logoutPatient = (req, res) =>
  clearToken(res, "patientToken", "Patient logged out successfully.");

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const docAvatar = req.files?.docAvatar;
  try {
    if (!docAvatar) {
      return next(new ErrorHandler("Doctor avatar required!", 400));
    }
    if (Array.isArray(docAvatar)) {
      return next(new ErrorHandler("Only one avatar may be uploaded!", 400));
    }
    if (!ALLOWED_AVATAR_TYPES.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File format not supported!", 400));
    }

    const data = pickStrings(req.body, [...PROFILE_FIELDS, "doctorDepartment"]);
    if (!data) {
      return next(new ErrorHandler("Please fill full form!", 400));
    }

    const isRegistered = await User.findOne({ email: data.email });
    if (isRegistered) {
      return next(
        new ErrorHandler("A user is already registered with this email!", 400)
      );
    }

    // Validate everything before uploading so a bad request doesn't leave an
    // orphaned image in Cloudinary.
    const doctor = new User({ ...data, role: "Doctor" });
    await doctor.validate();

    let cloudinaryResponse;
    try {
      // resource_type "image" makes Cloudinary reject non-image payloads even
      // if the client lied about the mimetype.
      cloudinaryResponse = await cloudinary.v2.uploader.upload(
        docAvatar.tempFilePath,
        { resource_type: "image", folder: "doctor_avatars" }
      );
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return next(
        new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 502)
      );
    }

    doctor.docAvatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
    try {
      await doctor.save();
    } catch (error) {
      await cloudinary.v2.uploader
        .destroy(cloudinaryResponse.public_id)
        .catch(() => {});
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "New doctor registered!",
      doctor,
    });
  } finally {
    // Always remove the temp file written by express-fileupload.
    if (docAvatar?.tempFilePath) {
      await fs.unlink(docAvatar.tempFilePath).catch(() => {});
    }
  }
});
