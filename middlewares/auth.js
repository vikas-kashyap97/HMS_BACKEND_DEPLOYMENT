import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import { User } from "../models/userSchema.js";

const authenticate = (cookieName, requiredRole) =>
  catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token || typeof token !== "string") {
      return next(new ErrorHandler(`${requiredRole} is not authenticated!`, 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"],
    });

    const user = await User.findById(decoded.id);
    // The account may have been deleted after the token was issued.
    if (!user) {
      return next(new ErrorHandler(`${requiredRole} is not authenticated!`, 401));
    }
    if (user.role !== requiredRole) {
      return next(
        new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
      );
    }

    req.user = user;
    next();
  });

export const isAdminAuthenticated = authenticate("adminToken", "Admin");
export const isPatientAuthenticated = authenticate("patientToken", "Patient");
