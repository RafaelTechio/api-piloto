const validator = require('express-validator');

module.exports = [validator.body([`esp`, `maintainer`, `atStation`, 'router', 'wifiPotency'])];
