const User = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = async (id) => {
  return await jwt.sign(
    {
      id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expired after 24 hours
    },
    process.env.JWT_SECRET
  );
};

exports.signup = async (req, res, next) => {
  try {
    // save to database
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = await signToken(newUser._id);

    res.status(201).json({
      status: "success",
      data: newUser,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if the email & password is provided
  if (!email || !password)
    return res.status(400).json({
      status: "fail",
      message: "Please input your email or password",
    });

  // check if the email exist & password is correct
  const existedUser = await User.findOne({ email });

  if (!existedUser || !(await existedUser.verifyPassword(password)))
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });

  // Generate token for authorization
  const token = await signToken(existedUser._id);

  // remove password from the output
  existedUser.password = undefined;

  // if all correct, send the response
  res.status(200).json({
    status: "success",
    data: existedUser,
    token,
  });
};

exports.protect = async (req, res, next) => {
  // Get the token from the header request
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token)
    return res.status(401).json({  
      status: "fail",
      message: "Please login to get access",
    });

  // Verify the token - expired || untrusted
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({
      status: "fail",
      message: err.message,
    });
  }
  console.log(decoded);

  // Check if user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does not longer exist.",
    });

  // Grant Access to protected route
  req.user = freshUser;
  next();
};
