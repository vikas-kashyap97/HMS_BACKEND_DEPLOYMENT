import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { submitLimiter } from "../middlewares/security.js";

const router = express.Router();

router.post("/send", submitLimiter, sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;
