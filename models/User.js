const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	testid: {
		type: mongoose.Types.ObjectId,
	},
	paymentid: {
		type: mongoose.Types.ObjectId,
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
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
