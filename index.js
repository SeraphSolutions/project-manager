const express = require('express');
const app = express();
const dbManager = require('./databaseManager')
const usManager = require('./userManager')
const auth = require('./middleware/tokenAuth')
const PORT = 8080;

app.use(express.json());

//endpoint format: app.TYPE(route, auth(optional if protected), arrow func)

app.get('/user', auth, (req, res)=>{
  var result = dbManager.getUsers().then(result => {
    res.json(result);
  });
})

app.get('/user/id/:id', auth, (req, res)=>{
  var result = dbManager.getUserById(req.params.id).then(result => {
    res.json(result);
  });
})

app.get('/user/tasks/userId/:id', auth, (req, res)=>{
  var result = dbManager.getTaskByUserId(req.params.id).then(result => {
    res.json(result);
  });
})

app.listen(PORT, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})

app.post('/user/new_user', async (req, res)=>{
  //retrieve user data from request
  const {username, password} = req.body;
  //check if user can be created
  const result = await usManager.createUser(username, password);
  //resolve
  res.json(result);
})

app.post('/user/login', async (req, res)=>{

  //retrieve user data from request
  const {username, password} = req.body;
  //check if login data exists in db
  var result = await usManager.loginUser(username, password);
  //resolve
  res.json(result)
})
