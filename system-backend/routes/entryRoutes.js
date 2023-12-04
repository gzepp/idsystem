import express from "express";

import {
  getEntry,
  getMyentry,
  recordEntries,
} from "../controls/entryRecords.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes admin ,student and guardS

router.get("/", protect, getEntry);

router.get("/myentry", protect, getMyentry);

router.post("/", protect, recordEntries);

export default router;
