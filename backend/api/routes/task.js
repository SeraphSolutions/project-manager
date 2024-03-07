const express = require('express');
const dbManager = require('../functional/databaseManager')
const auth = require('../middleware/tokenAuth')
const router = express.Router();

router.use(express.json());

//#region GET requests

router.get('/:id', auth, (req, res) => {
  dbManager.isAssigned(req.userData.userId, req.params.id).then(isAuthorized=>{
    if(isAuthorized || req.userData.isAdmin){
      dbManager.selectTaskById(req.params.id).then(result => {
        res.json(result);
      });
    }else{
      res.status(401).json({
        message: "Unauthorized access"
    })
    }
  })
})

router.get('/user/', auth, (req, res) => {
    dbManager.selectTaskByUserId(req.params.id).then(result => {
      res.json(result);
    });
})
  
//#endregion
  

module.exports = router;