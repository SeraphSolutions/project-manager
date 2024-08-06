const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');

const taskRoutes = require('./routes/task.js');
const userRoutes = require("./routes/user.js");

const app = express();

//Define types
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cross origin requests
app.use(cors({
  origin: 'http://localhost:3000',  // Replace actual frontend domain for production
  credentials: true,
}));

//Routes
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

//Export App for either testing or deployment
module.exports = app;


