const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Test = require('../models/Test');
const Course = require('../models/Course');
const Digital = require('../models/Digital');
const Lesson = require('../models/Lesson');
const { isAuthenticated } = require('../middleware/auth');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

router.get('/', (req, res) => {
	Digital.find({})
		.exec()
		.then((digitals) => {
			res.json({
				digitals,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/details/:id', (req, res) => {
	Digital.findById(req.params.id)
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

router.post('/permit', isAuthenticated, async (req, res) => {
	try {
		var course = await Digital.findById(req.body.id).exec();
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

router.get('/download/:id', async (req, res) => {
	if (typeof req.params.id === 'undefined') res.json({ status: 400 });
	else {
		const dig = await Digital.findById(req.params.id).exec();
		console.log(dig.ext);
		const params = {
			Bucket: 'testcourseookul', // pass your bucket name
			Key: `${req.params.id}.${dig.ext}`, // file will be saved as testBucket/contacts.csv
			// Key: 't3qWG.png'
		};
		s3.getObject(params, (err, data) => {
			// const b64 = Buffer.from(data.Body).toString('base64');
			// res.send(`data:image/png;base64,${b64}`);
			// console.log(data.Body);

			// res.send(data.Body);
			if (data) res.send(data.Body);
			else res.sendStatus(404);
		});
	}
});

module.exports = router;
