const BadRequestError = require('../errors/bad-request.error');
const InternalServerError = require('../errors/internal-server-error');
const espRouterMongoRepository = require('../repositories/esp-router.repository');
const maintainerMongoRepository = require('../repositories/maintainer.repository');
const Service = require('./service');

module.exports = class HistoricService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(espId, maintainerId, routerId, wifiPotency = null, atStation = false) {
        if (!espId) {
            throw new InternalServerError('Historic must have a espId');
        }

        let maintainerSectorId = null;
        if (maintainerId) {
            const maintainer = await maintainerMongoRepository.findById(maintainerId);

            if (!maintainer) {
                throw new BadRequestError("Maintainer doen't exists");
            }

            maintainerId = maintainer.id;

            if (maintainer.sector) {
                maintainerSectorId = maintainer.sector.id;
            }
        }

        let espSectorId = null;
        const router = await espRouterMongoRepository.findById(routerId);
        if (!router) {
            throw new BadRequestError("Router doesn't exists");
        }

        if (router.sector) {
            espSectorId = router.sector.id;
        }

        return await this.repository.create({
            esp: espId,
            espSector: espSectorId,
            maintainer: maintainerId,
            maintainerSector: maintainerSectorId,
            router: routerId,
            wifiPotency,
            atStation,
        });
    }
};
