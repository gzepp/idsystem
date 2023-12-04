import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
//cloudinary config
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// const getSignature = asyncHandler((req, res) => {
//   const timestamp = Math.round(new Date().getTime() / 1000);
//   const signature = cloudinary.utils.api_sign_request(
//     {
//       timestamp: timestamp,
//     },
//     cloudinary.config().api_secret
//   );
//   res.json({ timestamp, signature });
// });

const delImage = asyncHandler(async (req, res) => {
  try {
    const { pfpPicId } = req.body; // Destructure PicId from the request body

    if (!pfpPicId) {
      return res
        .status(400)
        .json({ error: "id is missing from the request body" });
    }

    const public_id = pfpPicId; // Assign PicId to public_id
    console.log(public_id);

    // Delete the photo from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    // console.log(result);

    if (result.result === "ok") {
      // Photo successfully deleted
      return res.status(200).json({ message: "Photo deleted successfully" });
    } else {
      // Photo deletion failed
      return res.status(400).json({ errorMessage: "No photo found" });
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

export { delImage };
