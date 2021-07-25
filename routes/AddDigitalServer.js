const express = require('express');
const Digital = require('../models/Digital');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');
const User = require('../models/User');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const router = express.Router();

const uuid = require('uuid');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

router.post('/step0', (req, res) => {
	const { title, sale, free, price, saleprice, edit } = req.body;
	// console.log(req.body);
	// console.log(req.files);
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
			Digital.findById(edit)
				.exec()
				.then((digital) => {
					if (digital) {
						digital.title = title;
						digital.is_free = free;
						digital.is_on_sale = sale;
						digital.price = price;
						digital.sale_price = saleprice;
						digital.dev_step = 1;
						digital.user_id = req.user.id;
						digital
							.save()
							.then((digital) => {
								res.json({
									status: 200,
									id: digital._id,
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
		var digital = new Digital();
		digital.title = title;
		digital.is_free = free;
		digital.is_on_sale = sale;
		digital.price = price;
		digital.sale_price = saleprice;
		digital.dev_step = 1;
		digital.user_id = req.user.id;
		digital
			.save()
			.then((digital) => {
				// res.json({
				// 	status: 200,
				// 	id: digital._id,
				// });
				User.findById(req.user.id)
					.exec()
					.then((user) => {
						user.digitalposted.push(digital._id);
						user.save().then(() => {
							res.json({
								status: 200,
								id: digital._id,
							});
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

router.post('/uploadfile/:id', (req, res) => {
	// console.log(req.body);
	// console.log(req.files.file);
	const file = req.files.file;
	const id = req.params.id;
	if (typeof file === 'undefined' || typeof id === 'undefined') {
		res.json({
			status: 400,
			msg: 'Fill All Fields',
		});
	} else {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.json({
				status: 400,
				msg: 'Price Required',
			});
		} else {
			Digital.findById(id)
				.exec()
				.then((digital) => {
					if (digital) {
						const ext = file.name.split('.')[1];
						// console.log(ext);
						// var id = uuid.v4();
						const params = {
							Bucket: 'testcourseookul', // pass your bucket name
							Key: `${id}.${ext}`, // file will be saved as testBucket/contacts.csv
							Body: file.data,
						};
						s3.upload(params, (err, data) => {
							if (err) throw err;
							console.log(`File uploaded successfully at ${data.Location}`);
							digital.ext = ext;
							digital
								.save()
								.then((digital) => {
									res.json({
										status: 200,
										id: digital._id,
									});
								})
								.catch((err) => {
									console.log(err);
								});
						});
					} else {
						res.json({
							status: 400,
							msg: 'Wrong ID',
						});
					}
				});
		}
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
		Digital.findById(id)
			.select('dev_step user_id')
			.exec()
			.then((digital) => {
				if (digital) {
					// console.log(digital);
					if (digital.user_id.equals(req.user.id)) {
						res.json({
							status: 200,
							id: digital.dev_step,
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

	Digital.findById(id)
		.select('title free price is_on_sale sale_price user_id')
		.exec()
		.then((digital) => {
			if (digital) {
				if (digital.user_id.equals(req.user.id)) {
					res.json({
						status: 200,
						digital,
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

module.exports = router;
