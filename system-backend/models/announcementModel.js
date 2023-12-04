import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      require: false,
    },

    description: {
      type: String,
      require: false,
    },

    dateposted: {
      type: Date,
      require: false,
    },

    postImage: {
      type: String,
      require: false,
    },

    tags: {
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

export default mongoose.model("announceRecord", announcementSchema);
