const express = require("express");
const Company = require("../models/Company");
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

//* Company registration route
router.post("/sign_up", async (req, res) => {
  try {
    const company = await Company.create(req.body);
    company.password = undefined;
    return res.send({ company, token: tokenGenerator({ id: company.id }) });
  } catch (err) {
    res.status(400).send({
      error: `Email address has already been used, ${err}`,
    });
  }
});

//* Authenticate registration route
router.post("/sign_in", async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email }).select({
      password: +password,
    });

    if (!company) {
      res.status(400).send({ error: "Company not found" });
    } else if (!(await bcrypt.compare(password, company.password))) {
      res
        .status(400)
        .send({ error: "Company email or password does not match" });
    } else {
      let companyData = await Company.findOne(company);
      companyData.password = undefined;
      res.send({ companyData, token: tokenGenerator({ id: companyData.id }) });
    }
  } catch (error) {
    res.status(400).send({ error: "Authentication failed, try again later" });
  }
});

//* Recover Password
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;
  try {
    const company = await Company.findOne({ email });

    if (!company) {
      res.status(400).send({ error: "Company not found" });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await Company.findByIdAndUpdate(company.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpire: now,
      },
    });

    // Send recovery email notification
    mailer.sendMail(
      {
        from: "enterprises-api@email.com",
        to: email,
        subject: "EnterprisesAPI: Password Reset",
        html: `<p>Did you try to reset your password? <br/> If yes, use the following token: <br/>  <b>${token}</b> </p>`,
        context: { token },
      },
      (error) => {
        if (error) {
          return res
            .status(400)
            .send({ error: "Error sending password reset email" });
        }
        return res.send("Email sent");
      }
    );
  } catch (error) {
    res.status(400).send({ error: `Error resetting email ${error}` });
  }
});

//* Reset Password
router.post("/reset_password", async (req, res) => {
  const { email, token, password } = req.body;
  try {
    const company = await Company.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!company) {
      res.status(400).send({ error: "Company not found" });
    }

    if (token !== company.passwordResetToken) {
      return res.status(400).send({ error: "Reset tokens don't match" });
    }

    const now = new Date();
    if (now > company.passwordResetExpires) {
      return res
        .status(400)
        .send({ error: "Expired token, generate a new one." });
    }
    company.password = password;

    await company.save();

    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send({ error: "Error resetting password" });
  }
});

module.exports = (app) => app.use("/auth", router);
