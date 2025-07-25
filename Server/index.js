const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const DBconnect = require("./DBconnect.js");
const authRouter = require("./routers/authRouter.js");
const postsRouter = require("./routers/postsRouter.js");
const userRouter = require("./routers/userRouter.js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

//Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://social-media-app-flame-iota.vercel.app",
  })
);

app.use("/auth", authRouter);
app.use("/post", postsRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.status(200).send("OK from Server");
});

const PORT_NO = process.env.PORT || 4000;

DBconnect();
app.listen(PORT_NO, () => {
  console.log(`Listening on PORT: ${PORT_NO}`);
});
