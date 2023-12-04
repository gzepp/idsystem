import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userRecord from "../models/usersModel.js";
import studentsRecord from "../models/studentModel.js";

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token || req.body.token;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user exists in userRecord
      const userFromUserRecord = await userRecord.findById(decoded.id);

      // Check if the user exists in studentsRecord
      const userFromStudentsRecord = await studentsRecord.findById(decoded.id);

      if (userFromUserRecord || userFromStudentsRecord) {
        // User exists in either userRecord or studentsRecord, set it in req.user
        req.user = userFromUserRecord || userFromStudentsRecord;
        next();
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

export { protect };
