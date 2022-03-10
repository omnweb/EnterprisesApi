const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  register: {
    type: String,
    unique: true,
    max: 14,
    select:false,
  },
  address: {
    cep: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    number: {
      type: Number,
      min: 0,
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  },
  contact: {
    phone: {
      type: Number,
      min: 0,
    },
    telephone: {
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
  },
  active: {
    type: String,
    default: ["ativo", "inativo"],
  },
  criatedAt: {
      type: Date,
      default: Date.now,
  }

});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;