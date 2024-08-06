const app = require('./App'); 
const PORT = 8080;

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
      console.log("Server listening on Port", PORT);
  })