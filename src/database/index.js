const mongoose = require('mongoose');
// Criando a conexão
mongoose.connect("mongodb://localhost/enterprises");
mongoose.Promise = global.Promise;


module.exports = mongoose;