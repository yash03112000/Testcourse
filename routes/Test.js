const express = require('express');
const Test = require('../models/Test');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');

const router = express.Router();

router.get('/:id', (req, res) => {
	Test.findById(req.params.id)
		.exec()
		.then((test) => {
			var arr = [];
			test.question_id.map((q, i) => {
				var a = {};
				a._id = q;
				a.marks_correct = test.question_marks_correct[i];
				a.marks_wrong = test.question_marks_wrong[i];
				arr.push(a);
			});
			var arr2 = [];
			test.section_id.map((sec) => {
				var a = {};
				a.title = sec.title;
				a.startindex = sec.startindex;
				a.endindex = sec.endindex;
				arr2.push(a);
			});
			// console.log(arr)
			Result.find({ test_id: test._id, user_id: req.user.id })
				.exec()
				.then((result) => {
					if (result.length > 0) {
						var a = result[0];
						res.json({
							test,
							result: a,
						});
					} else {
						var result = new Result();
						result.test_id = test._id;
						result.user_id = req.user.id;
						result.user_response = arr;
						result.sections = arr2;
						result.notvisited = test.question_id.length;
						result.save().then(() => {
							res.json({
								test,
								result,
							});
						});
					}
				});
		});
});

router.post('/question', (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var ques = test.user_response.id(req.body.id);
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

router.post('/save', (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var ques = test.user_response.id(req.body.id);
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

router.post('/clearresponse', (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var ques = test.user_response.id(req.body.id);
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

router.post('/review', (req, res) => {
	Result.find({ test_id: req.body.test, user_id: req.user.id })
		.exec()
		.then((test) => {
			// console.log(test)
			if (test.length > 0) {
				var test = test[0];
				var ques = test.user_response.id(req.body.id);
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
								// computation(res,test,result)
								Promise.all(
									result.user_response.map(async (res) => {
										// console.log('sbse phle')
										if (res.answered || res.markedanswered) {
											await Ques.findById(res._id)
												.exec()
												.then((ques) => {
													// console.log(ques);
													var answer = ques.answer;
													answer.sort();
													res.response.sort();
													// console.log(i);
													// console.log(answer);
													// console.log("runfirst")
													if (grading(answer, res.response)) {
														// console.log("runned")
														res.user_score = res.marks_correct;
														res.iscorrect = true;
														result.totalscore += res.marks_correct;
													} else {
														res.user_score = res.marks_wrong;
														result.totalscore += res.marks_wrong;
													}
												})
												.catch((err) => {
													console.log(err);
												});
										}
									})
								).then(() => {
									result.sections.map((sec) => {
										var i;
										var secscore = 0;
										var secattempt = 0;
										var seccorrect = 0;
										for (i = sec.startindex; i <= sec.endindex; i++) {
											secscore += result.user_response[i].user_score;
											if (
												result.user_response[i].answered ||
												result.user_response[i].markedanswered
											)
												secattempt++;
											if (result.user_response[i].iscorrect) seccorrect++;
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
									result.user_response.map(async (res) => {
										await Ques.findById(res._id)
											.exec()
											.then((ques) => {
												var a = {};
												a.ques = ques;
												a.marks_correct = res.marks_correct;
												a.user_score = res.user_score;
												a.user_response = res.response;
												quesarr.push(a);
											})
											.catch((err) => {
												console.log(err);
											});
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
