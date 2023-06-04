const MqttConnection = require('../../connections/mqtt.connection');
const MqttMessageHelper = require('../../helpers/mqtt-message.helper');
const espServiceProvider = require('../../providers/esp.provider');
const maintainerServiceProvider = require('../../providers/maintainer.provider');
const espRouterServiceProvider = require('../../providers/esp-router.provider');
const historicServiceProvider = require('../../providers/historic.provider');

module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    const espService = espServiceProvider();
    const maintainerService = maintainerServiceProvider();
    const espRouterService = espRouterServiceProvider();
    const historicService = historicServiceProvider();

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
            }

            let espRouter = await espRouterService.findByMac(decodedMessage.BSSID);
            if (!espRouter) {
                console.log(`Created empty router`);
                espRouter = await espRouterService.create(null, decodedMessage.BSSID);
            }

            let maintainerId = null;
            if (decodedMessage.RFID) {
                let maintainer = await maintainerService.findByRfid(decodedMessage.RFID);
                if (!maintainer) {
                    console.log(`Created empty maintainer`);
                    maintainer = await maintainerService.create(null, decodedMessage.RFID, null);
                }
                maintainerId = maintainer.id;
            }

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
