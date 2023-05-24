const validator = require('express-validator');

module.exports = [validator.body([`esp_id`, `mantainer_id`, `date`, `sector`, `at_station`])];