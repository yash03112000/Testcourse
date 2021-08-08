const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Test = require('../models/Test');
var Course = require('../models/Course');
var Digital = require('../models/Digital');

router.get('/', async (req, res) => {
	var user = req.user;
	if (user.type == 'User') {
		var tests = [];
		var courses = [];
		var digitals = [];
		await Promise.all(
			user.payments.map(async (pay) => {
				if (pay.entitytype === 'Course') {
					var course = await Course.findById(pay.entityid).exec();
					if (course) courses.push(course);
				} else if (pay.entitytype === 'Test') {
					var test = await Test.findById(pay.entityid).exec();
					if (test) tests.push(test);
				} else if (pay.entitytype === 'Digital') {
					var test = await Digital.findById(pay.entityid).exec();
					if (test) digitals.push(test);
				}
			})
		);

		res.json({
			tests,
			courses,
			digitals,
			type: 'User',
		});
	} else if (user.type == 'Teacher') {
		var tests = [];
		var courses = [];
		var digitals = [];

		await Promise.all(
			user.courseposted.map(async (pay) => {
				var course = await Course.findById(pay).exec();
				if (course) courses.push(course);
			})
		);
		await Promise.all(
			user.testposted.map(async (pay) => {
				var test = await Test.findById(pay).exec();
				if (test) tests.push(test);
			})
		);
		await Promise.all(
			user.digitalposted.map(async (pay) => {
				var test = await Digital.findById(pay).exec();
				if (test) digitals.push(test);
			})
		);

		res.json({
			tests,
			courses,
			digitals,
			type: 'Teacher',
		});
	} else if (user.type == 'Admin') {
		var tests = [];
		var courses = [];
		var digitals = [];

		await Promise.all(
			user.payments.map(async (pay) => {
				if (pay.entitytype === 'Course') {
					var course = await Course.findById(pay.entityid).exec();
					if (course) courses.push(course);
				} else if (pay.entitytype === 'Test') {
					var test = await Test.findById(pay.entityid).exec();
					if (test) tests.push(test);
				}
			})
		);

		res.json({
			tests,
			courses,
			digitals,
			type: 'Admin',
		});
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;
