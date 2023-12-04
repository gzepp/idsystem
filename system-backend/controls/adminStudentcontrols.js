import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fastcsv from "fast-csv";
import fs from "fs";

import { studentsRecord, userRecord } from "../models/index.js";
import {
  generateQRNumber,
  emailTemplate,
  generateOtp,
  mailer,
  encrypt,
} from "../utility/index.js";

//configs
dotenv.config();
const secretKey = process.env.USER_SECRET;
//var declaration for mailer otp
var otpCode;
var emailAddress;

// @desc Get Students Array for the Current Year with Limit
// @route GET /api/admin/student/
// @access Public
const getStudents = asyncHandler(async (req, res) => {
  const { getStud } = req.query;
  console.log(getStud);
  if (!getStud || getStud === "") {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Define the start and end date of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

    const students = await studentsRecord
      .find({
        isArchive: false,
        createdAt: { $gte: startDate, $lt: endDate }, // Filter by createdAt within the current year
      })
      .limit(2000); // Limit the results to 2000 records

    return res.status(200).json({ students });
  } else if (getStud == "all") {
    const students = await studentsRecord.find({ isArchive: false });

    return res.status(200).json({ students });
  } else if (getStud == "archived") {
    const students = await studentsRecord.find({ isArchive: true });

    return res.status(200).json({ students });
  } else {
    // Handle other cases if needed
    return res.status(400).json({ error: "Invalid getStud parameter" });
  }
});

// @desc Checks if Student or Staff exist
// @route GET /api/admin/student/
// @access Public

