const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;

    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({
            path: "messages.senderId",       //It means: “Inside the messages array of this Chat document
            select: "firstName lastName"
        })


        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })

            await chat.save();
        }


        let connectionName = await User.findById(targetUserId, { _id: 0, firstName: 1 });
        // console.log(targetUserId);


        res.json({ chat, connectionName })

    } catch (err) {
        console.log(err);
    }
})

module.exports = chatRouter;