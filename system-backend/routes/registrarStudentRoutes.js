import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  getAllReq,
  registerQrReq,
  updateQrReq,
} from "../controls/registrarStudentControl.js";

const router = express.Router();

router.get("/", getAllReq);

router.post("/", registerQrReq);

router.put("/", updateQrReq);

export default router;
