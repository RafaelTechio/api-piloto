const MqttConnection = require('../../connections/mqtt.connection');
const MqttMessageHelper = require('../../helpers/mqtt-message.helper');
const espServiceProvider = require('../../providers/esp.provider');
const maintainerServiceProvider = require('../../providers/maintainer.provider');
const espRouterServiceProvider = require('../../providers/esp-router.provider');
const historicServiceProvider = require('../../providers/historic.provider');
const notificationServiceProvider = require('../../providers/notification.provider');

module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    mqttConnection.listenConnect(() => {
        mqttConnection.subscribe(`/#`);
    });

    mqttConnection.listenMessage(async (topic, message) => {
        const topicArray = topic.split('/');
        const topicLastPart = topicArray.pop();
        console.log(`Message arrived from ${topic}`);
        try {
            if (String(topicLastPart).toLowerCase() == 'lastwill') {
                await lastWillHistoric(topic, message);
            } else {
                await normalHistoric(topic, message);
            }
        } catch (error) {
            console.log(error);
        }
    });

    mqttConnection.listenClose();
    mqttConnection.listenDisconnect();
    mqttConnection.listenEnd();
    mqttConnection.listenError();
    mqttConnection.listenOffline();
    mqttConnection.listenOutgoingEmpty();
    mqttConnection.listenReconnect();
};

async function lastWillHistoric(topic, message) {
    const espService = espServiceProvider();
    const historicService = historicServiceProvider();
    const notificationService = notificationServiceProvider();

    const topicArray = topic.split('/');
    const lastWill = topicArray.pop();
    const topicMac = topicArray.pop();

    const esp = await espService.findByMac(topicMac);
    if (esp) {
        const lastHistoric = await historicService.findLast({ esp: esp.id });

        const maintainerId = lastHistoric.maintainer ? lastHistoric.maintainer.id : lastHistoric.maintainer;
        const routerId = lastHistoric.router ? lastHistoric.router.id : lastHistoric.router;

        await historicService.create(esp.id, maintainerId, routerId, lastHistoric.wifiPotency, false, lastHistoric.atStation);
        await notificationService.create(`Localizador de tablet de MAC: ${esp.mac} foi desconectado`, 'esp', esp.id);
    }
}

async function normalHistoric(topic, message) {
    const espService = espServiceProvider();
    const maintainerService = maintainerServiceProvider();
    const espRouterService = espRouterServiceProvider();
    const historicService = historicServiceProvider();
    const notificationService = notificationServiceProvider();

    const topicMac = topic.split('/').pop();
    const decodedMessage = MqttMessageHelper.decodeMessage(message);

    let esp = await espService.findByMac(topicMac);
    if (!esp) {
        console.log(`Created empty esp`);
        esp = await espService.create(topicMac);
        notificationService.create(`Um novo localizador de tablet foi registrado automaticamente com o endereço MAC: ${topicMac}`, 'esp', esp.id);
    }

    let espRouter = await espRouterService.findByMac(decodedMessage.BSSID);
    if (!espRouter) {
        console.log(`Created empty router`);
        espRouter = await espRouterService.create(null, decodedMessage.BSSID);
        notificationService.create(`Um novo roteador foi registrado automaticamente com o endereço MAC: ${decodedMessage.BSSID}`, 'router', esp.id, null, null, espRouter.id);
    }

    let maintainerId = null;
    let maintainer = null;
    if (decodedMessage.RFID) {
        maintainer = await maintainerService.findByRfid(decodedMessage.RFID);
        if (!maintainer) {
            console.log(`Created empty maintainer`);
            maintainer = await maintainerService.create(null, decodedMessage.RFID, null);
            notificationService.create(`Um novo colaborador foi registrado automaticamente com o RFID: ${decodedMessage.RFID}`, 'maintainer', esp.id, maintainer.id);
        }
        maintainerId = maintainer.id;
    }

    const lastHistoric = await historicService.findLast({ esp: esp.id });
    if (lastHistoric && !lastHistoric.online) {
        await notificationService.create(`Localizador de tablet de MAC: ${esp.mac} foi reconectado`, 'esp', esp.id);
    }
    notificationService.createEspMaintainerNotification(esp, lastHistoric ? lastHistoric.maintainer : null, maintainer);
    notificationService.createEspSectorNotification(esp, lastHistoric ? lastHistoric.sector : null, espRouter.sector);

    const connections = await Promise.all(
        (decodedMessage.connections || []).map(async (connection) => {
            let connectionEspRouter = await espRouterService.findByMac(connection.BSSID);
            if (!connectionEspRouter) {
                console.log(`Created empty router`);
                connectionEspRouter = await espRouterService.create(null, connection.BSSID);
                notificationService.create(`Um novo roteador foi registrado automaticamente com o endereço MAC: ${connection.BSSID}`, 'router', esp.id, null, null, connectionEspRouter.id);
            }

            return {
                router: connectionEspRouter.id,
                wifiPotency: connection.RSSI,
            };
        })
    );

    await historicService.create(esp.id, maintainerId, espRouter.id, decodedMessage.RSSI, connections);
}
