import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
// import crypto from "crypto";
//test
import twilio from "twilio";

// // Generate a random 32-byte key (256 bits)
// const key = crypto.randomBytes(32);

// // Encode the key in Base64 and log it
// const base64Key = key.toString("base64");
// console.log(base64Key);

//Other folder imports
import dbConfig from "./config/dbconfig.js";

//Route Imports
import {
  adminStudentroute,
  adminRoute,
  announceRoute,
  entryRoutes,
  registrarStudentRoutes,
  cloudinaryRoutes,
} from "./routes/index.js";

//configs
dotenv.config();
const port = process.env.PORT || 3000;

//twilio test
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
const server = http.createServer(app);

//Allowing Cor for all routess
const io = new Server(server, {
  cors: {
    origin: "https://shams-uniid.web.app", // Replace with your client's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//Database config

dbConfig();

//App uses

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.locals.io = io;

app.listen(port, () => console.log("Listening to port:", port));

//Routes

app.use("/api/admin", adminRoute);
app.use("/api/admin/student", adminStudentroute);
app.use("/api/admin/announcement", announceRoute);
app.use("/api/guard/entry", entryRoutes);
app.use("/api/registrar", registrarStudentRoutes);

//cloudinary allows the frontend to upload image/file
app.use("/api/cloudinary", cloudinaryRoutes);

//test
// app.post("/api/test", (req, res) => {
//   const { to } = req.body;
//   const message = "Your predefined message goes here"; // Replace with your message

//   client.messages
//     .create({
//       body: message,
//       from: process.env.TWILIOL_NUMBER, // Your Twilio phone number
//       to: "+639761779511", // Recipient's phone number
//     })
//     .then((message) => {
//       console.log("Message sent:", message.sid);
//       res.status(200).json({ success: true, message: "Message sent!" });
//     })
//     .catch((error) => {
//       console.error("Error sending message:", error);
//       res.status(500).json({ success: false, error: error.message });
//     });
// });
