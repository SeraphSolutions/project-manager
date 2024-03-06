const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

const userRoutes = require("./api/routes/user")

app.use(express.json());


//enable cors for cross-origin requests
app.use(cors({
  origin: 'http://http://localhost:3000/',  // Replace actual frontend domain for production
  credentials: true,
}));

//endpoint format: app.TYPE(route, auth(optional if protected), arrow func)

//define routes
app.use("/user", userRoutes);


app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})




