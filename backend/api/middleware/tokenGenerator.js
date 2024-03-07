const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/../.env'})
const key = process.env.JWS_SECRET



function generateToken(userId, isAdmin = false) {
    const token = jwt.sign({userId, isAdmin}, key, {expiresIn: '2h'});
    return token;
}

module.exports = {
    generateToken, 
}