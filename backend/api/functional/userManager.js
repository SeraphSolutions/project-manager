const bcrypt = require('bcryptjs');
const dbManager = require('./databaseManager');
const tokenGen = require('../middleware/tokenGenerator')

const saltRounds = 10;



async function createUser(username, password) {
    try {

        // validate data
        if (!username || !password){
            throw new Error("Invalid input. Please enter username and password");
        }


        //check if username already exists
        const user = await dbManager.getUserByName(username)

        if (user[0]) {
            throw new Error("Username already exists")
        }

        //hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        //UPDATE: using correct cols for database
        const result = await dbManager.newUser(username, hashedPassword);


        //return created user
        return result;
    } catch (error) {

        //log error and throw it
        console.error("Error creating user: ", error.message);
        throw error;
    }
    
};

async function loginUser(username, password) {
    try {

        //validate data
        if (!username || !password) {
            throw new Error("Invalid input. Please enter username and password");
        }


        //retrieve user data
        const user = await dbManager.getUserByName(username);

        //check that user exists
        if (!user[0]) {
            throw new Error("User not found");
        }

        
        //compare password against hash
        const passwordMatch = await bcrypt.compare(password, user[0]["password"]);

        //solve for incorrect password
        if (!passwordMatch) {
            //set a time out of 3s to prevent brute forcing
            await new Promise(resolve => setTimeout(resolve, 3000));
            throw new Error("Incorrect password");
        }
        
        //generate token
        token = tokenGen.generateToken(user[0].userId, user[0].isAdmin);

        return token;
    } catch(error) {
        //catch unexpected errors

        if (error.message === "Incorrect password") {
            const unauthorizedError = new Error("Unauthorized");
            unauthorizedError.status = 401;
            throw unauthorizedError;
        }

        
        console.error("Error in login. ", error.message);
        throw error;
    }
};


module.exports = {
    createUser,
    loginUser,
};