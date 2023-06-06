const validator = require('express-validator');

module.exports = [validator.body(['router', 'maintainer', 'esp']).notEmpty().escape(), validator.body(['atStation', 'wifiPotency'])];
