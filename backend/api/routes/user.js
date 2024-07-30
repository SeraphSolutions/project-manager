//const dbManager = require('../functional/databaseManager')
const requestValidator = require('../functional/requestValidator');
const { handleError, throwError } = require('../middleware/errorManager');
const auth = require('../middleware/tokenAuth')

const express = require('express');
const router = express.Router();
router.use(express.json());

//#region GET requests

//Get user information.
router.get('/', auth, async (req, res) => {
  try {
    result = await requestValidator.getUserInfo(req.user, undefined);
    res.status(201).json(result);
  }catch(err) {
    res.status(err.statusCode).json(err.message);
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    result = await requestValidator.getUserInfo(req.user, req.params);
    res.status(201).json(result);
  }catch(err) {
    res.status(err.statusCode).json(err.message);
  }
})

router.get('/:username', auth, async (req, res) => {
  try {
    result = await requestValidator.getUserInfo(req.user, req.params);
    res.status(201).json(result);
  }catch(err) {
    res.status(err.statusCode).json(err.message);
  }
})

router.get('/login', auth, async (req, res) => {
  try{  
    const { username, password } = req.headers;
    var result = await requestValidator.loginUser(username, password);
    res.status(200).json(result)
  }
  catch(err){
      console.log(err);
      handleError(err);
      res.status(err.statusCode).json(err.message);
  }
})
//#endregion Get requests

//#region POST requests

//Create User
router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.headers;
    const result = await requestValidator.createUser(username, password);
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

//#endregion POST requests

//#region PATCH requests

router.patch('/change-username', auth, async (req, res) => {
  try{
    const { password, new_username } = req.headers;
    const result = await requestValidator.changeUsername(req.userData.userId, new_username, password);
    res.status(200).json(result);
  }catch(error){
    res.status(error.statusCode).json(error.message)
  }
})

router.patch('/change-password', auth, async (req, res) => {
  try{
    const { old_password, new_password } = req.headers;
    const result = await requestValidator.changePassword(req.userData.userId, new_password, old_password);
    res.status(200).json(result);
  }catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

router.patch('/change-privileges', auth, async (req, res) => {
  try{
    if(!req.user.isAdmin){
      throwError(403);
    }else{
      const { userId, isAdmin } = req.headers;
      //const result = await dbManager.updateAdmin(userId, isAdmin);
      const result = await requestValidator.changePrivileges(userId, isAdmin)
      res.status(200).json(result);
    }
  }catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})


//#endregion

//#region DELETE requests

router.delete('/delete', auth, async (req, res) => {
  const {userToDelete, password} = req.headers;
  const result = await requestValidator.deleteUser(req.userData, userToDelete, password);
  res.json(result);
})

//#endregion

module.exports = router;