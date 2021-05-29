const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	orderCreationId: {
		type: String,
	},
	razorpayPaymentId: {
		type: String,
	},
	razorpayOrderId: {
		type: String,
	},
	testid: {
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
	},
});

const User = mongoose.model('Payment', PaymentSchema);

module.exports = User;
