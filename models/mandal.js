var mongoose = require('mongoose');

var mandalSchema = new mongoose.Schema ({
	id: Number,
	name: String
});

module.exports = mongoose.model('Mandal', mandalSchema);