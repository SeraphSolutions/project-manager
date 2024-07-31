const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const PORT = 8080;

const taskRoutes = require('./routes/task.js');
const userRoutes = require("./routes/user.js");

const app = express();
app.use(express.json());


//enable cors for cross-origin requests
app.use(cors({
  origin: 'http://localhost:3000',  // Replace actual frontend domain for production
  credentials: true,
}));

//To read data from request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//endpoint format: app.TYPE(route, auth(optional if protected), arrow func)

//define routes
// app.use("/task", taskRoutes);
app.use("/user", userRoutes);


app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})




