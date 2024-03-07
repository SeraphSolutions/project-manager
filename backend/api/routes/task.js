const express = require('express');
const dbManager = require('../functional/databaseManager')
const auth = require('../middleware/tokenAuth')
const router = express.Router();

router.use(express.json());

router.get('/tasks/userId/:id', auth, (req, res) => {
    var result = dbManager.selectTaskByUserId(req.params.id).then(result => {
      res.json(result);
    });
  })
  

module.exports = router;