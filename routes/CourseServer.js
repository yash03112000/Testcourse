const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

router.get('/', (req, res) => {
	Course.find({})
		.exec()
		.then((courses) => {
			// console.log(courses);
			res.json({
				courses,
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
router.post('/permit', async (req, res) => {
	try {
		var course = await Course.findById(req.body.id).exec();
		var i;
		var flag = false;
		if (course) {
			for (i = 0; i < course.payments.length; i++) {
				if (course.payments[i].userid.equals(req.user.id)) flag = true;
			}
			res.json({
				status: flag,
				data: course,
			});
		}
	} catch (err) {
		console.log(err);
	}
});
module.exports = router;
