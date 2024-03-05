const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()
const key = process.env.JWS_SECRET



function generateToken(userId) {
    const token = jwt.sign({userId}, key, {expiresIn: '2h'});
    return token;
}

module.exports = {
    generateToken, 
}