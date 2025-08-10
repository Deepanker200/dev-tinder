const express = require('express');

//Creating a new web server
const app = express();

app.use("/test",(req, res) => {
    res.send("Hello from the server!");
});


app.use("/hello",(req, res) => {
    res.send("Hello from dashboard!");
});




app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");

});