const express = require('express');
const connectDB = require("./config/database")
const User=require('./models/user');

//Creating a new web server
const app = express();

app.post("/signup",async(req,res)=>{
  const userObj={
    firstName:"Virat",
    lastName:"Kohli",
    emailId:"virat@gmail.com",
    password:"cheeku"
  }

  //Creating a new instance of User Model
  const user=new User(userObj);
  try{
    await user.save();
    res.send("User added successfully")
  }catch(err){
    res.status(400).send("Error saving the user"+ err.message)
  }
})


connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  }).catch(err => {
    console.error("DB cannot connected: ", err.message)
  })

