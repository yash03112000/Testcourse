const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	duration: {
		type: Number,
		default: 0,
	},
});

const User = mongoose.model('Lesson', LessonSchema);

module.exports = User;
