const mongoose = require('mongoose');

const EspRouterSchema = new mongoose.Schema(
    {
        sectorId: String,
        mac: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = EspRouterSchema;
