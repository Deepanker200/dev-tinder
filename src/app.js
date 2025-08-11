const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

//Creating a new web server
const app = express();

//Handle Auth Middleware for all request GET, POST, DELETE, PATCH, PUT
app.use("/admin",adminAuth)

app.get("/admin/getAllData",(req,res)=>{
    //Logic for data

    res.send("All data sent")
})

app.get('/user', userAuth,(req, res) => {
  res.send({ firstName: "Deepanker", lastName: "Tiwari" });
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});