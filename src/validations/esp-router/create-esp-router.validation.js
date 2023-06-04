const validator = require('express-validator');

module.exports = [validator.body('mac').notEmpty().escape(), validator.body('sector').notEmpty().escape()];
