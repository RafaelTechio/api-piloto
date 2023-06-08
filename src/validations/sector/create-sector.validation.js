const validator = require('express-validator');

module.exports = [validator.body('name').notEmpty().isString().escape()];
