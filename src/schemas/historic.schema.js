const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema(
    {
        espId: {
            type: String,
            required: true,
        },
        sectorEspId: {
            type: String,
            default: null,
        },
        maintainerId: {
            type: String,
            default: null,
        },
        sectorMaintainerId: {
            type: String,
            default: null,
        },
        routerId: String,
        wifiPotency: {
            type: Number,
            default: null,
        },
        atStation: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = HistoricSchema;
