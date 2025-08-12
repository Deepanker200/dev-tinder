const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

//Creating a new web server
const app = express();


app.get('/getUserData', (req, res) => {

  //Logic

  throw new Error("dsadsad");
  res.send("User data sent")
});

//Error should be the first parameter
app.use("/",(err,req,res,next)=>{
if(err){
  res.status(500).send("Something went wrong")
}
})

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});