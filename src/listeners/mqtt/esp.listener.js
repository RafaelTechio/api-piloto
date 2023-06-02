const MqttConnection = require('../../connections/mqtt.connection');
const MqttMessageHelper = require('../../helpers/mqtt-message.helper');
const espServiceProvider = require('../../providers/esp.provider');
const mainteinerServiceProvider = require('../../providers/maintainer.provider');
const sectorServiceProvider = require('../../providers/sector.provider');
const espRouterServiceProvider = require('../../providers/esp-router.provider');
const historicServiceProvider = require('../../providers/historic.provider');

module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    const espService = espServiceProvider();
    const mainteinerService = mainteinerServiceProvider();
    const espRouterService = espRouterServiceProvider();
    const sectorService = sectorServiceProvider();
    const historicService = historicServiceProvider();

    mqttConnection.listenConnect(() => {
        mqttConnection.subscribe(`/+`);
    });

    mqttConnection.listenMessage(async (topic, message) => {
        try {
            const topicMac = topic.split('/').pop();
            const decodedMessage = MqttMessageHelper.decodeMessage(message);

            const esp = await espService.findByMac(topicMac);

            if (decodedMessage.RFID) {
                const mainteiner = await mainteinerService.findByRfid(decodedMessage.RFID);

                if (mainteiner) {
                    console.log('BSSID', decodedMessage.BSSID);
                    const espRouter = await espRouterService.findByMac(decodedMessage.BSSID);
                    if (espRouter) {
                        await historicService.create(esp.id, mainteiner.id, espRouter.id);
                    } else {
                        console.log('Não tem router');
                    }
                } else {
                    console.log('Não tem Manutentor', decodedMessage.RFID);
                }
                // await historicService.create(esp.id, mainteiner.id, espRouter.id);
            } else {
                console.log('Não tem RFID');
            }
        } catch (error) {
            console.log(error);
        }
    });
};
