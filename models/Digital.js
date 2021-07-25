const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Types.ObjectId,
	},
	paymentid: {
		type: mongoose.Types.ObjectId,
	},
});

const DigitalSchema = new mongoose.Schema({
	title: {
		type: String,
		default: '',
	},
	short_description: {
		type: String,
		default: '',
	},
	thumbnail: {
		type: String,
		default: '',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
	},
	is_free: {
		type: Boolean,
		default: true,
	},
	is_on_sale: {
		type: Boolean,
		default: false,
	},
	price: {
		type: Number,
		default: 0,
	},
	sale_price: {
		type: Number,
		default: 0,
	},
	ext: {
		type: String,
		default: '',
	},
	payments: [PaymentSchema],
	// reports: [ReportSchema],
	tags: [String],
	languages: [String],
	outcomes: [String],
	requirements: [String],
});

const Digital = mongoose.model('Digital', DigitalSchema);

module.exports = Digital;
