const bcrypt = require('bcrypt');
const dbManager = require('./databaseManager');

const saltRounds = 10;



async function createUser(username, password) {
    try {
        // validate data
        if (!username || !password){
            throw new Error("Invalid input. Please enter username and password");
        }

        //hash password with bcrypt
        const hasedPassword = await bcrypt.hash(passwordq, saltRounds);


        //UPDATE: using correct cols for database
        const result = await dbManager.createUser(username, hasedPassword);


        //return created user
        return result;
    } catch (error) {

        //log error and throw it
        console.error("Error creating user: ", error.message);
        throw error;
    }
    
};


module.exports = {
    createUser,
};
