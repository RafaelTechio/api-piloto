const InternalServerError = require('../errors/internal-server-error');
const Service = require('./service');

module.exports = class notificationService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(content, category, espId, maintainerId, sectorId) {
        if (!content) {
            throw new InternalServerError('Notification must have a content');
        }

        console.log({
            esp: espId,
            maintainer: maintainerId,
            sector: sectorId,
            category,
            content,
        });
        return await this.repository.create({
            esp: espId,
            maintainer: maintainerId,
            sector: sectorId,
            category,
            content,
        });
    }
};
