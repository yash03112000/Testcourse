const { BlockOutlined } = require('@material-ui/icons');
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
	content: {
		type: String,
		default: ' ',
	},
	valid: {
		type: Boolean,
		default: false,
	},
});

const ReportSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Types.ObjectId,
	},
	testid: {
		type: mongoose.Types.ObjectId,
	},
	content: {
		type: String,
		default: ' ',
	},
});

const QuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		default: ' ',
	},
	question_type: {
		type: String,
		default: ' ',
	},
	option_1: {
		type: OptionSchema,
		default: () => ({}),
	},
	option_2: {
		type: OptionSchema,
		default: () => ({}),
	},
	option_3: {
		type: OptionSchema,
		default: () => ({}),
	},
	option_4: {
		type: OptionSchema,
		default: () => ({}),
	},
	answer: [String],
	reports: [ReportSchema],
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
