const express = require('express');
const connectDB = require("./config/database")
const User = require('./models/user');
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

require("./utils/cronjob");

//Creating a new web server
const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
//Using this so that we can store data in collections~ Convert JSON to JS object/ BSON
app.use(express.json());

app.use(cookieParser());

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user");
const paymentRouter = require('./routes/payment');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);


connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  }).catch(err => {
    console.error("DB cannot connected: ", err.message)
  })

