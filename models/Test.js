const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	startindex: {
		type: Number,
	},
	endindex: {
		type: Number,
	},
});

const PaymentSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Types.ObjectId,
	},
	paymentid: {
		type: mongoose.Types.ObjectId,
	},
});

const ReportSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Types.ObjectId,
	},
	content: {
		type: String,
	},
});

const TestSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	question_id: [mongoose.Types.ObjectId],
	question_marks_correct: [Number],
	question_marks_wrong: [Number],
	question_timings: [Number],
	section_id: [SectionSchema],
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
	},
	sale_price: {
		type: Number,
	},
	test_duration: {
		type: Number,
	},
	maximum_marks: {
		type: Number,
	},
	payments: [PaymentSchema],
	reports: [ReportSchema],
});

const User = mongoose.model('Test', TestSchema);

module.exports = User;
