const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Test = require('../models/Test');
var Course = require('../models/Course');
var Digital = require('../models/Digital');
var Payment = require('../models/Payment');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
	key_id: process.env.RAZORPAY_ID,
	key_secret: process.env.RAZORPAY_SECRET,
});

const eligible = (test, id) => {
	var i;
	var flag = false;
	for (i = 0; i < test.payments.length; i++) {
		if (test.payments[i].userid.equals(id)) return false;
	}
	return true;
};
router.post('/orders/test', async (req, res) => {
	// console.log(req.body.testid);
	var test = await Test.findById(req.body.testid).exec();
	if (test == null) {
		res.json({
			msg: 'Error',
			status: false,
		});
	} else {
		// console.log(test);
		if (eligible(test, req.user.id)) {
			const options = {
				amount: test.is_on_sale ? test.sale_price * 100 : test.price * 100, // amount in smallest currency unit
				currency: 'INR',
				receipt: 'receipt_order_74394',
			};
			// console.log('possible');
			instance.orders.create(options).then((order) => {
				if (order) {
					// console.log(order);
					res.json({
						order,
						msg: 'Success',
						status: true,
					});
				} else {
					res.json({
						msg: 'Error',
						status: false,
					});
				}
			});
		}
	}
});

router.post('/orders/course', async (req, res) => {
	// console.log(req.body.testid);
	var test = await Course.findById(req.body.id).exec();
	if (test == null) {
		res.json({
			msg: 'Error',
			status: false,
		});
	} else {
		// console.log(test);
		if (eligible(test, req.user.id)) {
			const options = {
				amount: test.is_on_sale ? test.sale_price * 100 : test.price * 100, // amount in smallest currency unit
				currency: 'INR',
				receipt: 'receipt_order_74394',
			};
			// console.log('possible');
			instance.orders.create(options).then((order) => {
				// console.log(order);
				if (order) {
					res.json({
						order,
						msg: 'Success',
						status: true,
					});
				} else {
					res.json({
						msg: 'Error',
						status: false,
					});
				}
			});
		}
	}
});

router.post('/orders/digital', async (req, res) => {
	// console.log(req.body.testid);
	var test = await Digital.findById(req.body.id).exec();
	if (test == null) {
		res.json({
			msg: 'Error',
			status: false,
		});
	} else {
		// console.log(test);
		if (eligible(test, req.user.id)) {
			const options = {
				amount: test.is_on_sale ? test.sale_price * 100 : test.price * 100, // amount in smallest currency unit
				currency: 'INR',
				receipt: 'receipt_order_74394',
			};
			// console.log('possible');
			instance.orders.create(options).then((order) => {
				// console.log(order);
				if (order) {
					res.json({
						order,
						msg: 'Success',
						status: true,
					});
				} else {
					res.json({
						msg: 'Error',
						status: false,
					});
				}
			});
		}
	}
});

