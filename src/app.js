const express = require('express');
const connectDB = require("./config/database")
const User = require('./models/user');

//Creating a new web server
const app = express();

//Using this so that we can store data in collections~ Convert JSON to JS object/ BSON
app.use(express.json());

app.post("/signup", async (req, res) => {


  // const userObj = {
  //   firstName: "MS",
  //   lastName: "Dhoni",
  //   emailId: "msdhoni@gmail.com",
  //   password: "mahi"
  // }
  // //Creating a new instance of User Model
  // const user=new User(userObj);


  console.log(req.body);
  //When we use express.json and sending data from POST method
  const user = new User(req.body);
  
  try {
    await user.save();
    res.send("User added successfully")
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message)
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

