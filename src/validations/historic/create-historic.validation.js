const validator = require('express-validator');

module.exports = [validator.body(['router', 'mantainer']).notEmpty().escape(), validator.body(['atStation', 'wifiPotency'])];
