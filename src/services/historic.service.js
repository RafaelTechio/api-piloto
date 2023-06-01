const InternalServerError = require('../errors/internal-server-error');
const espRouterMongoRepository = require('../repositories/esp-router.repository');
const maintainerMongoRepository = require('../repositories/maintainer.repository');
const sectorMongoRepository = require('../repositories/sector.repository');
const Service = require('./service');

module.exports = class HistoricService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(espId, maintainerId, routerId, wifiPotency = null, atStation = false) {
        if (!espId) {
            throw new InternalServerError('Historic must have a espId');
        }

        if (!maintainerId) {
            throw new InternalServerError('Historic must have a maintainerId');
        }

        const maintainer = await maintainerMongoRepository.findById(maintainerId);
        const sectorMaintainer = await sectorMongoRepository.findById(maintainer.sectorId);

        const router = await espRouterMongoRepository.findById(routerId);
        const sectorRouterId = await sectorMongoRepository.findById(router.sectorId);

        return await this.repository.create({
            espId,
            sectorEspId: sectorRouterId,
            maintainerId,
            sectorMaintainerId: sectorMaintainer.id,
            routerId,
            wifiPotency,
            atStation,
        });
    }
};
