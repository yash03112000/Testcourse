const express = require('express');
const Test = require('../models/Test');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');
const moment = require('moment');

const router = express.Router();

const allowed = (test, id) => {
	var i = 0;
	for (i = 0; i < test.payments.length; i++) {
		if (test.payments[i].userid.equals(id)) {
			return true;
		}
	}
	return false;
};

router.get('/:id', (req, res) => {
	Test.findById(req.params.id)
		.exec()
		.then((test) => {
			if (allowed(test, req.user.id)) {
				Result.findOne({ test_id: test._id, user_id: req.user.id })
					.exec()
					.then((result) => {
						if (result) {
							var a = result;
							// console.log(a);
							var sec = a.sections.id(a.activesec);
							// console.log(sec);
							if (sec) {
								var start = moment(sec.timestarted);
								var endTime = moment();
								var duration = moment
									.duration(endTime.diff(start))
									.get('seconds');
								// console.log(start);
								// console.log(endTime);
								// console.log(duration);
								sec.timeleft -= duration;
								sec.timestarted = endTime;
								// result.activesec = req.body.newssec;
								result.save().then((result) => {
									res.json({
										test,
										result,
									});
								});
							} else {
								res.json({
									test,
									result,
								});
							}
						} else {
							// console.log(test.section_id[0]);
							var result = new Result();
							result.test_id = test._id;
							result.user_id = req.user.id;
							// result.user_response = arr;
							result.activesec = test.section_id[0]._id;
							result.sections = test.section_id;
							result.notvisited = test.total_questions;
							result.save().then(() => {
								res.json({
									test,
									result,
									status: 200,
								});
							});
						}
					});
			} else {
				res.json({
					status: 403,
				});
			}
		});
});

const middle = (req, res, next) => {
	const { test, id, secid } = req.body;
	console.log(req.body);
	if (
		typeof id === 'undefined' ||
		typeof test === 'undefined' ||
		typeof secid === 'undefined'
	) {
		res.json({
			status: 400,
			msg: 'send All Fields',
		});
	} else {
		next();
	}
};

