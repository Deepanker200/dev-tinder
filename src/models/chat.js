const mongoose = require("mongoose");

const messageSchema=new mongoose.Schema({
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
})

const chatschema = new mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        ],
        messages:[]
    }
)

const Chat = mongoose.model("Chat", chatschema)

module.exports = { Chat }