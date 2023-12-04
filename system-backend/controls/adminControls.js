import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

//modelschema and token gen imports
import { userRecord, studentsRecord, entryRecord } from "../models/index.js";
import { generateToken, encrypt, decrypt } from "../utility/index.js";

//configs
dotenv.config();
const secretKey = process.env.USER_SECRET;

// @desc Get User Array
// @route GET /api/admin/
// @access Public
const getUserlist = asyncHandler(async (req, res) => {
  const { getUserlist } = req.query;
  console.log(getUserlist);

  /////
  if (!getUserlist || getUserlist === "") {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Define the start and end date of the current year
    const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year

    const users = await userRecord
      .find({
        isArchive: false,
        createdAt: { $gte: startDate, $lt: endDate }, // Filter by createdAt within the current year
      })
      .limit(2000); // Limit the results to 2000 records

    return res.status(200).json({ users });
  } else if (getUserlist == "all") {
    const users = await userRecord.find({ isArchive: false });

    return res.status(200).json({ users });
  } else if (getUserlist == "archived") {
    const users = await userRecord.find({ isArchive: true });

    return res.status(200).json({ users });
  } else {
    // Handle other cases if needed
    return res.status(400).json({ error: "Invalid getStud parameter" });
  }
});

// @desc Get Count of many stuff
// @route GET /api/admin/getStat
// @access Public
const getStat = asyncHandler(async (req, res) => {
  try {
    // Your query to find students who have timed in
    const query = { timedIn: true }; // Change this query as per your schema

    // Use the countDocuments method to count the matching documents
    const count = await Student.countDocuments(query);

    // Log or return the count
    console.log(`Count result ${count}`);
    return count;
  } catch (error) {
    console.error("Error counting :", error);
    throw error;
  }
});

// @desc Get User profile
// @route GET /api/admin/me
// @access Public
const getProfile = asyncHandler(async (req, res) => {
  const { idNumber, _id } = req.body; // Access data from the request body

  console.log(idNumber, _id);
  try {
    // Try to find a matching record in studentsRecord
    let user = await studentsRecord.findOne({
      $or: [{ _id }, { idNumber }],
    });

    // If not found in studentsRecord, try finding it in userRecord
    if (!user) {
      user = await userRecord.findOne({
        $or: [{ _id }, { idNumber }],
      });
    }

    if (user) {
      // Create a response object with decrypted fields
      const decryptedUser = {
        idNumber: user.idNumber,
      };

      // Function to add a field if it's encrypted, otherwise exclude it
      function addDecryptedField(field, data, iv) {
        if (data && iv) {
          decryptedUser[field] = decrypt(data, iv);
        }
      }

      addDecryptedField("userFName", user.userFName?.data, user.userFName?.iv);
      addDecryptedField("userMName", user.userMName?.data, user.userMName?.iv);
      addDecryptedField("userLName", user.userLName?.data, user.userLName?.iv);
      addDecryptedField("userExt", user.userExt?.data, user.userExt?.iv);
      addDecryptedField("birthDay", user.birthDay?.data, user.birthDay?.iv);
      addDecryptedField(
        "birthPlace",
        user.birthPlace?.data,
        user.birthPlace?.iv
      );
      addDecryptedField("gender", user.gender?.data, user.gender?.iv);
      addDecryptedField(
        "perAddress",
        user.perAddress?.data,
        user.perAddress?.iv
      );
      addDecryptedField(
        "perProvince",
        user.perProvince?.data,
        user.perProvince?.iv
      );
      addDecryptedField(
        "perMuniCity",
        user.perMuniCity?.data,
        user.perMuniCity?.iv
      );
      addDecryptedField(
        "perBarangay",
        user.perBarangay?.data,
        user.perBarangay?.iv
      );
      addDecryptedField("perZIP", user.perZIP?.data, user.perZIP?.iv);
      addDecryptedField("contactNo", user.contactNo?.data, user.contactNo?.iv);
      addDecryptedField(
        "parentGuardianName",
        user.parentGuardianName?.data,
        user.parentGuardianName?.iv
      );
      addDecryptedField(
        "parentGuardianContact",
        user.parentGuardianContact?.data,
        user.parentGuardianContact?.iv
      );

      decryptedUser.userName = user.userName;
      decryptedUser.emailAddress = user.emailAddress;
      decryptedUser.acadLevel = user.acadLevel;
      decryptedUser.course = user.course;
      decryptedUser.yearLevel = user.yearLevel;
      decryptedUser.pfpPic = user.pfpPic;
      decryptedUser.studentQR = user.studentQR;
      decryptedUser.uType = user.uType;
      decryptedUser.status = user.status;

      return res.status(200).json(decryptedUser);
    } else {
      // If not found in either collection, return
      console.log("user not found");
      return res.status(404).json({ errorMessage: "User not found" });
    }
  } catch (error) {
    // Handle errors as needed
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// @desc Register user
// @route POST /api/admin
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    userName,
    password,
    emailAddress,
    contactNo,
    pfpPic,
    uType,
  } = req.body;

  console.log(
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    userName,
    password,
    emailAddress,
    contactNo,
    pfpPic,
    uType
  );
  const encryptedFields = {};
  // Check if any required fields are missing
  if (!userFName || !userName || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Invalid request data. Missing fields." });
  }

  // Check if the user already exists
  const userExist = await userRecord.findOne({
    $or: [{ userName }, { idNumber }, { emailAddress }],
  });

  if (userExist) {
    console.log(userExist);
    return res.status(400).json({ errorMessage: "User already exists." });
  }

  // Create an object to store encrypted values

  // Encrypt sensitive fields if they are defined
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

  // Create User
  const user = userRecord.create({
    idNumber: idNumber,
    userName: userName,
    password: hashedPassword,
    emailAddress: emailAddress,
    pfpPic: pfpPic,
    uType: uType || "staff",
    isArchive: false,
    status: "Inactive",
    ...encryptedFields,
  });

  if (user) {
    return res.status(200).json({ message: "Registration successful" });
  } else {
    return res.status(400).json({ errorMessage: "Invalid data" });
  }
});

