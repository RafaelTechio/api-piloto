const validator = require('express-validator');

module.exports = [validator.body([`espId`, `mantainerId`, `sectorId`, `atStation`, 'routerId', 'wifiPotency'])];
