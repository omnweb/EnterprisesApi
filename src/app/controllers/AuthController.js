const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../config/auth.json");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

const router = express.Router();
function tokenGenerator(params = {}) {
  return jwt.sign(params, auth.secret, {
    expiresIn: 86400,
  });
}

// User registration route
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.password = undefined;
    return res.send({ user, token: tokenGenerator({ id: user.id }) });
  } catch (err) {
    res.status(400).send({
      error: "Email address has already been used.",
    });
  }
});

// Authenticate registration route
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select({
      password: +password,
    });
    
    if (!user) {
      res.status(400).send({ error: "User not found" });
    } else if (!(await bcrypt.compare(password, user.password))) {
      res.status(400).send({ error: "User email or password does not match" });
    } else {
      let userData = await User.findOne(user);
      userData.password = undefined;
      res.send({ userData, token: tokenGenerator({ id: userData.id }) });
    }
  } catch (error) {
    res.status(400).send({ error: "Authentication failed, try again later" });
  }
});

// Recover Password
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).send({ error: "User not found" });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpire: now,
      },
    });

    // Send recovery email notification
      mailer.sendMail({
        from: "netomatiazi@hotmail.com",
        to: email,
        subject: "EnterprisesAPI: Password Reset",
        template: "auth/forgot_password",
        html: `<p>Did you try to reset your password? <br/> If yes, use the following token: <br/>  <b>${token}</b> </p>`,
        context: { token }
      },
      (error) => {
        if (error) {
          return res
            .status(400)
            .send({ error: "Error sending password reset email", error });
        }
        return res.send("Email sent");
      }
    );
  } catch (error) {
    res.status(400).send({ error: "Error resetting email" });
  }
});

router.post("/reset_password", async (req, res) => {
  const {email, token, password} = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

      if (!user) {
        res.status(400).send({ error: "User not found" });
      }

      if (token !== user.passwordResetToken) {
        return res.status(400).send({ error: "Reset tokens don't match" });
      }

      const now = new Date();
      if (now > user.passwordResetExpires) {
        return res.status(400).send({ error: "Expired token, generate a new one." });
      }
      user.password = password;

      await user.save();

      res.send('Password changed successfully');

  } catch (error) {
    res.status(400).send({ error: "Error resetting password" });
  }
});


module.exports = (app) => app.use("/auth", router);
