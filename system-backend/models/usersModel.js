import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    idNumber: {
      type: String,
      required: false,
    },

    //basic info

    userFName: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    userMName: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    userLName: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    userExt: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    birthDay: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    birthPlace: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    gender: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    //account

    userName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    emailAddress: {
      type: String,
      required: true,
    },

    contactNo: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    //other

    pfpPic: {
      type: String,
      required: false,
    },

    uType: {
      type: String,
      required: true,
      default: "staff",
    },

    status: {
      type: String,
      require: false,
      default: "Inactive",
    },

    isArchive: {
      type: Boolean,
      require: false,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("userRecord", userSchema);
