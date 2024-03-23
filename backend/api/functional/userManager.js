const bcrypt = require('bcryptjs');
const dbManager = require('./databaseManager.js');
const tokenGen = require('../middleware/tokenGenerator')

const saltRounds = 10;

async function validPassword(userId, password){
    try {
        const user = await dbManager.selectUserById(userId);

        if (!user[0]) {
            throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user[0]["password"]);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return passwordMatch;
        
    }catch(error){
        return false;
    }
        
}

async function createUser(username, password) {
    try {
        // validate data
        if (!username || !password){
            throw new Error("Invalid input. Please enter username and password");
        }

        //check if username already exists
        const user = await dbManager.selectUserByName(username)
        if (user[0]) {
            throw new Error("Username already exists")
        }

        //hash password and insert data into database
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await dbManager.insertUser(username, hashedPassword);

        //return created user
        return result;
    } catch (error) {
        throw error;
    }
    
};

async function loginUser(username, password) {
    try {
        const user = await dbManager.selectUserByName(username);
        const loginResult = await validPassword(user[0].userId, password);
        if(loginResult){
            //generate token
            token = tokenGen.generateToken(user[0].userId, user[0].isAdmin);
            return token;
        }else{
            throw new Error("Invalid credentials");
        }
    } catch(error) {
        //catch unexpected errors      
        return error;
    }
};

async function changeUsername(userId, newUsername, password){
    try{
        if(!userId || !newUsername){throw new Error("Invalid input.")}
        
        //Validate password - So we know it's the user and not someone in his session
        if(validPassword(userId, password)){
            const result = await dbManager.updateUsername(userId, newUsername);
            return result;
        }else{
            throw new Error("Invalid credentials")
        }
    }
    catch(error){
        throw error;
    }
};

async function changePassword(userId, newPassword, oldPassword){
    try{
        if(!userId || !newPassword){throw new Error("Invalid input.")}
        //Validate password - So we know it's the user and not someone in his session
        if(validPassword(userId, oldPassword)){
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            const result = await dbManager.updatePassword(userId, hashedPassword);
            return result;
        }else{
            throw new Error("Invalid credentials")
        }

    }catch(error){
        return error.message;
    }
};

async function wipeUserHistory(userId){
    const userTasks = await dbManager.selectAssignedTasks(userId);
    for(const task of userTasks){
        const rootTask = await dbManager.getRootTask(task.taskId);
        const rootUsers = await dbManager.selectAssignedUser(rootTask.taskId);
        var isOwner = false;
        rootUsers.forEach(user => {
            if(user.userId == userId){
                isOwner = true;
            }
        });
        if(isOwner && rootUsers.length == 1){
            await dbManager.wipeTree(rootTask.taskId);
        }else{
            await dbManager.unassignUser(userId, task.taskId)
        }
    }
}

async function deleteUser(userId, userToDelete, password){
    try{
        const isUser = await validPassword(userId, password);
        if(!isUser){
            throw new Error("Invalid credentials");
        }

        if(userId == userToDelete){
            await wipeUserHistory(userToDelete);
            return await dbManager.deleteUser(userToDelete);
        }else{
            if(dbManager.userIsAdmin(userId)){
                await wipeUserHistory(userToDelete);
                return await dbManager.deleteUser(userToDelete);
            }
            else{
                throw new Error("Not authorized");
            }
        }
    }catch(error){
        return error.message;
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
