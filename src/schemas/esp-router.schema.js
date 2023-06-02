const mongoose = require('mongoose');

const EspRouterSchema = new mongoose.Schema(
    {
        sector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sector',
            default: null,
        },
        mac: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = EspRouterSchema;
