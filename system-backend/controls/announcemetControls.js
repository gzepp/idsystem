import asyncHandler from "express-async-handler";
import { announceRecord } from "../models/index.js";

// @desc Get announcement
// @route GET /api/admin/announcement
// @access  Public
const getAnnounce = asyncHandler(async (req, res) => {
  const { getAnn } = req.body;

  if (getAnn == "archived") {
    const announcement = await announceRecord.find({ isArchive: true });
    return res.status(200).json({ announcement });
  } else {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Define the start and end date of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

    const announcement = await announceRecord.find({
      isArchive: false,
      createdAt: { $gte: startDate, $lt: endDate },
    });
    return res.status(200).json({ announcement });
  }
});

// @desc Checks if Post exist
// @route GET /api/admin/announcement/checkpost
// @access Public

const checkPost = asyncHandler(async (req, res) => {
  const { title, postId } = req.query;

  try {
    const postExist = await announceRecord.findOne({
      $or: [{ title }, { postId }],
    });

    // Return a response indicating whether the user exists or not
    if (postExist) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

// @desc Post announcement
// @route POST /api/admin/announcement
// @access Public
const postAnnounce = asyncHandler(async (req, res) => {
  const { title, description, tags, postImage, postId } = req.body;

  const dateposted = new Date();

  console.log("Received request to post announce:", {
    postId,
    title,
    description,
    dateposted,
    postImage,
    tags,
  });

  try {
    // Check if an announcement with the same title and description already exists
    const existingAnnounce = await announceRecord.findOne({
      $or: [{ postId }, { title }],
    });

    if (existingAnnounce) {
      return res
        .status(400)
        .json({ errorMessage: "Announcement already exists" });
    }

    const newAnnounce = await announceRecord.create({
      postId: postId,
      title: title,
      description: description,
      dateposted: dateposted,
      postImage: postImage,
      tags: tags,
      isArchive: false,
    });

    console.log("Announce created:", newAnnounce);

    return res.status(200).json(newAnnounce);
  } catch (error) {
    console.error("Error creating Announce:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Update and archive announce
// @route PUT /api/admin/announcement/updateAnn
// @access  Public
const updateAnnounce = asyncHandler(async (req, res) => {
  const { postId, title, description, dateposted, postImage, tags, isArchive } =
    req.body;

  // Create an empty object to store the fields to update
  const updateFields = {};

  // Check if isArchive has a value, if yes, update it
  if (typeof isArchive !== "undefined") {
    updateFields.isArchive = isArchive;
  }

  // Add the other fields to the update object
  // Update the student's information

  updateFields.title = title;
  updateFields.description = description;
  updateFields.dateposted = dateposted;
  updateFields.postImage = postImage;
  updateFields.tags = tags;

  // Update user based on idNumber
  const updatedUser = await announceRecord.findOneAndUpdate(
    { postId }, // Find user by idNumber
    updateFields, // Update fields
    { new: true } // Return the updated user
  );

  if (!updatedUser) {
    return res.status(400).json({ errorMessage: "Post not found" });
  }

  return res.status(200).json(updatedUser);
});

export { getAnnounce, checkPost, postAnnounce, updateAnnounce };
