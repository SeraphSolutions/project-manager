const { throwError } = require('../managers/errorManager');
const { body, validationResult } = require('express-validator');

const validateUsername = [
    body('username')
        .exists()
        .isString()
        .notEmpty(),
];

const validatePassword = [
    body('password')
        .exists()
        .isString()
        .notEmpty(),
];



const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError(400);
    }
    next();
};

module.exports = {
    validateUsername,
    validatePassword,
    handleValidationErrors
};