const validator = require('express-validator');

module.exports = [validator.body(['espId', 'mantainerId', 'sectorId']).notEmpty().escape(), validator.body(['atStation', 'routerId', 'wifiPotency'])];
