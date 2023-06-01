const validator = require('express-validator');

module.exports = [validator.body(['name', 'rfid', 'sectorId']).notEmpty().escape()];
