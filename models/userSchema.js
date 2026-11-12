import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First Name must contain at least 3 characters!"],
    maxLength: [50, "First Name cannot exceed 50 characters!"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Last Name must contain at least 3 characters!"],
    maxLength: [50, "Last Name cannot exceed 50 characters!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [11, "Phone number must contain exactly 11 digits"],
    maxLength: [11, "Phone number must contain exactly 11 digits"],
    match: [/^\d{11}$/, "Phone number must contain exactly 11 digits"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [13, "NIC must contain exactly 13 digits"],
    maxLength: [13, "NIC must contain exactly 13 digits"],
    match: [/^\d{13}$/, "NIC must contain exactly 13 digits"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    // bcrypt silently truncates input beyond 72 bytes.
    maxLength: [72, "Password cannot exceed 72 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User role required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
    trim: true,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

// Never serialize the password hash into an API response (it is present on
// documents returned by create() and by queries using select("+password")).
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

userSchema.pre("save", async function () {
  // Previously `next()` was called without `return`, so execution fell
  // through and any later save() re-hashed the existing hash (locking the
  // user out) or crashed when the password field wasn't selected.
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (typeof enteredPassword !== "string") return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

export const User = mongoose.model("User", userSchema);
