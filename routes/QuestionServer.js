const express = require('express');
const Test = require('../models/Test');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/addQuestion', (req, res) => {
	console.log('hehe');
	const {
		ques,
		options,
		qtype,
		answer,
		markCorrect,
		markIncorrect,
		isold,
		quesid,
	} = req.body;
	if (
		typeof ques === 'undefined' ||
		typeof options === 'undefined' ||
		typeof qtype === 'undefined' ||
		typeof answer === 'undefined' ||
		typeof markCorrect === 'undefined' ||
		typeof isold === 'undefined' ||
		typeof markIncorrect === 'undefined'
	) {
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	} else {
		if (isold) {
			Ques.findById(quesid)
				.exec()
				.then((a) => {
					// console.log(a);
					a.question = ques;
					a.question_type = qtype;
					a.answer = [];
					if (qtype === 'Fill') a.answer = answer;
					else {
						// var i;
						options.map((opt, i) => {
							var b = {};
							b.valid = true;
							b.content = opt.body;
							a[`option_${i + 1}`] = b;
							if (opt.correct) {
								a.answer.push(a[`option_${i + 1}`]._id);
							}
						});
					}
					a.save()
						.then((ques) => {
							res.json({
								status: 200,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				});
		} else {
			var a = new Ques();
			// console.log(a);
			a.question = ques;
			a.question_type = qtype;
			a.answer = [];
			if (qtype === 'Fill') a.answer = answer;
			else {
				// var i;
				options.map((opt, i) => {
					var b = {};
					b.valid = true;
					b.content = opt.body;
					a[`option_${i + 1}`] = b;
					if (opt.correct) {
						a.answer.push(a[`option_${i + 1}`]._id);
					}
				});
			}
			a.save()
				.then((ques) => {
					res.json({
						status: 200,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
});

module.exports = router;
