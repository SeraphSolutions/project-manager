const express = require('express');
const dbManager = require('../functional/databaseManager')
const userManager = require('../functional/userManager')
const auth = require('../middleware/tokenAuth')
const router = express.Router();


router.use(express.json());

//Get user information
router.get('/', auth, (req, res) => {
  if(req.userData.isAdmin){
    if(req.query['username']){
      dbManager.getUserByName(req.query['username']).then(result => res.json(result));
      }
      else if(req.query['userId']){
        dbManager.getUserById(req.query['userId']).then(result => res.json(result));
      }
      else{
        dbManager.getUsers().then(result => res.json(result)); 
      }
  }else{
    res.status(401).json({
            message: "Unauthorized access"
        })
  }
})

router.post('/new_user', async (req, res) => {
  //retrieve user data from request
  const { username, password } = req.body;
  //check if user can be created
  const result = await userManager.createUser(username, password);
  res.json(result);
})

router.post('/login', async (req, res) => {

  //retrieve user data from request
  const { username, password } = req.body;
  //check if login data exists in db
  var result = await userManager.loginUser(username, password);
  res.json(result)
})

module.exports = router;