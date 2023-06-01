const Service = require('./service');
const InternalServerError = require('../errors/internal-server-error');

module.exports = class MaintainerService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(name, rfid, sectorId) {
        if (!name) {
            throw new InternalServerError('maintainer must have a name');
        }

        if (!rfid) {
            throw new InternalServerError('maintainer must have a rfid');
        }

        if (!sectorId) {
            throw new InternalServerError('maintainer must have a sector');
        }

        return await this.repository.create({
            name,
            rfid,
            sectorId,
        });
    }
};
