const requestManager = require('../managers/requestManager');
const { handleError, throwError } = require('../managers/errorManager');
const {auth} = require('../managers/tokenManager')

const express = require('express');
const router = express.Router();
router.use(express.json());

//Create Task
router.post('/create', auth, async (req, res) => {
  try{
    const {title, description, deadline} = req.body;
    if(!title){
        throwError(400);
    }
    result = await requestManager.createTask(req.userData, title, description, deadline);
    res.status(201).json(result);
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})


module.exports = router;