const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username:String,
	password:String,
    facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;