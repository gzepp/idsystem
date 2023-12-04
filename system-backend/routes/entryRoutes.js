import express from "express";

import {
  getEntry,
  getMyentry,
  recordEntries,
} from "../controls/entryRecords.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes admin ,student and guardS

router.get("/", getEntry);

router.get("/myentry", getMyentry);

router.post("/", recordEntries);

export default router;
