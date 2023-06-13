const environmentVars = require('../config/environment.config');
const IaService = require('../services/ia.service');

module.exports = function iaServiceProvider() {
    return new IaService(environmentVars.iaConnection);
};
