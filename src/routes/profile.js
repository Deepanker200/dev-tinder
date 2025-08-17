const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateProfileEditData } = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(cookies);
    res.send(user)

  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request")
    };

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save();

    // res.send(`${loggedInUser.firstName}, your profile updated successfully`)
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    })

  } catch (err) {
    return res.status(400).send("ERROR: " + err.message)
  }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const {password} = req.body;
    console.log(password);
    res.send(password);
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = profileRouter;