const jws = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const key = process.env.JWS_SECRET

module.exports = (req, res, next) => {

    //retrieve token from request body
    const {token} = req.body
    try {
        //verify provided token
        const decoded = jws.verify(token, key);
        req.userData = decoded;
        next()
    } catch (error){
        //deal with unauthorized acceses
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
};