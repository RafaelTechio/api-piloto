const mongoose = require('mongoose');

const SectorSchema = new mongoose.Schema(
    {
        id: String,
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = SectorSchema;
