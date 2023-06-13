const IaConnection = require('../connections/ia.connection');
const historicProvider = require('../providers/historic.provider');

module.exports = class IaService {
    constructor(connection = new IaConnection()) {
        this.connection = connection;
    }

    async trainIa() {
        const historics = await historicProvider().list({ verified: true });
        const normalizedHistorics = historics.map((historic) => {
            const connections = historic.connections.map((connection) => {
                return {
                    router: connection.router.mac,
                    wifiPotency: connection.wifiPotency,
                };
            });

            connections.push({
                router: historic.router.mac,
                wifiPotency: historic.wifiPotency,
            });

            return {
                sector: historic.espSector.name,
                connections,
            };
        });

        this.connection.postTrain(normalizedHistorics);
    }

    async predict(historics = []) {
        const normalizedHistorics = historics.map((historic) => {
            const connections = historic.connections.map((connection) => {
                return {
                    router: connection.router.mac,
                    wifiPotency: connection.wifiPotency,
                };
            });

            connections.push({
                router: historic.router.mac,
                wifiPotency: historic.wifiPotency,
            });

            return connections;
        });

        return this.connection.postPredict(normalizedHistorics);
    }
};
