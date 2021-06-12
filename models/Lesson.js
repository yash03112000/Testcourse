const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
	title: {
		type: String,
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
	},
});

const User = mongoose.model('Lesson', LessonSchema);

module.exports = User;
