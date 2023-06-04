const validator = require('express-validator');

module.exports = [validator.body(['content']).notEmpty().escape(), validator.body(['maintainer', 'sector', 'esp', 'category'])];
