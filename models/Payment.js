const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	orderCreationId: {
		type: String,
		default: ' ',
	},
	razorpayPaymentId: {
		type: String,
		default: ' ',
	},
	razorpayOrderId: {
		type: String,
		default: ' ',
	},
	entitytype: {
		type: String,
		default: ' ',
	},
	entityid: {
		type: mongoose.Types.ObjectId,
	},
	userid: {
		type: mongoose.Types.ObjectId,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	free: {
		type: Boolean,
		default: true,
	},
});

const User = mongoose.model('Payment', PaymentSchema);

module.exports = User;