router.post('/course/success', (req, res) => {
	// console.log('here');
	const {
		orderCreationId,
		razorpayPaymentId,
		razorpayOrderId,
		razorpaySignature,
	} = req.body.data;
	// console.log(razorpaySignature)
	// generated_signature = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
	const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
	shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
	const digest = shasum.digest('hex');
	// console.log(digest);

	if (digest !== razorpaySignature)
		return res.status(400).json({ msg: 'Transaction not legit!' });

	// console.log(digest !== razorpaySignature);

	Course.findById(req.body.id)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					console.log('here');
					var payment = new Payment();
					payment.orderCreationId = orderCreationId;
					payment.razorpayPaymentId = razorpayPaymentId;
					payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.id;
					payment.entitytype = 'Course';
					payment.userid = req.user.id;
					payment.free = false;
					payment.save().then((payment) => {
						console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entitytype = 'Course';
									a.entityid = test._id;
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											orderId: razorpayOrderId,
											paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/test/success', (req, res) => {
	// console.log('here');
	const {
		orderCreationId,
		razorpayPaymentId,
		razorpayOrderId,
		razorpaySignature,
	} = req.body.data;
	// console.log(razorpaySignature)
	// generated_signature = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
	const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
	shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
	const digest = shasum.digest('hex');
	console.log(digest);

	if (digest !== razorpaySignature)
		return res.status(400).json({ msg: 'Transaction not legit!' });

	// console.log(digest !== razorpaySignature);

	Test.findById(req.body.testid)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					console.log('here');
					var payment = new Payment();
					payment.orderCreationId = orderCreationId;
					payment.razorpayPaymentId = razorpayPaymentId;
					payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.testid;
					payment.entitytype = 'Test';
					payment.userid = req.user.id;
					payment.free = false;
					payment.save().then((payment) => {
						console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entityid = test._id;
									a.entitytype = 'Test';
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											orderId: razorpayOrderId,
											paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/digital/success', (req, res) => {
	// console.log('here');
	const {
		orderCreationId,
		razorpayPaymentId,
		razorpayOrderId,
		razorpaySignature,
	} = req.body.data;

	const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
	shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
	const digest = shasum.digest('hex');
	console.log(digest);

	if (digest !== razorpaySignature)
		return res.status(400).json({ msg: 'Transaction not legit!' });

	// console.log(digest !== razorpaySignature);

	Digital.findById(req.body.testid)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					console.log('here');
					var payment = new Payment();
					payment.orderCreationId = orderCreationId;
					payment.razorpayPaymentId = razorpayPaymentId;
					payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.testid;
					payment.entitytype = 'Digital';
					payment.userid = req.user.id;
					payment.free = false;
					payment.save().then((payment) => {
						console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entityid = test._id;
									a.entitytype = 'Digital';
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											orderId: razorpayOrderId,
											paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/test/registerfree', (req, res) => {
	Test.findById(req.body.testid)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					// console.log('here');
					var payment = new Payment();
					// payment.orderCreationId = orderCreationId;
					// payment.razorpayPaymentId = razorpayPaymentId;
					// payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.testid;
					payment.entitytype = 'Test';
					payment.userid = req.user.id;
					payment.free = true;
					payment.save().then((payment) => {
						// console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entitytype = 'Test';
									a.entityid = test._id;
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											// orderId: razorpayOrderId,
											// paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/course/registerfree', (req, res) => {
	Course.findById(req.body.id)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					// console.log('here');
					var payment = new Payment();
					// payment.orderCreationId = orderCreationId;
					// payment.razorpayPaymentId = razorpayPaymentId;
					// payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.id;
					payment.entitytype = 'Course';
					payment.userid = req.user.id;
					payment.free = true;
					payment.save().then((payment) => {
						// console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entitytype = 'Course';
									a.entityid = test._id;
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											// orderId: razorpayOrderId,
											// paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/digital/registerfree', (req, res) => {
	Digital.findById(req.body.id)
		.exec()
		.then((test) => {
			if (test) {
				if (eligible(test, req.user.id)) {
					// console.log('here');
					var payment = new Payment();
					// payment.orderCreationId = orderCreationId;
					// payment.razorpayPaymentId = razorpayPaymentId;
					// payment.razorpayOrderId = razorpayOrderId;
					payment.entityid = req.body.id;
					payment.entitytype = 'Digital';
					payment.userid = req.user.id;
					payment.free = true;
					payment.save().then((payment) => {
						// console.log(payment);
						var a = {};
						a.userid = req.user.id;
						a.paymentid = payment.id;
						test.payments.push(a);
						test.save().then(() => {
							User.findById(req.user.id)
								.exec()
								.then((user) => {
									var a = {};
									a.entitytype = 'Digital';
									a.entityid = test._id;
									a.paymentid = payment.id;
									user.payments.push(a);
									user.save().then(() => {
										res.json({
											msg: 'success',
											// orderId: razorpayOrderId,
											// paymentId: razorpayPaymentId,
											status: true,
										});
									});
								});
						});
					});
				} else {
					res.status(400).json({ msg: 'Some Error Occured' });
				}
			} else {
				res.status(400).json({ msg: 'Some Error Occured' });
			}
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

module.exports = router;
