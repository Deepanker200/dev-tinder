const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return v !== null && v !== "";   // disallow null or empty
                },
            }
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            //Custom validation
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid")
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"
        },
        about: {
            type: String,
            default: "This is a default about of the user!"
        },
        skills: {
            // type:Array
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

//This one is also correct
// const User=mongoose.model("User",userSchema)

module.exports = mongoose.model("User", userSchema)