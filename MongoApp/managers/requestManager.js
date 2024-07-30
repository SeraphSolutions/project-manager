const mongoManager = require("mongoManager");
const { handleError, throwError } = require('../managers/errorManager');

async function createUser(username, password){
    mongoManager.addUser(username, password);
}