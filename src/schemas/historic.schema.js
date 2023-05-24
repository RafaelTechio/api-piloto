const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema({
    esp_id: String,
    mantainer_id: String,
    date: Date,
    sector: String,
    at_station: Boolean,
});

module.exports = HistoricSchema;
