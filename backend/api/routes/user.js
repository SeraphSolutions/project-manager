const express = require('express');
const dbManager = require('../functional/databaseManager')
const usManager = require('../functional/userManager')
const auth = require('../middleware/tokenAuth')
const router = express.Router();


router.use(express.json());

router.get('/', auth, (req, res) => {
  var result = dbManager.getUsers().then(result => {
    res.json(result);
  });
})

router.get('/id/:id', auth, (req, res) => {
  var result = dbManager.getUserById(req.params.id).then(result => {
    res.json(result);
  });
})

router.get('//tasks/userId/:id', auth, (req, res) => {
  var result = dbManager.getTaskByUserId(req.params.id).then(result => {
    res.json(result);
  });
})



router.get('/id/:id', auth, (req, res) => {
  var result = dbManager.getUserById(req.params.id).then(result => {
    res.json(result);
  });
})

router.get('/tasks/userId/:id', auth, (req, res) => {
  var result = dbManager.getTaskByUserId(req.params.id).then(result => {
    res.json(result);
  });
})

router.post('/new_user', async (req, res) => {
  //retrieve user data from request
  const { username, password } = req.body;
  //check if user can be created
  const result = await usManager.createUser(username, password);
  //resolve
  res.json(result);
})

router.post('/login', async (req, res) => {

  //retrieve user data from request
  const { username, password } = req.body;
  //check if login data exists in db
  var result = await usManager.loginUser(username, password);
  //resolve
  res.json(result)
})

module.exports = router;