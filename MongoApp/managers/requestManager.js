const mongoManager = require("./mongoManager");
const bcrypt = require('bcryptjs');
const { handleError, throwError } = require('../managers/errorManager');

async function createUser(username, password){
    const userExists = await mongoManager.getUser(username);
    if(userExists != null){
        throwError(409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    mongoManager.addUser(username, hashedPassword);
}

module.exports = {createUser}