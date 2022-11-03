const express = require("express");
const userRouter = require("./routes/userRoute");
const blogRouter = require("./routes/blogRoute");

const app = express();

// define global middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log("This is my middleware");
  next();
});

// define route api
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
// app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/email", emailMsgRouter);
// app.use("/api/category", categoryRouter);
//err handler
// app.use(notFound);
// app.use(errorHandler);

module.exports = app;
