import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [11, "Phone number must contain exactly 11 digits"],
      maxLength: [11, "Phone number must contain exactly 11 digits"],
      match: [/^\d{11}$/, "Phone number must contain exactly 11 digits"],
    },
    message: {
      type: String,
      required: true,
      minLength: [10, "Message must contain at least 10 characters"],
      maxLength: [2000, "Message cannot exceed 2000 characters"],
    },
  });

  export const Message = mongoose.model("Message", messageSchema);