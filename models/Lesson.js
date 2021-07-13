const mongoose = require('mongoose');

const uriSchema = new mongoose.Schema({
	valid: {
		type: Boolean,
		default: false,
	},
	uri: {
		type: String,
		default: ' ',
	},
});

const URLSchema = new mongoose.Schema({
	HD: {
		type: uriSchema,
		default: () => ({}),
	},
	SD: {
		type: uriSchema,
		default: () => ({}),
	},
	Med: {
		type: uriSchema,
		default: () => ({}),
	},
});

const LessonSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ' ',
	},
	secs: {
		type: Number,
		default: 0,
	},
	course_id: {
		type: mongoose.Types.ObjectId,
	},
	video_url: {
		type: String,
		default: ' ',
	},
	app_urls: {
		type: URLSchema,
		default: () => ({}),
	},
});

const User = mongoose.model('Lesson', LessonSchema);

module.exports = User;
