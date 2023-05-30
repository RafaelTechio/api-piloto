const mongoose = require('mongoose');

const MaintenerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rfid: String,
        sectorId: String,
    },
    { timestamps: true, versionKey: false }
);

module.exports = MaintenerSchema;
