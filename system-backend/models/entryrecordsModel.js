import mongoose from "mongoose";

const entryRecordSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    required: false,
  },
  studentName: {
    type: String,
    require: false,
  },

  placeOfentry: {
    type: String,
    require: false,
  },

  scannedBy: {
    type: String,
    require: false,
  },

  logType: {
    type: String,
    require: false,
  },

  entryDatetime: {
    type: Date,
    require: false,
  },
});

export default mongoose.model("entryRecord", entryRecordSchema);
