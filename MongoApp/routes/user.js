const requestManager = require('../managers/requestManager');
const { handleError, throwError } = require('../managers/errorManager');
const auth = require('../managers/tokenManager')

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


module.exports = router;