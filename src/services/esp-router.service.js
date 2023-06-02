const InternalServerError = require('../errors/internal-server-error');
const Service = require('./service');

module.exports = class EspRouterService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(sectorId, mac) {
        if (sectorId === undefined) {
            throw InternalServerError('EspRouter must have a sectorId');
        }

        if (!mac) {
            throw InternalServerError('EspRouter must have a mac');
        }

        return await this.repository.create({ sector: sectorId, mac });
    }

    async findById(id) {
        return await this.find({ _id: id });
    }

    async findByMac(mac) {
        return await this.find({ mac });
    }
};
