const mongoose = require("../../database/index");
const bcrypt = require("bcryptjs");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  cnpj: {
    type: String,
    require: true,
    index: {
      unique: true,
    },
    max: 18,
    min: 18,
  },
  address: {
    cep: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "",
      required: true,
    },
    district: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
      required: true,
    },
    number: {
      type: Number,
      min: 0,
    },
    state: {
      type: String,
      default: "",
      required: true,
    },
  },
  contact: {
    phone: {
      type: Number,
      min: 0,
      required: true,
    },
    whatsapp: {
      type: Number,
      min: 0,
    },
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    default: "",
    required: true,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpire: {
    type: Date,
    select: false,
  },
  criatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Before saving encrypt the password
CompanySchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});
const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
