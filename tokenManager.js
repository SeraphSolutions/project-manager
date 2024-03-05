const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()
const key = process.env.JWS_SECRET



function generateToken(userId) {
    const token = jwt.sign({userId}, key, {expiresIn: '2h'});
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, key);
        return decoded;
    } catch (error){
        throw new Error('Invalid token')
    }
}

module.exports = {
    generateToken, verifyToken,
}