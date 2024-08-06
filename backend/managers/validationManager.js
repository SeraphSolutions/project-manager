const { throwError } = require('../managers/errorManager');
const { body, param, validationResult } = require('express-validator');

const validateBodyUsername = [
    body('username')
        .exists()
        .isString()
        .notEmpty(),
];

const validateBodyPassword = [
    body('password')
        .exists()
        .isString()
        .notEmpty(),
];

const validateParameterUsername = [
    param('username')
        .exists()
        .isString()
        .notEmpty(),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwError(400);
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateBodyUsername,
    validateBodyPassword,
    validateParameterUsername,
    handleValidationErrors
};