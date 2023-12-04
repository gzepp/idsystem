import asyncHandler from "express-async-handler";

import { requestQrRecord } from "../models/index.js";

// @desc Get allreq
// @route GET /api/registrar/getQRreq
// @access Public

const getAllReq = asyncHandler(async (req, res) => {
  const { getAllReq } = req.query;
  console.log(getAllReq);
  if (!getAllReq || getAllReq === "") {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Define the start and end date of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

    const renewQRList = await requestQrRecord
      .find({
        isArchive: false,
        createdAt: { $gte: startDate, $lt: endDate },
      })
      .limit(2000);
    return res.status(200).json({ renewQRList });
  } else if (getAllReq === "archived") {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Define the start and end date of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

    const renewQRList = await requestQrRecord
      .find({
        isArchive: true,
        createdAt: { $gte: startDate, $lt: endDate },
      })
      .limit(2000);
    return res.status(200).json({ renewQRList });
  } else if (getAllReq === "approved") {
    const renewQRList = await requestQrRecord.find({
      isArchive: false,
      description: "approved",
    });
    return res.status(200).json({ renewQRList });
  } else if (getAllReq === "pending") {
    const renewQRList = await requestQrRecord.find({
      isArchive: false,
      description: "pending",
    });
    return res.status(200).json({ renewQRList });
  } else {
    // Handle other cases if needed
    return res.status(400).json({ error: "Invalid getAllReq parameter" });
  }
});

// @desc Register qrRequest
// @route POST /api/registrar
// @access  Public
const registerQrReq = asyncHandler(async (req, res) => {
  const { idNumber, reqFullname, description } = req.body;

  const isreq = await requestQrRecord.findOne({
    idNumber: idNumber,
    isArchive: false,
  });

  if (isreq) {
    return res.status(400).json({ errorMessage: "You've requested already." });
  } else {
    // Create Qr ticket
    const user = requestQrRecord.create({
      idNumber: idNumber,
      reqFullname: reqFullname,

      description: description,
      isArchive: false,
    });

    if (user) {
      return res.status(200).json({ message: "Request successful" });
    } else {
      return res.status(400).json({ errorMessage: "Invalid data" });
    }
  }
});

// @desc Get necessary data for graph and charts
// @route PUT /api/registrar/updateQRreq
// @access Public
const updateQrReq = asyncHandler(async (req, res) => {
  const { idNumber, _id, description, isArchive } = req.body;

  // Create an empty object to store the fields to update
  const updateFields = { isArchive: isArchive, description: description }; // Object to hold the fields to update

  let updatedreqQR;

  if (_id) {
    updatedreqQR = await requestQrRecord.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });
  } else if (idNumber) {
    updatedreqQR = await requestQrRecord.findOneAndUpdate(
      { idNumber },
      updateFields,
      {
        new: true,
      }
    );
  } else {
    return res.status(400).json({ errorMessage: "Missing _id and idNumber" });
  }

  return res.status(200).json(updatedreqQR);
});

export { getAllReq, registerQrReq, updateQrReq };
