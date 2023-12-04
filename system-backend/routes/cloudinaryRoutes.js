import express from "express";

import { delImage } from "../controls/cloudinaryControls.js";

const router = express.Router();

//router.get("/get-signature", getSignature);

router.post("/delete-photo", delImage);

export default router;
