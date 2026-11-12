import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { verifyOrigin } from "./middlewares/security.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

config({ path: "./config/config.env" });

// Strip MongoDB query operators ($ne, $gt, $where, ...) from any value that
// reaches a query filter. Blocks NoSQL injection such as
// { "email": { "$ne": null } } on the login route.
mongoose.set("sanitizeFilter", true);
mongoose.set("strictQuery", true);

const app = express();

// Render, Railway, Heroku etc. sit behind a proxy; needed for correct client
// IPs in the rate limiter and for secure cookies.
app.set("trust proxy", 1);
app.disable("x-powered-by");

export const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

// The API is consumed cross-origin by the two front-ends.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Cookies are SameSite=None, so reject cross-site state-changing requests
// (CSRF) whose Origin is not one of our own front-ends.
app.use(verifyOrigin(allowedOrigins));

app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

app.get("/api/v1/health", (req, res) => res.status(200).json({ success: true }));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

dbConnection();

app.use(errorMiddleware);
export default app;
