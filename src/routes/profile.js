const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateProfileEditData, validateSignUpData } = require("../utils/validation")
const bcrypt = require('bcrypt');


profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(cookies);
    res.send(user)

  } catch (err) {
    res.status(400).send("ERROR : " + err.message)
  }
})


profileRouter.patch("/edit", userAuth, async (req, res) => {
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

profileRouter.patch('/password', userAuth, async (req, res) => {
  try {
    const { password } = req.user;
    const { oldPassword, newPassword } = req.body
    // console.log(password);
    // console.log(oldPassword);

    const checkPassword = await bcrypt.compare(oldPassword, password)
    if (!checkPassword) {
      throw new Error("Something went wrong")
    } else {
      const passwordHash = await bcrypt.hash(newPassword, 10)

      const user = req.user;
      user.password = passwordHash;
      // console.log(user.password);

      await user.save();
      // console.log(user);

      res.send("Password updated successfully");
    }
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = profileRouter;