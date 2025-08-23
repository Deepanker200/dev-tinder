const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest=require("../models/connectionRequest")
const userRouter = express.Router();

//GET all the pending connection request for the loggedIn user
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests=await ConnectionRequest.find({
         toUserId:loggedInUser._id   
        })

        res.json({
            message:"Data fetched successfully",
            data:connectionRequests
        })
    } catch (err) {
        req.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;