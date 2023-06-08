const MqttConnection = require('../../connections/mqtt.connection');
const MqttMessageHelper = require('../../helpers/mqtt-message.helper');
const espServiceProvider = require('../../providers/esp.provider');
const maintainerServiceProvider = require('../../providers/maintainer.provider');
const espRouterServiceProvider = require('../../providers/esp-router.provider');
const historicServiceProvider = require('../../providers/historic.provider');
const notificationServiceProvider = require('../../providers/notification.provider');

module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    const espService = espServiceProvider();
    const maintainerService = maintainerServiceProvider();
    const espRouterService = espRouterServiceProvider();
    const historicService = historicServiceProvider();
    const notificationService = notificationServiceProvider();

    mqttConnection.listenConnect(() => {
        mqttConnection.subscribe(`/+`);
    });

    mqttConnection.listenMessage(async (topic, message) => {
        try {
            const topicMac = topic.split('/').pop();
            const decodedMessage = MqttMessageHelper.decodeMessage(message);
            console.log(`Message arrived from ${topicMac}`);

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
            notificationService.createEspMaintainerNotification(esp, lastHistoric ? lastHistoric.maintainer : null, maintainer);
            notificationService.createEspSectorNotification(esp, lastHistoric ? lastHistoric.sector : null, espRouter.sector);

            await historicService.create(esp.id, maintainerId, espRouter.id, decodedMessage.RSSI);
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
