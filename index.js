const express = require('express');
const app = express();
const dbManager = require('./databaseManager')
const PORT = 8080;

app.get('/user', (req, res)=>{
  var result = dbManager.getUsers().then(result => {
    res.json(result);
  });
})

app.get('/user/id/:id', (req, res)=>{
  var result = dbManager.getUserById(req.params.id).then(result => {
    res.json(result);
  });
})

app.get('/user/tasks/userId/:id', (req, res)=>{
  var result = dbManager.getTaskByUserId(req.params.id).then(result => {
    res.json(result);
  });
})

app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})