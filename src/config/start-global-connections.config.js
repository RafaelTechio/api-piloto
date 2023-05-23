const MongoConnection = require('../connections/mongo.connection');
const MqttConnection = require('../connections/mqtt.connection');
const listener = require('../listeners/mqtt/listener');
const environmentVars = require('./environment.config');

module.exports = function startGlobalConnections() {
    if (environmentVars.MONGO_DB_USER && environmentVars.MONGO_DB_PASS && environmentVars.MONGO_DB_ADDRESS && environmentVars.MONGO_DB_DATABASE) {
        const mongoConnection = new MongoConnection(environmentVars.MONGO_DB_USER, environmentVars.MONGO_DB_PASS, environmentVars.MONGO_DB_ADDRESS, environmentVars.MONGO_DB_DATABASE);
        mongoConnection.connect();
    }

    if (environmentVars.MQTT_BROKER_URL) {
        const mqttConnection = new MqttConnection(environmentVars.MQTT_BROKER_URL);
        mqttConnection.connect();
        listener(mqttConnection);
    }
};
