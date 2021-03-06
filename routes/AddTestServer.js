const express = require('express');
const Test = require('../models/Test');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/step0', (req, res) => {
	const { title, sale, free, price, saleprice, edit } = req.body;
	if (
		typeof title === 'undefined' ||
		typeof sale === 'undefined' ||
		typeof price === 'undefined' ||
		typeof free === 'undefined' ||
		typeof saleprice === 'undefined'
	)
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	if (title === '') {
		res.json({
			status: 400,
			msg: 'Tilte Required',
		});
	} else {
		if (!free) {
			if (price === 0 || price === '') {
				res.json({
					status: 400,
					msg: 'Price Required',
				});
			} else {
				if (sale) {
					if (saleprice === 0 || saleprice === '') {
						res.json({
							status: 400,
							msg: 'Sale Required',
						});
					}
				}
			}
		}
	}
	if (!(typeof edit === 'undefined')) {
		if (!mongoose.Types.ObjectId.isValid(edit)) {
			res.json({
				status: 400,
				msg: 'Price Required',
			});
		} else {
			Test.findById(edit)
				.exec()
				.then((test) => {
					if (test) {
						test.title = title;
						test.is_free = free;
						test.is_on_sale = sale;
						test.price = price;
						test.sale_price = saleprice;
						test.dev_step = 1;
						test.user_id = req.user.id;
						test
							.save()
							.then((test) => {
								// User.findById(req.user.id)
								// 	.exec()
								// 	.then((user) => {
								// 		user.testposted.push(test._id);
								// 		user.save().then(() => {
								// 			res.json({
								// 				status: 200,
								// 				id: test._id,
								// 			});
								// 		});
								// 	});
								res.json({
									status: 200,
									id: test._id,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					} else {
						res.json({
							status: 400,
							msg: 'Wrong ID',
						});
					}
				});
		}
	} else {
		var test = new Test();
		test.title = title;
		test.is_free = free;
		test.is_on_sale = sale;
		test.price = price;
		test.sale_price = saleprice;
		test.dev_step = 1;
		test.user_id = req.user.id;
		test
			.save()
			.then((test) => {
				// res.json({
				// 	status: 200,
				// 	id: test._id,
				// });
				User.findById(req.user.id)
					.exec()
					.then((user) => {
						user.testposted.push(test._id);
						user.save().then(() => {
							res.json({
								status: 200,
								id: test._id,
							});
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

router.get('/:id', (req, res) => {
	const { id } = req.params;
	if (typeof id === 'undefined')
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	else if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log('aa');
		res.json({
			status: 400,
			msg: 'Price Required',
		});
	} else {
		Test.findById(id)
			.select('dev_step user_id')
			.exec()
			.then((test) => {
				if (test) {
					// console.log(test);
					if (test.user_id.equals(req.user.id)) {
						res.json({
							status: 200,
							id: test.dev_step,
						});
					} else {
						res.json({
							status: 400,
							msg: 'Not Authorized',
						});
					}
				} else {
					res.json({
						status: 400,
						msg: 'Invalid ID',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

router.get('/step0/:id', (req, res) => {
	const { id } = req.params;
	if (typeof id === 'undefined')
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.json({
			status: 400,
			msg: 'Price Required',
		});
	}

	Test.findById(id)
		.select('title free price is_on_sale sale_price user_id')
		.exec()
		.then((test) => {
			if (test) {
				if (test.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						test,
					});
				} else {
					res.json({
						status: 400,
						msg: 'Not Authorized',
					});
				}
			} else {
				res.json({
					status: 400,
					msg: 'Invalid ID',
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/step1/:id', (req, res) => {
	const { id } = req.params;
	if (typeof id === 'undefined')
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});

	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	}
	Test.findById(id)
		.select('section_id user_id')
		.exec()
		.then((test) => {
			if (test) {
				// console.log(test.section_id);
				if (test.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						sections: test.section_id,
					});
				} else {
					res.json({
						status: 400,
						msg: 'Not Authorized',
					});
				}
			} else {
				res.json({
					status: 400,
					msg: 'Invalid ID',
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/step1', (req, res) => {
	const { id, name, time } = req.body;
	if (
		typeof id === 'undefined' ||
		typeof name === 'undefined' ||
		name === '' ||
		typeof time === 'undefined'
	) {
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	} else {
		console.log('here');
		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.json({
				status: 400,
				msg: 'Price Required',
			});
		}

		Test.findById(id)
			.select('section_id user_id')
			.exec()
			.then((test) => {
				if (test) {
					if (test.user_id.equals(req.user.id)) {
						var a = {};
						a.title = name;
						a.startindex = 0;
						a.endindex = 0;
						a.timeleft = time;
						test.section_id.push(a);
						test.save().then(() => {
							res.json({
								status: 200,
								sections: test.section_id,
							});
						});
					} else {
						res.json({
							status: 400,
							msg: 'Not Authorized',
						});
					}
				} else {
					res.json({
						status: 400,
						msg: 'Invalid ID',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

router.post('/addQuestion', (req, res) => {
	// console.log(req.body);
	const {
		id,
		ques,
		options,
		qtype,
		answer,
		secid,
		markCorrect,
		markIncorrect,
		isold,
		quesid,
	} = req.body;
	if (
		typeof id === 'undefined' ||
		typeof ques === 'undefined' ||
		typeof options === 'undefined' ||
		typeof qtype === 'undefined' ||
		typeof secid === 'undefined' ||
		typeof answer === 'undefined' ||
		typeof markCorrect === 'undefined' ||
		typeof markIncorrect === 'undefined' ||
		typeof isold === 'undefined'
	) {
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	} else if (
		!mongoose.Types.ObjectId.isValid(id) ||
		!mongoose.Types.ObjectId.isValid(secid)
	) {
		res.json({
			status: 400,
			msg: 'Price Required',
		});
	} else {
		Test.findById(id)
			.select('section_id user_id maximum_marks total_questions')
			.exec()
			.then((test) => {
				if (test) {
					if (test.user_id.equals(req.user.id)) {
						console.log('hehe');

						if (isold) {
							Ques.findById(quesid)
								.exec()
								.then((a) => {
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
									a.save().then((ques) => {
										// console.log(ques);
										var sec = test.section_id.id(secid);
										// var c = {};
										// c._id = ques._id;
										// c['marks_correct'] = markCorrect;
										// c['marks_incorrect'] = markIncorrect;
										var markc = 0;
										for (var i = 0; i < sec.questions.length; i++) {
											if (sec.questions[i]._id === ques._id) {
												markc = sec.questions[i]['marks_correct'];
												sec.questions[i]['marks_correct'] = markCorrect;
												sec.questions[i]['marks_incorrect'] = markIncorrect;
											}
										}
										// sec.questions.push(c);
										test.maximum_marks += markCorrect;
										test.maximum_marks -= markc;
										// test.total_questions++;
										test.save().then((test) => {
											res.json({
												status: 200,
												sections: test.section_id,
											});
										});
									});
								});
							// console.log(a);
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
							a.save().then((ques) => {
								// console.log(ques);
								var sec = test.section_id.id(secid);
								var c = {};
								c._id = ques._id;
								c['marks_correct'] = markCorrect;
								c['marks_incorrect'] = markIncorrect;
								sec.questions.push(c);
								test.maximum_marks += markCorrect;
								test.total_questions++;
								test.save().then((test) => {
									res.json({
										status: 200,
										sections: test.section_id,
									});
								});
							});
						}
					} else {
						res.json({
							status: 400,
							msg: 'Not Authorized',
						});
					}
				} else {
					res.json({
						status: 400,
						msg: 'Invalid ID',
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

router.get('/question/edit/:id', async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			res.sendStatus(404);
		} else {
			// console.log(req.params.id);

			var ques = await Ques.findById(req.params.id).exec();
			// console.log(ques);
			if (ques) {
				res.json({ ques });
			} else {
				res.sendStatus(404);
			}
		}
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
