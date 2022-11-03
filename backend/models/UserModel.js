const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please input your username"],
    },
    email: {
      type: String,
      required: [true, "Please input your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please input a valid email"],
    },
    photo: String,
    password: {
      type: String,
      required: [true, "Please input your password"],
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please input your confirm password"],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Password & Confirm password is not matching",
      },
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Guest", "Blogger"],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

// Match Password
userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
