const mongoose = require('mongoose');

const maintainerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rfid: {
            type: String,
            unique: true,
        },
        sectorId: String,
    },
    { timestamps: true, versionKey: false }
);

module.exports = maintainerSchema;
