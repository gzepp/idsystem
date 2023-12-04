import asyncHandler from "express-async-handler";
import { entryRecord } from "../models/index.js";
import { studentsRecord } from "../models/index.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import { decrypt } from "../utility/index.js";
dotenv.config();

//initialize sms
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// @desc Get Entry Records
// @route GET /api/admin/entry
// @access  Public
const getEntry = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
  const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

  const entryrec = await entryRecord
    .find({ entryDatetime: { $gte: startDate, $lt: endDate } })
    .limit(1000);
  return res.status(200).json({ entryrec });
});

// @desc Get Specific Entry Records
// @route GET /api/admin/myentry
// @access Public
const getMyentry = asyncHandler(async (req, res) => {
  const { idNumber, speciDate, scannedBy, logType } = req.query;

  console.log("Get entry vars", idNumber, speciDate, scannedBy, logType);

  let query = {}; // Initialize an empty query object

  // Check if idNumber is provided
  if (idNumber) {
    query.idNumber = idNumber; // Add idNumber to the query
  }

  if (logType) {
    query.logType = logType; // Add logType to the query
  }

  // Check if scannedBy is provided
  if (scannedBy) {
    query.scannedBy = scannedBy; // Add scannedBy to the query
  }

  // Check if speciDate is provided
  if (speciDate) {
    // Create a date object from the speciDate
    const selectedDate = new Date(speciDate);

    // Calculate the start date (00:00:00.000) and end date (23:59:59.999) for the selected date
    const startDate = new Date(selectedDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setUTCHours(23, 59, 59, 999);

    // Format the date values as strings without 'Z'
    const formattedStartDate =
      startDate.toISOString().replace("Z", "") + "+00:00";
    const formattedEndDate = endDate.toISOString().replace("Z", "") + "+00:00";

    query.entryDatetime = {
      $gte: formattedStartDate,
      $lte: formattedEndDate,
    }; // Add date filter to the query
  }
  // console.log(query.entryDatetime);
  // console.log(query);
  // Fetch entry records based on the constructed query
  const entryRecords = await entryRecord.find(query).limit(500);
  // console.log(entryRecords);
  // console.log("get success");
  return res.status(200).json(entryRecords);
});

// @desc Post Entry
// @route POST /api/guard/entry
// @access  Public
const recordEntries = asyncHandler(async (req, res) => {
  const { studentQR, placeOfentry, logType, scannedBy, smsTrue } = req.body;

  console.log("Entry Vars", studentQR, placeOfentry, logType, smsTrue);

  try {
    const user = await studentsRecord.findOne({ studentQR });

    if (!user) {
      return res.status(400).json({ errorMessage: "No user found" });
    }

    // Compare the provided studentQR with the hashed QR in the database
    const isQrValid = bcrypt.compare(studentQR, user.studentQR);

    if (!isQrValid) {
      return res.status(400).json({ errorMessage: "Invalid QR" });
    }

    // Decrypt specific fields
    const fieldsToDecrypt = [
      "userFName",
      "userMName",
      "userLName",
      "userExt",

      // Add other fields to decrypt here
    ];

    // Create an array of decrypted fields and join them
    const decryptedFields = fieldsToDecrypt.map((field) => {
      if (user[field]?.data && user[field]?.iv) {
        const decryptedData = decrypt(user[field].data, user[field].iv);
        return decryptedData;
      }
      return null;
    });

    // Filter out null values and join the decrypted fields
    const userFields = decryptedFields.filter(Boolean);
    user.studentName = userFields.join(" ");
    console.log(user.studentName);

    const entryTime = new Date();
    const time = entryTime.toLocaleTimeString();
    const date = entryTime.toLocaleDateString();

    const entryR = await entryRecord.create({
      idNumber: user.idNumber,
      studentName: user.studentName,
      placeOfentry: placeOfentry,
      logType: logType,
      entryDatetime: entryTime,
      scannedBy: scannedBy,
    });

    if (smsTrue == "true") {
      const smsTo = decrypt(
        user.parentGuardianContact?.data,
        user.parentGuardianContact?.iv
      );
      const decryptedParentGuardianName = decrypt(
        user.parentGuardianName?.data,
        user.parentGuardianName?.iv
      );

      const message = `Good day Mr/Ms. ${
        decryptedParentGuardianName || ""
      } your child ${
        user.studentName
      } has successfully ${logType} at ${placeOfentry}
    at the time of ${time}, ${date} from the school premises of SHASM. Please be informed that this is an automated message.`;

      async function sendSMS() {
        try {
          await client.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: smsTo,
          });

          console.log("Message sent");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }

      sendSMS();
    }

    console.log("Success Entry Recorded");

    return res.status(200).json({
      idNumber: entryR.idNumber,
      studentName: entryR.studentName,
      placeOfentry: entryR.placeOfentry,
      logType: entryR.logType,
      entryDatetime: entryR.entryDatetime,
      pfpPic: user.pfpPic,
    });
  } catch (error) {
    console.error("Error recording entry:", error);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export { getEntry, getMyentry, recordEntries };
