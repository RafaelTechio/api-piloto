const mongoose = require('mongoose');

const EspSchema = new mongoose.Schema(
    {
        mac: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = EspSchema;
