import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getAllDoctorsAdmin,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import { authLimiter, avatarUpload } from "../middlewares/security.js";

const router = express.Router();

router.post("/patient/register", authLimiter, patientRegister);
router.post("/login", authLimiter, login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/doctors", isAdminAuthenticated, getAllDoctorsAdmin);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", logoutAdmin);
router.get("/patient/logout", logoutPatient);
// Authenticate first so unauthenticated users can't write files to disk.
router.post("/doctor/addnew", isAdminAuthenticated, avatarUpload, addNewDoctor);

export default router;
