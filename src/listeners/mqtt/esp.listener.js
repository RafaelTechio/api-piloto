const MqttConnection = require('../../connections/mqtt.connection');
const MqttMessageHelper = require('../../helpers/mqtt-message.helper');
const espServiceProvider = require('../../providers/esp.provider');
const mainteinerServiceProvider = require('../../providers/maintainer.provider');
const espRouterServiceProvider = require('../../providers/esp-router.provider');
const historicServiceProvider = require('../../providers/historic.provider');

module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    const espService = espServiceProvider();
    const mainteinerService = mainteinerServiceProvider();
    const espRouterService = espRouterServiceProvider();
    const historicService = historicServiceProvider();

    mqttConnection.listenConnect(() => {
        mqttConnection.subscribe(`/+`);
    });

    mqttConnection.listenMessage(async (topic, message) => {
        try {
            const topicMac = topic.split('/').pop();
            const decodedMessage = MqttMessageHelper.decodeMessage(message);

            let esp = await espService.findByMac(topicMac);
            if (!esp) {
                esp = await espService.create(topicMac);
            }

            let espRouter = await espRouterService.findByMac(decodedMessage.BSSID);
            if (!espRouter) {
                espRouter = await espRouterService.create(null, decodedMessage.BSSID);
            }

            if (decodedMessage.RFID) {
                let mainteiner = await mainteinerService.findByRfid(decodedMessage.RFID);
                if (!mainteiner) {
                    mainteiner = await mainteinerService.create(null, decodedMessage.RFID, null);
                }

                await historicService.create(esp.id, mainteiner.id, espRouter.id, decodedMessage.RSSI);
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
