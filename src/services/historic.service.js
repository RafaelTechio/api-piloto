const InternalServerError = require('../errors/internal-server-error');
const Service = require('./service');

module.exports = class HistoricService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(esp_id, mantainer_id, date, sector, at_station) {
        if (!esp_id) {
            throw new InternalServerError('Historic must have a esp_id');
        }

        if (!mantainer_id) {
            throw new InternalServerError('Historic must have a mantainer_id');
        }

        if (!date) {
            throw new InternalServerError('Historic must have a date');
        }

        if (!sector) {
            throw new InternalServerError('Historic must have a sector');
        }

        if (!at_station) {
            throw new InternalServerError('Historic have at_station declaration');
        }

        return await this.repository.create({
            esp_id,
            mantainer_id,
            date,
            sector,
            at_station,
        });
    }
};
