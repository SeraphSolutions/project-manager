const dbManager = require('../functional/databaseManager')
const auth = require('../middleware/tokenAuth')

const express = require('express');
const router = express.Router();
router.use(express.json());

//#region GET requests

//Get specific or all tasks
router.get('/', auth, (req, res) => {
    (async function(){
      //Requests specific task
      if(req.query['id']){
        const hasAccess = await dbManager.isAssigned(req.userData.userId, req.query['id']);
        if(hasAccess || req.userData.isAdmin){
          const result = await dbManager.selectTaskById(req.query['id']);
          res.json(result);
        }else{
          res.status(401).json({
            message: "Unauthorized access"
          })
        }
      }

      //Requests ALL tasks
      else{
        if(req.userData.isAdmin){
          const result = await dbManager.selectAllTasks();
          res.json(result);
        }else{
          res.status(401).json({
            message: "Unauthorized access"
          })
        }
      }
    })();
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