const mongoose = require("mongoose");
// Create connection
mongoose.connect("mongodb://localhost/enterprises");
mongoose.Promise = global.Promise;

module.exports = mongoose;
