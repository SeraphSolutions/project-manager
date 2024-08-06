const requestManager = require('../managers/requestManager');
const { handleError, throwError } = require('../managers/errorManager');
const {auth} = require('../managers/tokenManager')

const express = require('express');
const router = express.Router();
router.use(express.json());

//Create User
router.post('/register', async (req, res) => {
  try{
    const {username, password} = req.body;
    if(!username || !password){
        throwError(400);
    }
    result = await requestManager.createUser(username, password)
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

//Login user
router.get('/login', async (req, res) => {
  try{
    const {username, password} = req.body;
    if(!username || !password){
      throwError(400);
    }
    result = await requestManager.loginUser(username, password)
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Get user
router.get('/:username', auth, async (req, res) => {
  try{
    if(!req.params.username){
      throwError(400)
    }
    result = await requestManager.getUser(req.userData, req.params.username)
    delete result['hashedPassword'];
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Get all users
router.get('/', auth, async (req, res) => {
  try{
    result = await requestManager.getAllUsers(req.userData)
    result = result.forEach(user => {
      delete user['hashedPassword'];
    });
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Assigns User To Task
router.get('/:username/assign/:taskId', auth, async (req, res) => {
  try{
    const {taskId, username} = req.params;
    if(!username || !taskId){
      throwError(400)
    }
    result = await requestManager.assignUserToTask(req.userData, username, taskId);
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})

//Unassign User to task
router.get('/:username/unassign/:taskId', auth, async (req, res) => {
  try{
    const {taskId, username} = req.params;
    if(!username || !taskId){
      throwError(400)
    }
    result = await requestManager.unassignUserToTask(req.userData, username, taskId);
    res.status(200).json(result);
  }catch(err){
      handleError(err);
      res.status(err.statusCode).json(err.message);
    }
})




module.exports = router;