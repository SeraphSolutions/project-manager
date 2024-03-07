const express = require('express');
const dbManager = require('../functional/databaseManager')
const userManager = require('../functional/userManager')
const auth = require('../middleware/tokenAuth')
const router = express.Router();


router.use(express.json());

//#region GET requests

//Get user information.
router.get('/', auth, (req, res) => {
  if(req.userData.isAdmin){
    if(req.query['username']){
      dbManager.selectUserByName(req.query['username']).then(result => res.json(result));
      }
      else if(req.query['userId']){
        dbManager.selectUserById(req.query['userId']).then(result => res.json(result));
      }
      else{
        dbManager.selectUsers().then(result => res.json(result)); 
      }
  }else{
    res.status(401).json({
            message: "Unauthorized access"
        })
  }
})

//#endregion Get requests

//#region POST requests

//Create User
router.post('/register', async (req, res) => {
  //retrieve user data from request
  const { username, password } = req.body;
  //check if user can be created
  const result = await userManager.createUser(username, password);
  res.json(result);
})
//Login User
router.post('/login', async (req, res) => {
  //retrieve user data from request
  const { username, password } = req.body;
  //check if login data exists in db
  var result = await userManager.loginUser(username, password);
  res.json(result)
})

//#endregion POST requests

//#region PUT/PATCH requests

//Change username
router.patch('/change-username', auth, async (req, res) => {
  const { newUsername, password } = req.body;
  const result = await userManager.changeUsername(req.userData.userId, newUsername, password);
  res.json(result);
})

//Change password
router.patch('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await userManager.changePassword(req.userData.userId, newPassword, oldPassword);
  res.json(result);
})



//#endregion

//#region DELETE requests

router.delete('/delete-user', auth, async (req, res) => {
  const {userToDelete, password} = req.body;
  const result = await userManager.deleteUser(req.userData.userId, userToDelete, password);
  res.json(result);
})

//#endregion

module.exports = router;