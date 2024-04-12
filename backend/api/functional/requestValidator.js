const bcrypt = require('bcryptjs');
const dbManager = require('./databaseManager.js');
const tokenGen = require('../middleware/tokenGenerator.js')
const { throwError } = require('../middleware/errorManager.js');

const saltRounds = 10;


async function isAdministrator(userData){
    if(userData.isAdmin){
        const doubleCheck = await dbManager.userIsAdministrator(userData.userId);
        if(doubleCheck){
            return true;
        }
    }
    return false;
}
async function validPassword(userId, password){
    try {
        const user = await dbManager.selectUserById(userId);
        if (!user[0]) {
            throwError(404);
        }

        const passwordMatch = await bcrypt.compare(password, user[0]["password"]);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return passwordMatch;
        
    }catch(error){
        return false;
    }
        
}
async function createUser(username, password) {
    // validate data
    if (!username || !password){
        throwError(400);
    }
    
    //hash password and insert data into database
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await dbManager.insertUser(username, hashedPassword);

    //return created user
    const reply = await dbManager.selectUserById(result.insertId); 
    delete reply.password;   
    return reply;
};
async function loginUser(username, password) {
    const user = await dbManager.selectUserByName(username);
    const loginResult = await validPassword(user[0].userId, password);
    if(loginResult){
        const key = tokenGen.generateToken(user[0].userId, user[0].isAdmin);
        const reply = {
            authorization: 'Bearer '+ key
        }
        return reply;
    }else{
        throwError(401);
    }
};
async function changeUsername(userId, newUsername, password){
    if(userId == null || newUsername == null || password == null){
        throwError(400);
    }
    //Validate password - So we know it's the user and not someone in his session
    let isAuth = await validPassword(userId, password);
    if(isAuth){
        const result = await dbManager.updateUsername(userId, newUsername);
        const reply = await dbManager.selectUserById(userId);
        delete reply.password;
        return reply;
    }else{
        throwError(403);
    }
};
async function changePassword(userId, newPassword, oldPassword){
    if(!userId || !newPassword){
        throwError(400);
    }

    const isAuth = await validPassword(userId, oldPassword);
    if(isAuth){
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await dbManager.updatePassword(userId, hashedPassword);
        const reply = await dbManager.selectUserById(userId);
        delete reply.password;
        return reply;
    }else{
        throwError(403);
    }
};
async function wipeUserHistory(userId){
    const userTasks = await dbManager.selectAssignedTasks(userId);
    for(const task of userTasks){
        const rootTask = await dbManager.getRootTask(task.taskId);
        const rootUsers = await dbManager.selectAssignedUser(rootTask[0].taskId);
        var isOwner = false;
        rootUsers.forEach(user => {
            if(user.userId == userId){
                isOwner = true;
            }
        });
        if(isOwner && rootUsers.length == 1){
            await dbManager.wipeTree(rootTask[0].taskId);
        }else{
            await dbManager.unassignUser(userId, task.taskId)
        }
    }
}
async function deleteUser(user, userToDelete, password){
    const adminCheck = await dbManager.userIsAdmin(user.userId)
    if(user.userId == userToDelete || adminCheck){
        const isAuth = await validPassword(user.userId, password);
        if(!isAuth){ throwError(401) }
        await wipeUserHistory(userToDelete);
        const result = await dbManager.deleteUser(userToDelete);
        return result.affectedRows;
    }else{
        throwError(403);
    }
}
module.exports = {
    createUser,
    loginUser,
    changeUsername,
    changePassword,
    validPassword,
    deleteUser,
    wipeUserHistory
};
