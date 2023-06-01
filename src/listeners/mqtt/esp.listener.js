const MqttConnection = require('../../connections/mqtt.connection');
const espServiceProvider = require('../../providers/esp.provider');
module.exports = async function espListener(mqttConnection = new MqttConnection()) {
    const espService = espServiceProvider();
    const esps = await espService.list();

    mqttConnection.listenConnect(() => {
        mqttConnection.subscribe(`/+`);
    });

    mqttConnection.listenMessage();
};
