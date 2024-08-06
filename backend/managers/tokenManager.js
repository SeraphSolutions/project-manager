const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const { handleError, throwError } = require('../managers/errorManager');
dotenv.config({path:__dirname+'/../.env'})
const key = process.env.JWS_SECRET

function generateToken(username, userId, isAdmin = false) {
    const token = jwt.sign({username, userId, isAdmin}, key, {expiresIn: '2h'});
    return token;
}

const auth = (req, res, next) => {
    try {
        if(!req.headers.authorization){
            throwError(400);
        }
        const token = req.headers.authorization.split('Bearer ')[1];
        const decoded = jwt.verify(token, key);
        req.userData = decoded;
        next()
    } catch (err){
        res.status(403).json("Forbidden.");
    }
};

module.exports = {
    generateToken, auth, 
}