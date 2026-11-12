import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "nic",
  "dob",
  "gender",
  "appointment_date",
  "department",
  "doctor_firstName",
  "doctor_lastName",
  "address",
];

const STATUSES = ["Pending", "Accepted", "Rejected"];

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const body = req.body || {};
  // Every field must be a plain non-empty string (no objects / query operators).
  const missing = REQUIRED_FIELDS.some(
    (f) => typeof body[f] !== "string" || body[f].trim() === ""
  );
  if (missing) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    address,
  } = body;

  const doctors = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (doctors.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  if (doctors.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors conflict! Please contact through Email or Phone!",
        400
      )
    );
  }

  // `hasVisited` and `status` are controlled by the hospital, not the patient,
  // so they are intentionally not accepted from the request body.
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    address,
    doctorId: doctors[0]._id,
    patientId: req.user._id,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment sent successfully!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find().sort({ _id: -1 });
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status, hasVisited } = req.body || {};

    // Previously the whole request body was passed to findByIdAndUpdate, so
    // any field (patientId, doctorId, patient details, ...) could be rewritten.
    const update = {};
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return next(new ErrorHandler("Invalid appointment status!", 400));
      }
      update.status = status;
    }
    if (hasVisited !== undefined) {
      if (typeof hasVisited !== "boolean") {
        return next(new ErrorHandler("hasVisited must be a boolean!", 400));
      }
      update.hasVisited = hasVisited;
    }
    if (Object.keys(update).length === 0) {
      return next(new ErrorHandler("Nothing to update!", 400));
    }

    const appointment = await Appointment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    res.status(200).json({
      success: true,
      message: "Appointment status updated!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment deleted!",
    appointment,
  });
});
