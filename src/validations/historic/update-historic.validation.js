const validator = require('express-validator');

module.exports = [
    validator.body(['router', 'maintainer', 'esp', 'espSector', 'maintainerSector']).optional().isMongoId(),
    validator.body(['atStation']).optional().isBoolean(),
    validator.body(['wifiPotency']).optional().isNumeric(),
];
