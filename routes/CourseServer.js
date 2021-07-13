const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../models/Test');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { ensureAuthenciated } = require('../middleware/auth');

router.get('/', (req, res) => {
	Course.find({})
		.exec()
		.then((courses) => {
			// console.log(courses);
			Test.find({})
				.exec()
				.then((tests) => {
					res.json({
						courses,
						tests,
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
	Course.findById(req.params.id)
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
	Lesson.findById(req.body.id)
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

router.post('/permit', async (req, res) => {
	try {
		var course = await Course.findById(req.body.id).exec();
		var i;
		var flag = false;
		if (course) {
			if (req.isAuthenticated()) {
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

module.exports = router;
