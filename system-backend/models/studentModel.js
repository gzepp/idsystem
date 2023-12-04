import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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

    acadLevel: {
      type: String,
      require: false,
    },

    course: {
      type: String,
      require: false,
    },

    yearLevel: {
      type: String,
      require: false,
    },

    //adress

    perAddress: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    perProvince: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    perMuniCity: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    perBarangay: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    perZIP: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    //account info

    userName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      require: true,
    },

    emailAddress: {
      type: String,
      require: false,
    },

    contactNo: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    //emergency contact

    parentGuardianName: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    parentGuardianContact: {
      data: { type: String, required: false },
      iv: { type: String, required: false },
    },

    //others

    studentQR: {
      type: String,
      require: false,
    },

    pfpPic: {
      type: String,
      required: false,
    },

    uType: {
      type: String,
      required: false,
      default: "student",
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

export default mongoose.model("studentsRecord", studentSchema);
