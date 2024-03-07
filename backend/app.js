const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const PORT = 8080;

const userRoutes = require("./api/routes/user");
const taskRoutes = require('./api/routes/task');

app.use(express.json());


//enable cors for cross-origin requests
app.use(cors({
  origin: 'http://localhost:3000',  // Replace actual frontend domain for production
  credentials: true,
}));

//To read data from request body
app.use(bodyParser.urlencoded({
  extended: true
}));

//endpoint format: app.TYPE(route, auth(optional if protected), arrow func)

//define routes
app.use("/user", userRoutes);
app.use("/task", taskRoutes);


app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})




