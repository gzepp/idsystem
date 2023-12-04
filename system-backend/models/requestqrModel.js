import mongoose from "mongoose";

const requestQrSchema = new mongoose.Schema(
  {
    idNumber: {
      type: String,
      required: false,
    },

    reqFullname: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      require: false,
    },

    isArchive: {
      type: Boolean,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("requestQrRecord", requestQrSchema);
