const MqttConnection = require('../../connections/mqtt.connection');

module.exports = function espListener(mqttConnection = new MqttConnection()) {
    const esps = [{ mac: '42342' }];

    mqttConnection.listenConnect(() => {
        esps.map((esp) => {
            mqttConnection.subscribe(`/esp/${esp.mac}`);
        });
    });

    esps.map((esp) => {
        mqttConnection.listenMessage((topic, payload) => {});
    });
};
