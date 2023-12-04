import express from "express";

import {
  checkPost,
  getAnnounce,
  postAnnounce,
  updateAnnounce,
} from "../controls/announcemetControls.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes announcement student and admin

router.get("/", protect, getAnnounce);

router.get("/checkpost", checkPost);

router.post("/", protect, postAnnounce);

router.put("/", protect, updateAnnounce);

export default router;
