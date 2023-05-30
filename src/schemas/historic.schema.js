const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema(
    {
        espId: {
            type: String,
            required: true,
        },
        mantainerId: String,
        sectorId: String,
        atStation: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = HistoricSchema;
