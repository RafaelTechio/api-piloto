const validator = require('express-validator');

module.exports = [validator.body(['esp', 'state', 'urgency', 'content']).notEmpty().escape(), validator.body(['manteiner', 'sector']).escape()];
