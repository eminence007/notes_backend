const express = require("express");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//registration
userRouter.post("/register", async (req, res) => {
  const { email, pass, location, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      //salt-rounds = 5
      const user = new UserModel({ email, pass: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "Registration has been done!" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email }); //ES-6
    console.log("user:", user);
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login Successful!",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong Credentials!" });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = {
  userRouter,
};
