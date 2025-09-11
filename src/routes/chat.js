const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.post('/chat', userAuth, async (req, res) => {
    const { userId, targetUserId } = req.body;

    try {
        let chat = Chat.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        })


        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })

            await chat.save();
        }

        res.json(chat)

    } catch (err) {
        console.log(err);
    }
})

module.exports = chatRouter;