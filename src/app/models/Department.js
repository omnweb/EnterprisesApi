const mongoose = require("../../database/index");

const DepartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  // Company references
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    require: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  criatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;
