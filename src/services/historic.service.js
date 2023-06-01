const InternalServerError = require('../errors/internal-server-error');
const Service = require('./service');

module.exports = class HistoricService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(espId, mantainerId, sectorId, routerId, wifiPotency, atStation) {
        if (!espId) {
            throw new InternalServerError('Historic must have a espId');
        }

        if (!mantainerId) {
            throw new InternalServerError('Historic must have a mantainerId');
        }

        if (!sectorId) {
            throw new InternalServerError('Historic must have a sector');
        }

        return await this.repository.create({
            espId,
            mantainerId,
            sectorId,
            routerId,
            wifiPotency,
            atStation,
        });
    }
};
