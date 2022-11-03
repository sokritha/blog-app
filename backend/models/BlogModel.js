const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required"],
    },
    title: {
      type: String,
      required: [true, "Blog's title is required"],
    },
    content: {
      type: String,
      required: [true, "Blog's content is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    private: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, "Post category is required"],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
