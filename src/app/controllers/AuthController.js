const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../config/auth.json")

const router = express.Router();
function tokenGenerator ( params = {} )  {
    return jwt.sign(params, auth.secret, {
        expiresIn: 86400,
    })
}

// User registration route
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.password = undefined;
    return res.send({user, token: tokenGenerator({ id: user.id }) });
  } catch (err) {
    res.status(400).send({
      error: "Email address has already been used.",
    });
  }
});

// Authenticate registration route
router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
        .select({ password: +password });

    if (!user) {
      res.status(400).send({ error: "User not found" });
    }
    else if (!await bcrypt.compare(password, user.password)) {
      res.status(400).send({ error: "User email or password does not match" });
    }else {
        let userData = await User.findOne(user);
        userData.password = undefined; 
        res.send({ userData, token: tokenGenerator({ id: userData.id }) });
    }
    

  } catch (error) {
    res.status(400).send({ error: "Authentication failed, try again later" });
  }
});

module.exports = (app) => app.use("/auth", router);
