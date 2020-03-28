var mongoose = require('mongoose');
var passLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: {type:String, unique:true, required:true},
	password: String,
	avatar: String,
	firstname: String,
	lastname: String,
	email: {type:String, unique: true, required:true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isAdmin: {
		type: Boolean,default: false
	}
});

userSchema.plugin(passLocalMongoose);

module.exports = mongoose.model('User', userSchema)