const validator = require('express-validator');

module.exports = [validator.body([`espId`, `mantainerId`, `atStation`, 'routerId', 'wifiPotency'])];
