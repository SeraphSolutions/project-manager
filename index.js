const express = require('express');
const app = express();
const dbManager = require('./databaseManager')
const usManager = require('./userManager')
const tokenManager = require('./tokenManager')
const PORT = 8080;

app.use(express.json());

app.get('/user', (req, res)=>{
  });
})

app.get('/user/id/:id', (req, res)=>{
  });
})

app.get('/user/tasks/userId/:id', (req, res)=>{
  });
})

app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})

app.post('/user/new_user', async (req, res)=>{
  const {username, password} = req.body;
  console.log(req)
  console.log(username, password)
  const result = await usManager.createUser(username, password);
  res.json(result);
})

app.post('/user/login', async (req, res)=>{
  const {username, password} = req.body;
  var result = usManager.loginUser(username, password);
  var result = await usManager.loginUser(username, password);
  console.log(result)
  res.json(result)
})
