const mongoose = require("../../database/index");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
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
  job: {
    type: String,
    require: true,
  },
  department: {
    // Department references
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    require: true,
  },
  assignedTo: {
    // Company references
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    require: true,
  },
  criatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
