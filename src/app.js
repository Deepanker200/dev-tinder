const express = require('express');
const connectDB = require("./config/database")
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation")
const brcrypt = require('bcrypt');

//Creating a new web server
const app = express();

//Using this so that we can store data in collections~ Convert JSON to JS object/ BSON
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await brcrypt.hash(password, 10)
    console.log(passwordHash);

    //When we use express.json and sending data from POST method
    //Creating a new instance of the User model
    const user = new User({
      firstName, lastName, emailId, password: passwordHash
    });

    await user.save();
    res.send("User added successfully")
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await brcrypt.compare(password,user.password)
    if(isPasswordValid){
      res.send("Login Successfully")
    }else{
      throw new Error("Invalid credentials")
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})

//Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

//Feed API- GET/feed- get all the user from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

//Delete a user from the database
app.delete("/user", async (req, res) => {
  //findById() in Mongoose is special — it only works for the _id field.
  const userId = req.body.userId;

  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong")
  }
})

//Updating data in database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  // const emailId = req.body.emailId;
  const data = req.body;

  try {

    const ALLOWED_UPDATES = [
      "photoUrl", "about", "gender", "age", "skills", "password"
    ]
    // console.log(data);

    const isUpdateAllowed = Object.keys(data).every(k =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10")
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data,
      {
        returnDocument: "before",
        runValidators: true
      })
    // const user = await User.findOneAndUpdate({ emailId: emailId }, data,
    // {
    //   returnDocument: "before",
    //   runValidators: true
    // })

    //Special case for null(email-> probably)
    // if (!user) {
    //   return res.status(404).send("User not found");
    // }

    console.log(user);
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Update FAILED: " + err.message)
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

