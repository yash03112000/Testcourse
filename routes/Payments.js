const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Test = require('../models/Test');
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
router.post('/orders', async (req, res) => {
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

router.post('/success', (req, res) => {
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
			if (eligible(test, req.user.id))
				if (test) {
					console.log('here');
					var payment = new Payment();
					payment.orderCreationId = orderCreationId;
					payment.razorpayPaymentId = razorpayPaymentId;
					payment.razorpayOrderId = razorpayOrderId;
					payment.testid = req.body.testid;
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
									a.testid = test._id;
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
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

router.post('/registerfree', (req, res) => {
	Test.findById(req.body.testid)
		.exec()
		.then((test) => {
			if (test) {
				// console.log('here');
				var payment = new Payment();
				// payment.orderCreationId = orderCreationId;
				// payment.razorpayPaymentId = razorpayPaymentId;
				// payment.razorpayOrderId = razorpayOrderId;
				payment.testid = req.body.testid;
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
								a.testid = test._id;
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
		})
		.catch((err) => {
			res.status(400).json({ msg: 'Transaction not legit!' });
		});
});

module.exports = router;
