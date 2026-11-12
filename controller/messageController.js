import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

const FIELDS = ["firstName", "lastName", "email", "phone", "message"];

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const body = req.body || {};
  const invalid = FIELDS.some(
    (f) => typeof body[f] !== "string" || body[f].trim() === ""
  );
  if (invalid) {
    return next(new ErrorHandler("Please fill full form", 400));
  }
  const { firstName, lastName, email, phone, message } = body;
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ _id: -1 });
  res.status(200).json({
    success: true,
    messages,
  });
});
