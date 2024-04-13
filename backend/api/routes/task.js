//const dbManager = require('../functional/databaseManager')
const requestValidator = require('../functional/requestValidator');
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
      const hasAccess = await requestValidator.hasAccess(req.userData.userId, req.query['id']);
      const isAdmin = await requestValidator.isAdministrator(req.userData);

      if(hasAccess || isAdmin){
        const result = await requestValidator.selectTasks(req.query['id'], getSubtasks = false);
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
    var result = await requestValidator.selectTasks(req.query['id'], getSubtasks = True);
    
    //getSubtasks es para diferenciar en selectTasks si estamos buscando desde una root o todas,
    //eliminando tener dos funciones distintas para getTaskById y selectRootTask, todas se buscan x id
  
    //const rootTasks = await userManager.selectTasks(req.query['id']);
    /*for(task of rootTasks){
      result.push(task);
      const subtasks = await dbManager.selectSubtasks(task.taskId)
      result.push(subtasks);
    }*/
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