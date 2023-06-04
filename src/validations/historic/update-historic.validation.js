const validator = require('express-validator');

module.exports = [validator.body([`esp`, `mantainer`, `atStation`, 'router', 'wifiPotency'])];
