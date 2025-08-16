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


  // console.log(req.body);
  //When we use express.json and sending data from POST method
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully")
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message)
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
app.patch("/user", async (req, res) => {
  // const userId = req.body.userId;
  const emailId = req.body.emailId;
  const data = req.body;
  // console.log(data);

  try {
    // const user=await User.findByIdAndUpdate({ _id: userId }, data,{returnDocument:"before"})
    const user = await User.findOneAndUpdate({ emailId: emailId }, data,
      {
        returnDocument: "before",
        runValidators: true
      })

    if (!user) {
      return res.status(404).send("User not found");
    }

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

