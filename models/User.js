const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	entityid: {
		type: mongoose.Types.ObjectId,
	},
	paymentid: {
		type: mongoose.Types.ObjectId,
	},
	entitytype: {
		type: String,
	},
});

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String,
	},
	twitter: {
		id: String,
		token: String,
		email: String,
		name: String,
	},
	payments: [PaymentSchema],
	type: {
		type: String,
		default: 'User',
	},
	courseposted: [mongoose.Types.ObjectId],
	testposted: [mongoose.Types.ObjectId],
	digitalposted: [mongoose.Types.ObjectId],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
