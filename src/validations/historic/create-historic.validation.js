const validator = require('express-validator');

module.exports = [
    validator.body(['esp', 'router']).notEmpty().isMongoId(),
    validator.body(['maintainer']).optional().isMongoId(),
    validator.body(['atStation']).optional().isBoolean(),
    validator.body(['wifiPotency']).optional().isNumeric(),
];
