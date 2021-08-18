const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	marks_correct: {
		type: Number,
		default: 0,
	},
	marks_incorrect: {
		type: Number,
		default: 0,
	},
	marks_timings: {
		type: Number,
		default: 0,
	},
});

const SectionSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ' ',
	},
	questions: [QuestionSchema],
	timeleft: {
		type: Number,
		default: 0,
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
		default: ' ',
	},
});

const TestSchema = new mongoose.Schema({
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
	dev_step: {
		type: Number,
		default: 0,
	},
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
		default: 0,
	},
	sale_price: {
		type: Number,
		default: 0,
	},
	test_duration: {
		type: Number,
		default: 0,
	},
	maximum_marks: {
		type: Number,
		default: 0,
	},
	total_questions: {
		type: Number,
		default: 0,
	},
	payments: [PaymentSchema],
	reports: [ReportSchema],
	tags: [String],
	languages: [String],
	outcomes: [String],
	requirements: [String],
});

const User = mongoose.model('Test', TestSchema);

module.exports = User;