const checkProfile = asyncHandler(async (req, res) => {
  const { userName, idNumber } = req.query;

  try {
    const studentUser = await studentsRecord.findOne({
      $or: [{ userName }, { idNumber }],
    });

    const staffUser = await userRecord.findOne({
      $or: [{ userName }, { idNumber }],
    });

    // Combine the results to check if the user exists in either collection
    const userExists = studentUser || staffUser;

    // Return a response indicating whether the user exists or not
    if (userExists) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Create student
// @route POST /api/admin/student/
// @access Public
const createStudent = asyncHandler(async (req, res) => {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    acadLevel,
    course,
    yearLevel,
    perAddress,
    perProvince,
    perMuniCity,
    perBarangay,
    perZIP,
    userName,
    password,
    emailAddress,
    contactNo,
    parentGuardianName,
    pfpPic,
    parentGuardianContact,
  } = req.body;

  const encryptedFields = {};
  try {
    // Generate a unique student QR code
    const studentQr = idNumber + generateQRNumber().toString();
    console.log(studentQr);
    // Hash QR code
    const saltqr = await bcrypt.genSalt(6);
    const hashedQR = await bcrypt.hash(studentQr, saltqr);

    // Check if the user, idNumber, or studentQrcode already exists
    const userExist = await studentsRecord.findOne({
      $or: [
        { userName },
        { idNumber },
        { studentQR: hashedQR },
        { emailAddress },
      ],
    });

    if (userExist) {
      console.error("Username, idNumber, or QR code already exists");
      return res
        .status(400)
        .json({ message: "Username, idNumber, or QR code already exists." });
    }

    if (userFName) {
      const { iv, encryptedData } = encrypt(userFName, secretKey);
      encryptedFields.userFName = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (userMName) {
      const { iv, encryptedData } = encrypt(userMName, secretKey);
      encryptedFields.userMName = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (userLName) {
      const { iv, encryptedData } = encrypt(userLName, secretKey);
      encryptedFields.userLName = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (userExt) {
      const { iv, encryptedData } = encrypt(userExt, secretKey);
      encryptedFields.userExt = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (birthDay) {
      const { iv, encryptedData } = encrypt(birthDay, secretKey);
      encryptedFields.birthDay = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (birthPlace) {
      const { iv, encryptedData } = encrypt(birthPlace, secretKey);
      encryptedFields.birthPlace = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (gender) {
      const { iv, encryptedData } = encrypt(gender, secretKey);
      encryptedFields.gender = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (parentGuardianName) {
      const { iv, encryptedData } = encrypt(parentGuardianName, secretKey);
      encryptedFields.parentGuardianName = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (parentGuardianContact) {
      const { iv, encryptedData } = encrypt(parentGuardianContact, secretKey);
      encryptedFields.parentGuardianContact = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (perAddress) {
      const { iv, encryptedData } = encrypt(perAddress, secretKey);
      encryptedFields.perAddress = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (perProvince) {
      const { iv, encryptedData } = encrypt(perProvince, secretKey);
      encryptedFields.perProvince = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (perMuniCity) {
      const { iv, encryptedData } = encrypt(perMuniCity, secretKey);
      encryptedFields.perMuniCity = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (perBarangay) {
      const { iv, encryptedData } = encrypt(perBarangay, secretKey);
      encryptedFields.perBarangay = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (perZIP) {
      const { iv, encryptedData } = encrypt(perZIP, secretKey);
      encryptedFields.perZIP = {
        data: encryptedData,
        iv: iv,
      };
    }

    if (contactNo) {
      const { iv, encryptedData } = encrypt(contactNo, secretKey);
      encryptedFields.contactNo = {
        data: encryptedData,
        iv: iv,
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new studentsRecord({
      idNumber: idNumber,
      acadLevel: acadLevel,
      course: course,
      yearLevel: yearLevel,
      userName: userName,
      password: hashedPassword,
      emailAddress: emailAddress,
      pfpPic: pfpPic,
      studentQR: hashedQR,
      uType: "student",
      status: "Inactive",
      isArchive: false,
      ...encryptedFields,
    });

    await newStudent.save();

    console.log("Student created:", newStudent);

    return res.status(200).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc Update and archive Student by ID
// @route PUT /api/admin/student/update
// @access Public

const updateStudent = asyncHandler(async (req, res) => {
  const {
    _id,
    idNumber,
    qrReset,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    acadLevel,
    course,
    yearLevel,
    perAddress,
    perProvince,
    perMuniCity,
    perBarangay,
    perZIP,
    userName,
    Newpassword,
    emailAddress,
    contactNo,
    parentGuardianName,
    parentGuardianContact,
    pfpPic,
    status,
    isArchive,
  } = req.body;

  // Create an empty object to store the fields to update
  const updateFields = {};

  if (typeof qrReset !== "undefined") {
    const studentQr = idNumber + generateQRNumber().toString();
    // Hash QR code
    const saltqr = await bcrypt.genSalt(6);
    const hashedQR = await bcrypt.hash(studentQr, saltqr);
    updateFields.studentQR = hashedQR;
  }

  if (typeof isArchive !== "undefined") {
    // Check if isArchive has a value, if yes, update it
    updateFields.isArchive = isArchive;
  }

  // Hash the password if it is provided in the request
  if (Newpassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Newpassword, salt);
    updateFields.password = hashedPassword;
  }

  if (userFName) {
    const { iv, encryptedData } = encrypt(userFName, secretKey);
    updateFields.userFName = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (userMName) {
    const { iv, encryptedData } = encrypt(userMName, secretKey);
    updateFields.userMName = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (userLName) {
    const { iv, encryptedData } = encrypt(userLName, secretKey);
    updateFields.userLName = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (userExt) {
    const { iv, encryptedData } = encrypt(userExt, secretKey);
    updateFields.userExt = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (birthDay) {
    const { iv, encryptedData } = encrypt(birthDay, secretKey);
    updateFields.birthDay = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (birthPlace) {
    const { iv, encryptedData } = encrypt(birthPlace, secretKey);
    updateFields.birthPlace = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (gender) {
    const { iv, encryptedData } = encrypt(gender, secretKey);
    updateFields.gender = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (parentGuardianName) {
    const { iv, encryptedData } = encrypt(parentGuardianName, secretKey);
    updateFields.parentGuardianName = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (parentGuardianContact) {
    const { iv, encryptedData } = encrypt(parentGuardianContact, secretKey);
    updateFields.parentGuardianContact = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (perAddress) {
    const { iv, encryptedData } = encrypt(perAddress, secretKey);
    updateFields.perAddress = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (perProvince) {
    const { iv, encryptedData } = encrypt(perProvince, secretKey);
    updateFields.perProvince = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (perMuniCity) {
    const { iv, encryptedData } = encrypt(perMuniCity, secretKey);
    updateFields.perMuniCity = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (perBarangay) {
    const { iv, encryptedData } = encrypt(perBarangay, secretKey);
    updateFields.perBarangay = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (perZIP) {
    const { iv, encryptedData } = encrypt(perZIP, secretKey);
    updateFields.perZIP = {
      data: encryptedData,
      iv: iv,
    };
  }

  if (contactNo) {
    const { iv, encryptedData } = encrypt(contactNo, secretKey);
    updateFields.contactNo = {
      data: encryptedData,
      iv: iv,
    };
  }

  // Add the other fields to the update object
  // Update the student's information

  updateFields.acadLevel = acadLevel;
  updateFields.course = course;
  updateFields.yearLevel = yearLevel;

  updateFields.userName = userName;
  updateFields.emailAddress = emailAddress;

  updateFields.pfpPic = pfpPic;
  updateFields.status = status;

  // Update student based on _id or idNumber using Mongoose
  let updatedStudent;

  if (_id) {
    updatedStudent = await studentsRecord.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });

    console.log("update success");
  } else if (idNumber) {
    updatedStudent = await studentsRecord.findOneAndUpdate(
      { idNumber },
      updateFields,
      {
        new: true,
      }
    );
  } else {
    return res.status(400).json({ errorMessage: "Missing _id and idNumber" });
  }

  if (!updatedStudent) {
    return res.status(400).json({ errorMessage: "Student not found" });
  }

  return res.status(200).json(updatedStudent);
});

// @desc Update password only
// @route PUT /api/admin/student/resetpass
// @access Public
const updateStudentPassword = asyncHandler(async (req, res) => {
  const { emailAddress, newPassword } = req.body;
  console.log(emailAddress, newPassword);
  try {
    // Find the student by email
    const student = await studentsRecord.findOne({ emailAddress });

    if (!student) {
      return res.status(400).json({ errorMessage: "Student Email not found" });
    }

    // Compare the new password (plain text) with the stored hashed password
    const isPasswordSame = await bcrypt.compare(newPassword, student.password);

    if (isPasswordSame) {
      return res
        .status(400)
        .json({ errorMessage: "Same as previous password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the student's password
    student.password = hashedNewPassword;

    // Save the updated student
    await student.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Generate & mail Otp
// @route   POST /api/admin/student/requesteotp
// @access  Public
const requestOtp = asyncHandler(async (req, res) => {
  otpCode = generateOtp();

  var action = req.body.action;
  var receiver = req.body.receiver;
  var subject = "Reset Password";
  var body = emailTemplate(action, otpCode);

  await mailer({ receiver, subject, body })
    .then(() => {
      res.status(200).json({
        status: "success",
      });
      console.log("mail sent!");
    })
    .catch((error) => {
      res.status(400).json({ errorMessage: "error email not sent" });
      throw new Error(error);
    });
});

// @desc    Verify OTP code
// @route   POST /api/admin/student/verifiotp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { inputemailAddress, otpCodeInput } = req.body;

  // console.log(otpCode);

  if (otpCodeInput == otpCode && inputemailAddress == emailAddress) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ errorMessage: "Invalid code." });
    throw new Error("Invalid code.");
  }
});

// @desc    Check if student email exists
// @route   POST /api/admin/student/checkstudent
// @access  Public
const checkStudent = asyncHandler(async (req, res) => {
  let { emailAddress } = req.body;
  const student = await studentsRecord.findOne({ emailAddress });
  emailAddress = req.body.emailAddress;

  if (student) {
    res.status(200).json(student);
  } else {
    res.status(400).json({ errorMessage: `Student doesn't exist.` });
    throw new Error(`Student doesn't exist.`);
  }
});

// @desc    Batch Registration
// @route   POST /api/admin/student/batchreg
// @access  Public
const batchRegisterStudents = asyncHandler(async (req, res) => {
  try {
    const csvFile = req.file;
    if (!csvFile) {
      return res.status(400).json({ error: "No CSV file provided" });
    }

    const fileContent = fs.readFileSync(csvFile.path, "utf-8");
    const csvData = [];

    const parser = fastcsv.parseString(fileContent, { headers: true });

    const processDataPromises = []; // Array to store promises for each row processing

    parser.on("data", (row) => {
      const processDataPromise = new Promise(async (resolve, reject) => {
        try {
          const existingStudent = await studentsRecord.findOne({
            $or: [
              { emailAddress: row.emailAddress },
              { idNumber: row.idNumber },
            ],
          });

          if (!existingStudent) {
            const studentQr = row.idNumber + generateQRNumber().toString();
            const saltqr = await bcrypt.genSalt(6);
            const hashedQR = await bcrypt.hash(studentQr, saltqr);

            const saltpass = await bcrypt.genSalt(7);
            const hashedPassword = await bcrypt.hash(
              row.password.toString(),
              saltpass
            );

            const encryptedFields = {};

            if (row.userFName) {
              const { iv, encryptedData } = encrypt(row.userFName, secretKey);
              encryptedFields.userFName = { data: encryptedData, iv: iv };
            }
            if (row.userMName) {
              const { iv, encryptedData } = encrypt(row.userMName, secretKey);
              encryptedFields.userMName = { data: encryptedData, iv: iv };
            }
            if (row.userLName) {
              const { iv, encryptedData } = encrypt(row.userLName, secretKey);
              encryptedFields.userLName = { data: encryptedData, iv: iv };
            }

            const processedRow = {
              idNumber: row.idNumber,
              userName: row.userName,
              password: hashedPassword,
              emailAddress: row.emailAddress,
              uType: "student",
              status: "Inactive",
              isArchive: false,
              studentQR: hashedQR,
              ...encryptedFields,
            };

            csvData.push(processedRow);
            console.log("processed row", processedRow);
          }
          resolve(); // Resolve the promise once row processing is done
        } catch (error) {
          console.error("Error processing row:", error);
          reject(error); // Reject the promise if there's an error
        }
      });

      processDataPromises.push(processDataPromise);
    });

    parser.on("end", async () => {
      try {
        await Promise.all(processDataPromises); // Wait for all row processing promises to resolve
        console.log("csv data:", csvData);
        console.log("csv Data length", csvData.length);

        if (csvData.length > 0) {
          const newRows = await studentsRecord.insertMany(csvData);
          console.log("new row", newRows);
          res.status(200).json({
            message: "Student records created from CSV successfully.",
            newRows,
            success: true,
          });
        } else {
          res
            .status(400)
            .json({ message: "No new students added from the CSV." });
        }
      } catch (error) {
        console.error("Error creating records:", error);
        res
          .status(500)
          .json({ errorCSV: "An error occurred while processing the CSV." });
      } finally {
        fs.unlinkSync(csvFile.path);
      }
    });

    parser.on("error", (err) => {
      console.error("Error parsing CSV:", err);
      res
        .status(500)
        .json({ errorParsing: "An error occurred while parsing the CSV." });
    });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res
      .status(500)
      .json({ errorProcessing: "An error occurred while processing the CSV." });
  }
});

export {
  checkProfile,
  getStudents,
  createStudent,
  updateStudent,
  batchRegisterStudents,
  //password update
  updateStudentPassword,
  requestOtp,
  verifyOtp,
  checkStudent,
};
