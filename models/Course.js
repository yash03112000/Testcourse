const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ' ',
	},
	secs: {
		type: Number,
		default: 0,
	},
	video_url: {
		type: String,
		default: ' ',
	},
});

const SectionSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ' ',
	},
	// total_secs: {
	// 	type: Number,
	// },
	lessons: [LessonSchema],
});

const RatingSchema = new mongoose.Schema({
	rated_1: {
		type: Number,
		default: 0,
	},
	rated_2: {
		type: Number,
		default: 0,
	},
	rated_3: {
		type: Number,
		default: 0,
	},
	rated_4: {
		type: Number,
		default: 0,
	},
	rated_5: {
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

const CourseSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
	},
	title: {
		type: String,
		default: '',
	},
	thumbnail: {
		type: String,
		default: '',
	},
	short_description: {
		type: String,
		default: '',
	},
	is_free: {
		type: Boolean,
		default: false,
	},
	dev_step: {
		type: Number,
		default: 0,
	},
	is_on_sale: {
		type: Boolean,
		default: false,
	},
	sale_price: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		default: 0,
	},
	tags: [String],
	rating: {
		type: Number,
		default: 0,
	},
	total_ratings: {
		type: Number,
		default: 0,
	},
	ratings_count: {
		type: RatingSchema,
		default: () => ({}),
	},
	languages: [String],
	last_updated: {
		type: Date,
		default: Date.now(),
	},
	outcomes: [String],
	sections: [SectionSchema],
	requirements: [String],
	payments: [PaymentSchema],
});

const User = mongoose.model('Course', CourseSchema);

module.exports = User;
