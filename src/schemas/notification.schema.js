const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        espId: String,
        manteinerId: String,
        state: String,
        urgency: String,
        sectorId: String,
        content: String,
    },
    { timestamps: true, versionKey: false }
);

module.exports = NotificationSchema;
