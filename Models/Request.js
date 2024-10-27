const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    race: { type: String },
    class: { type: String },
    god: { type: String },
    background: { type: String },
    image: { type: String },
    level: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    phrase: { type: String },
    nation: { type: String },
    status: { type: String, default: 'pending' } // pendiente, aceptado, rechazado
});
module.exports = mongoose.model('Request', RequestSchema);
