import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import os from "os";
import ErrorHandler from "./errorMiddleware.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF protection. Auth cookies are SameSite=None (the front-ends live on other
 * domains), so a malicious site could auto-submit a form to e.g.
 * /api/v1/user/admin/addnew and the admin's cookie would be attached.
 * Browsers always send an Origin header on cross-site POST/PUT/DELETE, so we
 * reject any state-changing request coming from an origin we don't own.
 */
export const verifyOrigin = (allowedOrigins) => (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get("origin");
  // Non-browser clients (curl, server-to-server) don't send Origin and don't
  // carry the victim's cookies, so they are not a CSRF vector.
  if (!origin || allowedOrigins.includes(origin)) return next();
  return next(new ErrorHandler("Request origin not allowed", 403));
};

const limiterOptions = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    next(new ErrorHandler(options.message, options.statusCode)),
};

// Brute-force protection for login / registration.
export const authLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: "Too many attempts, please try again after 15 minutes.",
});

// Spam protection for the public contact form and appointment booking.
export const submitLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: "Too many requests, please try again later.",
});

// File uploads are only accepted on the routes that need them (and only after
// authentication), with a hard size cap, instead of globally for every request.
export const avatarUpload = fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  abortOnLimit: true,
  responseOnLimit: "File size limit (5 MB) exceeded",
  safeFileNames: true,
  preserveExtension: true,
});
