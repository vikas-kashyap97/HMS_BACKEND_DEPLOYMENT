class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate ${Object.keys(err.keyValue || {}).join(", ")} entered`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Json Web Token is invalid, Try again!";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Json Web Token is expired, Try again!";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(" ");
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON body";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body too large";
  }

  // Never leak internal error details (DB errors, stack traces, third-party
  // API messages) to clients.
  if (statusCode >= 500) {
    console.error(err);
    message = "Internal Server Error";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default ErrorHandler;
