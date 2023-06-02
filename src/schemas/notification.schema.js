const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        esp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Esp',
            default: null,
        },
        manteiner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manteiner',
            default: null,
        },
        state: String,
        urgency: String,
        sector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sector',
            default: null,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = NotificationSchema;