router.post('/question', middle, (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test);
			if (test.length > 0) {
				var test = test[0];
				var sec = test.sections.id(req.body.secid);
				// console.log(sec);
				if (sec == null) res.json({ status: 400, msg: 'Failed' });
				var ques = sec.questions.id(req.body.id);
				if (ques == null) res.json({ status: 400, msg: 'Failed' });
				// console.log(ques);
				if (!ques.visited) {
					test.notvisited--;
					test.notanswered++;
					ques.visited = true;
					ques.notanswered = true;
					test
						.save()
						.then((test) => {
							Ques.findById(req.body.id)
								.select('-answer')
								.exec()
								.then((quesbody) => {
									res.json({
										quesbody,
										result: test,
										ques,
									});
								})
								.catch((err) => {
									console.log(err);
								});
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					Ques.findById(req.body.id)
						.select('-answer')
						.exec()
						.then((quesbody) => {
							res.json({
								quesbody,
								result: test,
								ques,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/save', middle, (req, res) => {
	if (typeof req.body.answer === 'undefined') res.json({ status: 400 });
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var sec = test.sections.id(req.body.secid);
				// console.log(sec);
				if (sec == null) res.json({ status: 400, msg: 'Failed' });
				var ques = sec.questions.id(req.body.id);
				if (ques == null) res.json({ status: 400, msg: 'Failed' });
				if (req.body.answer.length > 0) {
					if (!ques.answered) {
						if (ques.notanswered) {
							test.notanswered--;
							ques.notanswered = false;
						} else if (ques.markedanswered) {
							test.markedanswered--;
							ques.markedanswered = false;
						} else if (ques.markedforreview) {
							test.markedforreview--;
							ques.markedforreview = false;
						}
						test.answered++;
						ques.answered = true;
						ques.response = req.body.answer;
						test
							.save()
							.then((test) => {
								res.json({
									result: test,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					} else {
						ques.response = req.body.answer;
						test
							.save()
							.then((test) => {
								res.json({
									result: test,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					}
				} else {
					if (!ques.answered) {
						if (ques.markedanswered) {
							test.markedanswered--;
							ques.markedanswered = false;
							test.markedforreview++;
							ques.markedforreview = true;
						}
						ques.response = req.body.answer;
						test
							.save()
							.then((test) => {
								res.json({
									result: test,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					} else {
						ques.response = req.body.answer;
						ques.answered = false;
						ques.notanswered = true;
						test.answered--;
						test.notanswered++;
						test
							.save()
							.then((test) => {
								res.json({
									result: test,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					}
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/clearresponse', middle, (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var sec = test.sections.id(req.body.secid);
				// console.log(sec);
				if (sec == null) res.json({ status: 400, msg: 'Failed' });
				var ques = sec.questions.id(req.body.id);
				if (ques == null) res.json({ status: 400, msg: 'Failed' });
				if (ques.answered) {
					test.notanswered++;
					test.answered--;
					ques.answered = false;
					ques.notanswered = true;
					ques.response = [];
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ques.markedanswered) {
					test.markedforreview++;
					test.markedanswered--;
					ques.markedanswered = false;
					ques.markedforreview = true;
					ques.response = [];
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					ques.response = [];
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/section/change', async (req, res) => {
	try {
		var result = await Result.findOne({
			test_id: req.body.testid,
			user_id: req.user.id,
		}).exec();
		if (result) {
			// console.log(result.sections);
			// console.log(req.body.oldsec);
			var oldsec = result.sections.id(req.body.oldsec);
			// console.log(oldsec);
			var newsec = result.sections.id(req.body.newsec);
			var start = moment(oldsec.timestarted);
			var endTime = moment();
			var duration = moment.duration(endTime.diff(start)).get('seconds');
			// console.log(start);
			// console.log(endTime);
			// console.log(duration);
			oldsec.timeleft -= duration;
			newsec.timestarted = endTime;
			result.activesec = req.body.newsec;
			var resultupd = await result.save();
			// if (newsec.timeleft > 0) {
			// 	res.json({});
			// }
			res.json({
				status: 200,
				timeleft: oldsec.timeleft,
			});
		} else {
			res.json({
				status: 404,
				msg: 'Some Error occurred',
			});
		}
	} catch (e) {
		console.log(e);
	}
});

router.post('/review', middle, (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var sec = test.sections.id(req.body.secid);
				// console.log(sec);
				if (sec == null) res.json({ status: 400, msg: 'Failed' });
				var ques = sec.questions.id(req.body.id);
				if (ques == null) res.json({ status: 400, msg: 'Failed' });
				if (ques.markedanswered) {
					ques.response = req.body.answer;
					if (!(req.body.answer.length > 0)) {
						ques.markedanswered = false;
						ques.markedforreview = true;
						test.markedanswered--;
						test.markedforreview++;
					}
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ques.markedforreview) {
					ques.response = req.body.answer;
					if (req.body.answer.length > 0) {
						ques.markedanswered = true;
						ques.markedforreview = false;
						test.markedanswered++;
						test.markedforreview--;
					}
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ques.answered) {
					ques.response = req.body.answer;
					if (req.body.answer.length > 0) {
						ques.markedanswered = true;
						ques.answered = false;
						test.markedanswered++;
						test.answered--;
					} else {
						ques.answered = true;
						ques.markedforreview = false;
						test.answered--;
						test.markedforreview++;
					}
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ques.notanswered) {
					ques.response = req.body.answer;
					if (req.body.answer.length > 0) {
						ques.markedanswered = true;
						ques.notanswered = false;
						test.markedanswered++;
						test.notanswered--;
					} else {
						ques.notanswered = false;
						ques.markedforreview = true;
						test.notanswered--;
						test.markedforreview++;
					}
					test
						.save()
						.then((test) => {
							res.json({
								result: test,
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/submit', (req, res) => {
	// console.log(req.body)
	Test.findById(req.body.testid)
		.exec()
		.then((test) => {
			Result.findOne({ test_id: test._id, user_id: req.user.id })
				.exec()
				.then((result) => {
					if (result) {
						// var a = result[0];
						result.is_test_completed = true;
						result
							.save()
							.then(() => {
								res.json({
									status: 200,
								});
							})
							.catch((err) => {
								console.log(err);
							});
					} else {
						res.json({
							status: 404,
							msg: 'Error Occured',
						});
					}
				});
		});
});

const grading = (a, b) => {
	if (a.length !== b.length) return false;
	var i;
	for (i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;
};

router.get('/result/:id', (req, res) => {
	// console.log('here')
	Test.findById(req.params.id)
		.exec()
		.then((test) => {
			Result.findOne({ test_id: test._id, user_id: req.user.id })
				.exec()
				.then((result) => {
					if (result) {
						// var a = result[0];
						if (result.is_test_completed) {
							if (result.computation) {
								res.json({
									result,
								});
							} else {
								Promise.all(
									result.sections.map(async (sec) => {
										// console.log('check-1');
										return Promise.all(
											sec.questions.map(async (res) => {
												if (res.answered || res.markedanswered) {
													await Ques.findById(res._id)
														.exec()
														.then((ques) => {
															// console.log('check-2');

															var answer = ques.answer;
															answer.sort();
															res.response.sort();
															if (grading(answer, res.response)) {
																// console.log("runned")
																res.user_score = res.marks_correct;
																res.iscorrect = true;
																result.totalscore += res.marks_correct;
															} else {
																res.user_score = res.marks_incorrect;
																result.totalscore += res.marks_incorrect;
															}
														})
														.catch((err) => {
															console.log(err);
														});
												}
											})
										);
									})
								).then(() => {
									// console.log('check-3');

									result.sections.map((sec) => {
										var i;
										var secscore = 0;
										var secattempt = 0;
										var seccorrect = 0;
										for (i = 0; i < sec.questions.length; i++) {
											secscore += sec.questions[i].user_score;
											if (
												sec.questions[i].answered ||
												sec.questions[i].markedanswered
											)
												secattempt++;
											if (sec.questions[i].iscorrect) seccorrect++;
										}
										sec.score = secscore;
										sec.attempt = secattempt;
										sec.correct = seccorrect;
									});
									result.is_test_completed = true;
									result.computation = true;
									// console.log(result)
									result
										.save()
										.then(() => {
											res.json({
												result,
											});
										})
										.catch((err) => {
											console.log(err);
										});
								});
							}
						} else {
							res.json({
								status: 404,
								msg: 'Error Occured',
							});
						}
					} else {
						res.json({
							status: 404,
							msg: 'Error Occured',
						});
					}
				});
		});
});

router.post('/result/questions', (req, res) => {
	// console.log('here')
	Test.findById(req.body.testid)
		.exec()
		.then((test) => {
			Result.findOne({ test_id: test._id, user_id: req.user.id })
				.exec()
				.then((result) => {
					if (result) {
						// var a = result[0];
						if (result.is_test_completed) {
							if (result.computation) {
								var quesarr = [];
								Promise.all(
									result.sections.map(async (sec) => {
										return Promise.all(
											sec.questions.map(async (res) => {
												await Ques.findById(res._id)
													.exec()
													.then((ques) => {
														var a = {};
														a.ques = ques;
														a.marks_correct = res.marks_correct;
														a.user_score = res.user_score;
														a.user_response = res.response;
														a.secid = sec._id;
														quesarr.push(a);
													})
													.catch((err) => {
														console.log(err);
													});
											})
										);
									})
								).then(() => {
									// console.log(quesarr)
									res.json({
										quesarr,
									});
								});
							} else {
								res.json({
									status: 404,
									msg: 'Error Occured',
								});
							}
						} else {
							res.json({
								status: 404,
								msg: 'Error Occured',
							});
						}
					} else {
						res.json({
							status: 404,
							msg: 'Error Occured',
						});
					}
				});
		});
});

router.post('/report', (req, res) => {
	// console.log(req.body.id);
	if (req.body.id === 'Test') {
		Test.findById(req.body.testid)
			.exec()
			.then((test) => {
				if (test) {
					var a = {};
					a.userid = req.user.id;
					a.content = req.body.text;
					test.reports.push(a);
					test
						.save()
						.then(() => {
							res.json({
								status: 200,
								msg: 'Done',
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		Ques.findById(req.body.id)
			.exec()
			.then((ques) => {
				if (ques) {
					var a = {};
					a.userid = req.user.id;
					a.content = req.body.text;
					a.testid = req.body.testid;
					ques.reports.push(a);
					ques
						.save()
						.then(() => {
							res.json({
								status: 200,
								msg: 'Done',
							});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

module.exports = router;
