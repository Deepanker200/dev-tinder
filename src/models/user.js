const mongoose = require('mongoose');
const validator = require('validator');

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
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid Email address: ' + value);
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error('Password must be at least 8 characters long, and must contain at least')
                }
            }
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
            default: "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error('Invalid URL: ' + value);
                }
            }
        },
        about: {
            type: String,
            default: "This is a default about of the user!"
        },
        skills: {
            // type:Array
            type: [String],
        }
    },
    {
        timestamps: true
    }
)

//This one is also correct
// const User=mongoose.model("User",userSchema)

module.exports = mongoose.model("User", userSchema)