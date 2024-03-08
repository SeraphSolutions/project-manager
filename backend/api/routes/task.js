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
      if(req.query['taskId']){
        const hasAccess = await dbManager.isAssigned(req.userData.userId, req.query['taskId']);
        if(hasAccess || req.userData.isAdmin){
          const result = await dbManager.selectTaskById(req.query['taskId']);
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
  var result = [];
    dbManager.selectTaskByUserId(req.params.id).then(result => {
      result.forEach(task =>{
        result.push(task);
        result.push(dbManager.selectSubtasks(task.taskId));
      })
    });
  res.json(result);
})




//#endregion
  


module.exports = router;