// @desc Login user
// @route POST /api/admin/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName, password);
  try {
    let user = await userRecord.findOne({ userName });

    if (!user) {
      // If the user is not found in userRecord, check studentsRecord
      user = await studentsRecord.findOne({ userName });

      if (!user) {
        return res.status(400).json({ errorMessage: "No user found" });
      }
    }

    // Set the user's status to "Active"
    user.status = "Active";
    await user.save();

    // Check if the user is archived
    if (user.isArchive === true) {
      return res.status(400).json({ errorMessage: "User is archived" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ errorMessage: "Invalid credentials" });
    }

    // If the username and password are valid, generate a token and send a successful response

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // Only accessible via HTTP requests
      secure: true, // Set to true in production with HTTPS
      sameSite: "none",
    });

    console.log(user);
    return res.status(200).json({
      _id: user.id,
      idNumber: user.idNumber,

      isArchive: user.isArchive,
      uType: user.uType,
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// @desc validate user data assign route
// @route GET /api/admin/validate
// @access  Public

const validateUser = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    // Find the user in userRecord
    let user = await userRecord.findById(token);

    if (!user) {
      // If not found in userRecord, find the user in studentsRecord
      user = await studentsRecord.findById(token);
    }

    // Check if the user was found
    if (!user) {
      return res.status(400).json({
        errorMessage: "Invalid user",
      });
    }

    // Check if user is not archived
    if (user.isArchive === false) {
      // If admin, student, or guard, return the user type
      return res.status(200).json({
        uType: user.uType,
      });
    } else {
      // If user is archived, return an error
      return res.status(400).json({
        errorMessage: "User is archived",
      });
    }
  } catch (error) {
    console.error("Error validating user:", error);
    return res.status(500).json({
      errorMessage: "Internal server error",
    });
  }
});

// @desc updating user data
// @route PUT /api/admin/updateuser/:id
// @access Public

