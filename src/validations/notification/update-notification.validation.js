const validator = require('express-validator');

module.exports = [validator.body(['content', 'category', 'esp', 'maintainer', 'sector', 'state'])];
