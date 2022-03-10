const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Para interpretar requisições em json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/AuthController')(app);
require('./controllers/ProjectController')(app);


app.listen(3000);