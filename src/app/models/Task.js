const mongoose = require("../../database/index");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  project: {
    // Project reference
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    require: true,
  },
  assignedTo: {
    // User reference
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  complete: {
      type: Boolean,
      require: true,
      default: false
  },
  criatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
