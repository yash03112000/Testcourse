const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Test = require('../models/Test');

router.get('/', async (req, res) => {
	var tests = await Test.find({}).exec();
	res.json({
		tests,
	});
});

router.post('/permit', async (req, res) => {
	var test = await Test.findById(req.body.testid).exec();
	var i;
	var flag = false;
	for (i = 0; i < test.payments.length; i++) {
		if (test.payments[i].userid.equals(req.user.id)) flag = true;
	}
	res.json({
		status: flag,
	});
});

module.exports = router;
