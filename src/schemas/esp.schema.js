const mongoose = require('mongoose');

const EspSchema = new mongoose.Schema(
    {
        mac: {
            type: String,
            unique: true,
            required: true,
        },
        tabletName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = EspSchema;
