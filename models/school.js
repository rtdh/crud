var mongoose = require('mongoose');

var schoolSchema = new mongoose.Schema ({
	division: String,
	mandal: String,
	mandalcode: Number,
	udisecode: Number,
	schoolname: String,
	mgmt: String
});

module.exports = mongoose.model('School', schoolSchema);