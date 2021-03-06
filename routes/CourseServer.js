const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../models/Test');
const Course = require('../models/Course');
const Digital = require('../models/Digital');
const Lesson = require('../models/Lesson');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', (req, res) => {
	Course.find({})
		.exec()
		.then((courses) => {
			// console.log(courses);
			Test.find({})
				.exec()
				.then((tests) => {
					Digital.find({})
						.exec()
						.then((digitals) => {
							res.json({
								courses,
								tests,
								digitals,
							});
						});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/:id', (req, res) => {
	Course.findOne({ slug: req.params.id })
		.exec()
		.then((course) => {
			// console.log(course);
			if (course) {
				res.json({
					routes: course,
				});
			} else {
				res.sendStatus(404).end();
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/testdetails/:id', (req, res) => {
	Test.findById(req.params.id)
		.exec()
		.then((course) => {
			// console.log(course);
			if (course) {
				res.json({
					routes: course,
				});
			} else {
				res.sendStatus(404).end();
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/lessondata', (req, res) => {
	// console.log(req.body.id);
	Lesson.findOne({ slug: req.body.id })
		.exec()
		.then((les) => {
			// console.log(course);
			if (les) {
				Course.findById(les.course_id)
					.exec()
					.then((course) => {
						if (course) {
							// console.log(course.sections);
							res.json({
								data: course.sections,
								lesson: les.video_url,
								uris: les.app_urls,
							});
						} else {
							res.sendStatus(404).end();
						}
					});
			} else {
				res.sendStatus(404).end();
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/permit', isAuthenticated, async (req, res) => {
	try {
		var course = await Course.findOne({ slug: req.body.slug }).exec();
		var i;
		var flag = false;
		if (course) {
			var a = req.user.isAuthenticated;
			console.log(a);
			if (a) {
				for (i = 0; i < course.payments.length; i++) {
					if (course.payments[i].userid.equals(req.user.id)) flag = true;
				}
				res.json({
					status: flag,
					data: course,
				});
			} else {
				res.json({
					status: false,
					data: course,
				});
			}
		} else {
			res.sendStatus(404).end();
		}
	} catch (err) {
		console.log(err);
	}
});

router.post('/test/permit', isAuthenticated, async (req, res) => {
	try {
		var course = await Test.findById(req.body.id).exec();
		var i;
		var flag = false;
		if (course) {
			var a = req.user.isAuthenticated;
			console.log(a);
			if (a) {
				console.log('a');
				for (i = 0; i < course.payments.length; i++) {
					if (course.payments[i].userid.equals(req.user.id)) flag = true;
				}
				res.json({
					status: flag,
					data: course,
					// type: req.user.type,
				});
			} else {
				console.log('b');
				res.json({
					status: false,
					data: course,
					// type: 'none',
				});
			}
		} else {
			res.sendStatus(404).end();
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
