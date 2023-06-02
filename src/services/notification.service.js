const InternalServerError = require('../errors/internal-server-error');
const Service = require('./service');

module.exports = class notificationService extends Service {
    constructor(repository) {
        super(repository);
    }

    async create(espId, mantainerId, state, urgency, sectorId, content) {
        if (!espId) {
            throw new InternalServerError('Notification must have a esp_id');
        }

        if (!mantainerId) {
            throw new InternalServerError('Notification must have a mantainerId');
        }

        if (!state) {
            throw new InternalServerError('Notification must have a type');
        }

        if (!urgency) {
            throw new InternalServerError('Notification must have a urgency');
        }

        if (!sectorId) {
            throw new InternalServerError('Notification must have a sector');
        }

        if (!content) {
            throw new InternalServerError('Notification must have a content');
        }

        return await this.repository.create({
            esp: espId,
            maintainer: mantainerId,
            state,
            urgency,
            sector: sectorId,
            content,
        });
    }
};
