const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user');
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

require("./utils/cronjob");

//Creating a new web server
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],  // ✅ ADD THIS
  allowedHeaders: ["Content-Type"]  // ✅ ADD THIS
}))
//Using this so that we can store data in collections~ Convert JSON to JS object/ BSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // ✅ ADD THIS for FormData

app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user");
const paymentRouter = require('./routes/payment');
const chatRouter = require('./routes/chat');
const initializeSocket = require('./utils/socket');

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

//Socket IO
const server = http.createServer(app);
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connection established..");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  }).catch(err => {
    console.error("DB cannot connected: ", err.message)
  })