const updateUser = asyncHandler(async (req, res) => {
  const {
    _id,
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    birthDay,
    birthPlace,
    gender,
    userName,
    Newpassword,
    emailAddress,
    contactNo,
    pfpPic,
    uType,
    status,
    isArchive,
  } = req.body;

  // Create an empty object to store the fields to update
  const updateFields = {};

  // Check if isArchive has a value, if yes, update it
  if (typeof isArchive !== "undefined") {
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

  if (contactNo) {
    const { iv, encryptedData } = encrypt(contactNo, secretKey);
    updateFields.contactNo = {
      data: encryptedData,
      iv: iv,
    };
  }

  // Add the other fields to the update object
  updateFields.userName = userName;
  updateFields.emailAddress = emailAddress;
  updateFields.pfpPic = pfpPic;
  updateFields.uType = uType;
  updateFields.status = status;

  let updatedUser;

  if (_id) {
    updatedUser = await userRecord.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });
  } else if (idNumber) {
    updatedUser = await userRecord.findOneAndUpdate(
      { idNumber },
      updateFields,
      { new: true }
    );
  } else {
    return res.status(400).json({ errorMessage: "Missing _id and idNumber" });
  }

  if (!updatedUser) {
    return res.status(400).json({ errorMessage: "User not found" });
  }

  return res.status(200).json(updatedUser);
});

//entryRecord

// @desc Get necessary data for graph and charts
// @route GET /api/admin/getdata
// @access Public
const getData = asyncHandler(async (req, res) => {
  const { countTotal, idNumber } = req.query;
  console.log(countTotal, idNumber);

  try {
    let count = 0;

    if (countTotal === "student") {
      console.log("Counting students");
      count = await studentsRecord.countDocuments({ isArchive: false });
    } else if (
      countTotal === "present" ||
      countTotal === "late" ||
      countTotal === "absent"
    ) {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );

      // Fetch all student records
      const allStudents = await studentsRecord.find({ isArchive: false });

      // Initialize the count
      count = 0;

      // Iterate through each student and count based on the criteria
      for (const student of allStudents) {
        const studentIdNumber = student.idNumber;

        // Count entry records for the student with an entry date within the current day
        const entryCount = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
        });

        if (countTotal === "present" && entryCount > 0) {
          count++; // Increment the count for students with entries today
        } else if (countTotal === "late") {
          // Define the time range for "late" (8 AM to 12 AM)
          const lateStartTime = new Date();
          lateStartTime.setHours(8, 0, 0, 0);
          const lateEndTime = new Date();
          lateEndTime.setHours(23, 59, 59, 999);

          // Find the entry record with an entry date within the time range for "late" (Time in)
          const lateEntry = await entryRecord.findOne({
            idNumber: studentIdNumber,
            entryDatetime: { $gte: lateStartTime, $lte: lateEndTime },
            logType: "Time in", // Consider only "Time in" entries
          });

          if (lateEntry) {
            count++; // Increment the count for "late" students
          }
        } else if (countTotal === "absent" && entryCount === 0) {
          count++; // Increment the count for students with no entries today (absent)
        }
      }
    }

    // Respond if successful
    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting data", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// @desc Get staff qr data
// @route GET /api/admin/getstaffqrRdata
// @access  Public
const getStaffQrData = asyncHandler(async (req, res) => {
  const { countTotal, idNumber } = req.query;

  try {
    let count = 0;
    if (countTotal === "totalday" && idNumber) {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );

      // If idNumber is provided, count entries for the specific user
      if (idNumber) {
        count = await entryRecord.countDocuments({
          scannedBy: idNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
        });
      } else {
        // If idNumber is not provided, count all entries for the day
        count = await entryRecord.countDocuments({
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
        });
      }
    } else if (countTotal === "timein" && idNumber) {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );

      // If idNumber is provided, count "Time In" entries for the specific user
      if (idNumber) {
        count = await entryRecord.countDocuments({
          scannedBy: idNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
          logType: "Time in",
        });
      } else {
        // If idNumber is not provided, count all "Time In" entries for the day
        count = await entryRecord.countDocuments({
          scannedBy: idNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
          logType: "Time in",
        });
      }
    } else if (countTotal === "timeout" && idNumber) {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );

      // If idNumber is provided, count "Time Out" entries for the specific user
      if (idNumber) {
        count = await entryRecord.countDocuments({
          scannedBy: idNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
          logType: "Time out",
        });
      } else {
        // If idNumber is not provided, count all "Time Out" entries for the day
        count = await entryRecord.countDocuments({
          scannedBy: idNumber,
          entryDatetime: { $gte: startOfDay, $lte: endOfDay },
          logType: "Time out",
        });
      }
    }

    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting data", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// @desc Get dounut graph
