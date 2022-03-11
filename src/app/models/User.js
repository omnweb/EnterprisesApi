const mongoose = require("../../database/index");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
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
  passwordResetToken: {
    type: String,
    select:false
  },
  passwordResetExpire: {
    type: Date,
    select:false
  },
  status: {
    type: String,
    default: ["user", "admin"],
  },
  criatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Antes de salvar encripta a senha
UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
