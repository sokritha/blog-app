const Blog = require("../models/BlogModel");
const Filter = require("bad-words");
const User = require("../models/UserModel");
const mongoose = require("mongoose");

exports.createBlog = async (req, res, next) => {
  try {
    // check for bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.content);

    if (isProfane)
      return res.status(400).json({
        status: "fail",
        message: "Creating Failed because it contains bad words.",
      });

    const newBlog = await Blog.create({
      authorId: req.user._id,
      title: req.body.title,
      content: req.body.content,
      private: req.body.isPublished || false,
    });

    // Update the user post count
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { postCount: 1 }, // increment the field postCount + 1
      },
      {
        new: true, // get the new doc after update
      }
    );
    console.log(updateUser);

    res.status(201).json({
      status: "success",
      data: newBlog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const hasCategory = req.query.category;
    if (hasCategory) {
      const blogs = await Blog.find({ category: hasCategory }) // find only the blogs that match with category
        .populate("authorId")
        .populate("comments")
        .sort("-createdAt");

      res.status(200).json({
        status: "success",
        data: blogs,
      });
    } else {
      const blogs = await Blog.find({}) // find all
        .populate("authorId")
        .populate("comments")
        .sort("-createdAt");

      res.status(200).json({
        status: "success",
        data: blogs,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate("authorId")
      .populate("likes")
      .populate("comments");

    //update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        ...req.body,
        authorId: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const addLikeBlogPost = async (req, res, next) => {
  try {
    //1.Find the blog to be liked
    const { blogId } = req.body;
    const post = await Blog.findById(postId);

    //2. Find the login user
    const loginUserId = req.user?._id;

    //3. Find is this user has liked this post?
    const isLiked = blog?.isLiked;
  
    //4.remove the user from dislikes array if exists
    if (alreadyDisliked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(post);
    }
    //Toggle
    //Remove the user if he has liked the post
    if (isLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(post);
    } else {
      //add to likes
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(post);
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
