import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  getAllReq,
  registerQrReq,
  updateQrReq,
} from "../controls/registrarStudentControl.js";

const router = express.Router();

router.get("/", protect, getAllReq);

router.post("/", protect, registerQrReq);

router.put("/", protect, updateQrReq);

export default router;
