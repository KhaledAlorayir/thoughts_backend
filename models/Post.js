const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },

  comments: {
    type: [{ comment: String, user: mongoose.Types.ObjectId }],
    default: [],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post", PostSchema);