// @route GET /api/admin/getentryRdata
// @access  Public
const getEntryRdata = asyncHandler(async (req, res) => {
  const { countTotal } = req.query;

  try {
    let count = 0;
    if (countTotal === "timeInR") {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );
      // Count "Time In" entries for the day
      count = await entryRecord.countDocuments({
        entryDatetime: { $gte: startOfDay, $lte: endOfDay },
        logType: "Time in",
      });
    } else if (countTotal === "timeOutR") {
      // Get the current date
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );
      // Count "Time Out" entries for the day
      count = await entryRecord.countDocuments({
        entryDatetime: { $gte: startOfDay, $lte: endOfDay },
        logType: "Time out",
      });
    }
    res.status(200).json(count);
  } catch (error) {
    console.error("Error counting data", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

// @desc Get bar data
// @route GET /api/admin/getbardata
// @access  Public
const getBarData = asyncHandler(async (req, res) => {
  const { countTotal } = req.query;
  console.log(countTotal);

  try {
    const counts = {
      dayone: 0,
      daytwo: 0,
      daythree: 0,
      dayfour: 0,
      dayfive: 0,
      daysix: 0,
      dayseven: 0,
    };

    if (countTotal === "presentInWeek") {
      // Get the current date and time
      const currentDate = new Date();

      // Calculate the start and end dates for the past 7 days
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );
      const sixDaysAgo = new Date(
        currentDate.getTime() - 6 * 24 * 60 * 60 * 1000
      );
      const fiveDaysAgo = new Date(
        currentDate.getTime() - 5 * 24 * 60 * 60 * 1000
      );
      const fourDaysAgo = new Date(
        currentDate.getTime() - 4 * 24 * 60 * 60 * 1000
      );
      const threeDaysAgo = new Date(
        currentDate.getTime() - 3 * 24 * 60 * 60 * 1000
      );
      const twoDaysAgo = new Date(
        currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
      );
      const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

      // Fetch all student records
      const allStudents = await studentsRecord.find({ isArchive: false });

      // Iterate through each student and count based on the criteria
      for (const student of allStudents) {
        const studentIdNumber = student.idNumber;

        // Count entry records for the student with entry dates within the past 7 days and logType "Time in"
        const entryCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: oneDayAgo,
            $lte: endOfDay,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (entryCounts > 0) {
          counts.dayone++;
        }

        // Count entry records for each day within the past 7 days and logType "Time in"
        const dayTwoCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: twoDaysAgo,
            $lte: oneDayAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (dayTwoCounts > 0) {
          counts.daytwo++;
        }

        const dayThreeCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: threeDaysAgo,
            $lte: twoDaysAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (dayThreeCounts > 0) {
          counts.daythree++;
        }

        const dayFourCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: fourDaysAgo,
            $lte: threeDaysAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (dayFourCounts > 0) {
          counts.dayfour++;
        }

        const dayFiveCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: fiveDaysAgo,
            $lte: fourDaysAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (dayFiveCounts > 0) {
          counts.dayfive++;
        }

        const daySixCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: sixDaysAgo,
            $lte: fiveDaysAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (daySixCounts > 0) {
          counts.daysix++;
        }

        const daySevenCounts = await entryRecord.countDocuments({
          idNumber: studentIdNumber,
          entryDatetime: {
            $gte: currentDate.getTime() - 7 * 24 * 60 * 60 * 1000,
            $lte: sixDaysAgo,
          },
          logType: "Time in", // Count only "Time in" entries
        });

        if (daySevenCounts > 0) {
          counts.dayseven++;
        }
      }
    }

    // Respond with the counts for the past 7 days
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error counting data", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export {
  getStaffQrData,
  getEntryRdata,
  updateUser,
  registerUser,
  loginUser,
  getProfile,
  getUserlist,
  validateUser,
  getData,
  getBarData,
};
