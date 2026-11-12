import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    nic: {
      type: String,
      required: true,
      minLength: [13, "NIC must contain exactly 13 digits"],
      maxLength: [13, "NIC must contain exactly 13 digits"],
      match: [/^\d{13}$/, "NIC must contain exactly 13 digits"],
    },
    dob:{
        type: Date,
        required: [true, "DOB is required"],
    },
    gender:{
        type:String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female"],
    },
    appointment_date: {
        type: String,
        required: [true, "Appointment date is required!"],
        maxLength: [30, "Invalid appointment date!"],
      },
      department: {
        type: String,
        required: [true, "Department name is required!"],
        maxLength: [50, "Invalid department!"],
      },
      doctor: {
        firstName: {
          type: String,
          required: [true, "Doctor name is required!"],
        },
        lastName: {
          type: String,
          required: [true, "Doctor name is required!"],
        },
      },
      hasVisited: {
        type: Boolean,
        default: false,
      },
      doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Doctor Id is invalid!"],
      },
      patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient Id is required!"],
      },
      address: {
        type: String,
        required: [true, "Address is required!"],
        maxLength: [300, "Address cannot exceed 300 characters!"],
      },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
      },
  });

  export const Appointment = mongoose.model("Appointment", appointmentSchema);