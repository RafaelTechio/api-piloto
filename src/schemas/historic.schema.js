const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema(
    {
        espId: {
            type: String,
            required: true,
        },
        sectorEspId: String,
        maintainerId: String,
        sectorMaintainerId: String,
        routerId: String,
        wifiPontency: Number,
        atStation: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = HistoricSchema;
