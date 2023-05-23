const mqtt = require('mqtt');
const Connection = require('./connection');
const environmentVars = require('../config/environment.config');

module.exports = class MqttConnection extends Connection {
    constructor(url = environmentVars.MQTT_BROKER_URL) {
        super(null, null, url, null);
    }

    connect() {
        console.log(`Starting connection with broker ${this.ip}...`);
        this.client = mqtt.connect(this.ip);
        this.connected = this.client.connected;

        if (this.connected) {
            console.log(`Connected at (${this.ip}) broker`);
        }
    }

    subscribe(
        topic,
        callback = () => {
            console.log(`Subscribed at ${topic} topic`);
        }
    ) {
        this.client.subscribe(topic, callback);
    }

    unsubscribe(
        topic,
        callback = () => {
            console.log(`Unsubscribed of ${topic} topic`);
        }
    ) {
        this.client.unsubscribe(topic, callback);
    }

    publish(
        topic,
        message,
        options,
        callbackError = (error) => {
            console.log(`Error trying to publish to (${topic}): `, error);
            throw error;
        }
    ) {
        this.client.publish(topic, message, options, callbackError);
    }

    listenConnect(callback) {
        this.client.on('connect', callback);
    }

    listenMessage(
        callback = (topic, payload) => {
            console.log(`Received message of (${topic}) topic:`, payload);
        }
    ) {
        this.client.on('message', callback);
    }

    listenError(callback) {
        this.client.on('error', callback);
    }

    listenDisconnect(callback) {
        this.client.on('disconnect', callback);
    }

    listenEnd(callback) {
        this.client.on('end', callback);
    }

    listenClose(callback) {
        this.client.on('close', callback);
    }

    listenOffline(callback) {
        this.client.on('offline', callback);
    }

    listenOutgoingEmpty(callback) {
        this.client.on('outgoingEmpty', callback);
    }

    listenPacketreceive(callback) {
        this.client.on('packetreceive', callback);
    }

    listenPacketsend(callback) {
        this.client.on('packetsend', callback);
    }

    listenReconnect(callback) {
        this.client.on('reconnect', callback);
    }
};
