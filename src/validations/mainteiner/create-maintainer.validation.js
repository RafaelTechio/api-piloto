const validator = require('express-validator');

module.exports = [validator.body(['name', 'rfid', 'sector']).notEmpty().escape()];
