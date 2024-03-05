const express = require('express');
const app = express();
const PORT = 8080;

const userRoutes = require("./api/routes/user")

app.use(express.json());

//endpoint format: app.TYPE(route, auth(optional if protected), arrow func)



app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})


app.use("/user", userRoutes)

