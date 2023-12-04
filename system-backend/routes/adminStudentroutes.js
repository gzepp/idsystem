import express from "express";
import multer from "multer";
const upload = multer({ dest: "./uploads" });
import {
  checkProfile,
  getStudents,
  createStudent,
  updateStudent,
  batchRegisterStudents,
  //password update
  updateStudentPassword,
  requestOtp,
  verifyOtp,
  checkStudent,
} from "../controls/adminStudentcontrols.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes students and admin

router.get("/", protect, getStudents);

router.get("/userExist", checkProfile);

router.post("/", protect, createStudent);

router.post("/requestotp", requestOtp);

router.post("/verifiotp", verifyOtp);

router.post("/checkstudent", checkStudent);

router.post("/resetpass", updateStudentPassword);

router.post("/batchreg", protect, upload.single("file"), batchRegisterStudents);

router.put("/", protect, updateStudent);

export default router;
