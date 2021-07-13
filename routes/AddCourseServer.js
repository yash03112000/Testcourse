const express = require('express');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
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
			Course.findById(edit)
				.exec()
				.then((course) => {
					if (course) {
						course.title = title;
						course.is_free = free;
						course.is_on_sale = sale;
						course.price = price;
						course.sale_price = saleprice;
						course.dev_step = 1;
						course.user_id = req.user.id;
						course
							.save()
							.then((course) => {
								res.json({
									status: 200,
									id: course._id,
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
		var course = new Course();
		course.title = title;
		course.is_free = free;
		course.is_on_sale = sale;
		course.price = price;
		course.sale_price = saleprice;
		course.dev_step = 1;
		course.user_id = req.user.id;
		course
			.save()
			.then((course) => {
				res.json({
					status: 200,
					id: course._id,
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
		Course.findById(id)
			.select('dev_step user_id')
			.exec()
			.then((course) => {
				if (course) {
					// console.log(course);
					if (course.user_id.equals(req.user.id)) {
						res.json({
							status: 200,
							id: course.dev_step,
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

	Course.findById(id)
		.select('title free price is_on_sale sale_price user_id')
		.exec()
		.then((course) => {
			if (course) {
				if (course.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						course,
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
			msg: 'Price Required',
		});
	}

	Course.findById(id)
		.select('user_id requirements tags outcomes short_description')
		.exec()
		.then((course) => {
			if (course) {
				if (course.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						course,
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

router.get('/step2/:id', (req, res) => {
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
	Course.findById(id)
		.select('sections user_id')
		.exec()
		.then((course) => {
			if (course) {
				// console.log(course.section_id);
				if (course.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						sections: course.sections,
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
	const { id, desc, tags, requirements, outcomes } = req.body;
	if (
		typeof id === 'undefined' ||
		typeof desc === 'undefined' ||
		typeof tags === 'undefined' ||
		typeof requirements === 'undefined' ||
		typeof outcomes === 'undefined'
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

		Course.findById(id)
			.select('requirements outcomes tags short_description user_id dev_step')
			.exec()
			.then((course) => {
				if (course) {
					if (course.user_id.equals(req.user.id)) {
						course.tags = tags;
						course.short_description = desc;
						course.requirements = requirements;
						course.outcomes = outcomes;
						course.dev_step = 2;
						// course.section_id.push(a);
						course.save().then(() => {
							res.json({
								status: 200,
								// course,
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

router.post('/step2', (req, res) => {
	const { id, name } = req.body;
	if (typeof id === 'undefined' || typeof name === 'undefined' || name === '') {
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

		Course.findById(id)
			.select('sections user_id')
			.exec()
			.then((course) => {
				if (course) {
					if (course.user_id.equals(req.user.id)) {
						var a = {};
						a.title = name;
						course.sections.push(a);
						course.save().then(() => {
							res.json({
								status: 200,
								sections: course.sections,
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

router.post('/addLesson', (req, res) => {
	console.log('hehe');
	const { id, secid, title, url, sec, HDurl, SDurl, Medurl } = req.body;
	if (
		typeof id === 'undefined' ||
		typeof secid === 'undefined' ||
		typeof title === 'undefined' ||
		typeof url === 'undefined' ||
		typeof HDurl === 'undefined' ||
		typeof SDurl === 'undefined' ||
		typeof Medurl === 'undefined' ||
		typeof sec === 'undefined'
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
		Course.findById(id)
			.select('sections user_id')
			.exec()
			.then((course) => {
				if (course) {
					if (course.user_id.equals(req.user.id)) {
						var a = new Lesson();
						// console.log(a);
						a.title = title;
						a.secs = sec;
						a.video_url = url;
						a.course_id = id;
						if (HDurl !== '') {
							a.app_urls.HD.uri = HDurl;
							a.app_urls.HD.valid = true;
						}
						if (SDurl !== '') {
							a.app_urls.SD.uri = SDurl;
							a.app_urls.SD.valid = true;
						}
						if (Medurl !== '') {
							a.app_urls.Med.uri = Medurl;
							a.app_urls.Med.valid = true;
						}
						a.save().then((les) => {
							// console.log(ques);
							var sec = course.sections.id(secid);
							var c = {};
							c._id = les._id;
							c.video_url = les.video_url;
							c.secs = les.secs;
							c.title = les.title;
							sec.total_secs += les.sec;
							sec.lessons.push(c);
							course.save().then((course) => {
								res.json({
									status: 200,
									sections: course.sections,
								});
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

module.exports = router;
