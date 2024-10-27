const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
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
    nation: { type: String }
});

module.exports = mongoose.model('Character', CharacterSchema);
