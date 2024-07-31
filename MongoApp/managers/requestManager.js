const mongoManager = require("./mongoManager");
const bcrypt = require('bcryptjs');
const { handleError, throwError } = require('../managers/errorManager');
const {generateToken} = require("./tokenManager")

//#region Tokenless functions
async function createUser(username, password){
    const userExists = await mongoManager.getUser(username);
    if(userExists != null){
        throwError(409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    mongoManager.
    addUser(username, hashedPassword);
}
async function loginUser(username, password){
    const user = await mongoManager.getUser(username);
    if(user == null){
        throwError(404);
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    await new Promise(resolve => setTimeout(resolve, 3000));
    if(!passwordMatch){
        throwError(401);
    }
    return(generateToken(user.username, user.isAdmin))
}
//#endregion

//#region Token required functions
async function getUser(token, username){
    if(!token.isAdmin){
        throwError(403)
    }
    const user = await mongoManager.getUser(username);
    if(user == null){
        throwError(404);
    }
    return(user);
}

async function getAllUsers(token){
    if(!token.isAdmin){
        throwError(403)
    }
    const user = await mongoManager.getAllUsers();
    if(user == null){
        throwError(404);
    }
    return(user);
}
//#endregion

module.exports = {createUser, loginUser, getUser, getAllUsers}