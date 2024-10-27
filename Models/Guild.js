const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildID: { type: String, required: true },
    guildMasterRoleID: { type: String, required: true }
});

module.exports = mongoose.model('Guild', GuildSchema);
