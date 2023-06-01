const validator = require('express-validator');

module.exports = [validator.body(['routerId', 'mantainerId']).notEmpty().escape(), validator.body(['atStation', 'wifiPotency'])];
