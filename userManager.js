const bcrypt = require('bcrypt');
const dbManager = require('./databaseManager');
const tokenManager = require('./tokenManager')

const saltRounds = 10;



async function createUser(username, password) {
    try {

        console.log(username, password)
        // validate data
        if (!username || !password){
            throw new Error("Invalid input. Please enter username and password");
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

        if (!username || !password) {
            throw new Error("Invalid input. Please enter username and password");
        }

        const user = await dbManager.getUserId(username);

        if (!user) {
            throw new Error("User not found");
        }

        

        const passwordMatch = await bcrypt.compare(password, user[0]["password"]);

        if (!passwordMatch) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            throw new Error("Incorrect password");
        }


        token = tokenManager.generateToken(user[0].userId);

        return token;
    } catch(error) {

        console.error("Error in login. ", error.message);
        throw error;
    }
};


module.exports = {
    createUser,
    loginUser,
};
