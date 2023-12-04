import express from "express";

import {
  getStaffQrData,
  getEntryRdata,
  updateUser,
  registerUser,
  loginUser,
  getProfile,
  getUserlist,
  validateUser,
  getData,
  getBarData,
} from "../controls/adminControls.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes for admin and guard

router.get("/", getUserlist);

router.get("/getentryRdata", getEntryRdata);

router.get("/getstaffqrRdata", getStaffQrData);

router.get("/getdata", getData);

router.get("/getbardata", getBarData);

router.post("/me", getProfile);

router.post("/", registerUser);

router.post("/login", loginUser);

router.post("/validate", protect, validateUser);

router.put("/", updateUser);

export default router;
