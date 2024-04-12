const dbManager = require('../functional/databaseManager')
const userManager = require('../functional/userManager');
const { throwError } = require('../middleware/errorManager');

const auth = require('../middleware/tokenAuth')

const express = require('express');
const router = express.Router();
router.use(express.json());

//#region GET requests

//Get specific or all tasks
router.get('/', auth, async (req, res) => {
  try{
    if(req.query['id']){
      const hasAccess = await dbManager.isAssigned(req.userData.userId, req.query['id']);
      const isAdmin = await userManager.isAdministrator(req.userData);

      if(hasAccess || isAdmin){
        const result = await dbManager.selectTaskById(req.query['id']);
        res.json(result);
      }else{
        throwError(403);
      }
    }else{
      throwError(400);
    }
  }
  catch(err){
    handleError(err);
    res.status(err.statusCode).json(err.message);
  }
})

//Get all tasks (and subtasks) assigned to user
router.get('/user/', auth, (req, res) => {
  (async function(){
    var result = [];
    const rootTasks = await dbManager.selectAssignedTasks(req.query['id']);
    for(task of rootTasks){
      result.push(task);
      const subtasks = await dbManager.selectSubtasks(task.taskId)
      result.push(subtasks);
    }
  res.json(result);
  })();
})

router.get('/create/', auth, (req, res) => {
  (async function(){
    const rootTaskValues={
      taskId:-1,
  
      userId: testUser.userId,
      name: 'ROOT',
      description:'Cool',
      parentTask: null,
      
      priority: 5,
      state:'In Progress',
      deadline: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    

  })();
})



//#endregion
  


module.exports = router;