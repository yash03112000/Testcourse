const express = require('express');
const Test = require('../models/Test');
const Ques = require('../models/Question');
const Result = require('../models/TestResult');

const router = express.Router();

router.post('/step1', (req, res) => {
	const { title, sale, free, price, saleprice } = req.body;
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
			res.json({
				status: 200,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
