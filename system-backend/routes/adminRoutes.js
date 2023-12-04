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

router.get("/", protect, getUserlist);

router.get("/getentryRdata", protect, getEntryRdata);

router.get("/getstaffqrRdata", protect, getStaffQrData);

router.get("/getdata", protect, getData);

router.get("/getbardata", protect, getBarData);

router.post("/me", protect, getProfile);

router.post("/", protect, registerUser);

router.post("/login", loginUser);

router.post("/validate", protect, validateUser);

router.put("/", protect, updateUser);

export default router;
