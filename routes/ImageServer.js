const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
var Test = require('../models/Test');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const uuid = require('uuid');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

router.post('/imageupload', (req, res) => {
	if (typeof req.body.data === 'undefined') {
		res.json({
			status: 400,
		});
	} else {
		const base64Data = new Buffer.from(
			req.body.data.replace(/^data:image\/\w+;base64,/, ''),
			'base64'
		);
		sharp(base64Data)
			.resize(150)
			.toBuffer()
			.then((data) => {
				var id = uuid.v4();
				const params = {
					Bucket: 'testcourseookul', // pass your bucket name
					Key: `${id}.png`, // file will be saved as testBucket/contacts.csv
					Body: data,
				};
				s3.upload(params, (err, data) => {
					if (err) throw err;
					console.log(`File uploaded successfully at ${data.Location}`);
					res.json({
						success: true,
						id: id,
					});
				});
			})
			.catch((err) => {
				throw err;
			});
	}
});

router.get('/ImageSearch/:id', (req, res) => {
	if (typeof req.params.id === 'undefined') res.json({ status: 400 });
	else {
		const params = {
			Bucket: 'testcourseookul', // pass your bucket name
			Key: `${req.params.id}`, // file will be saved as testBucket/contacts.csv
			// Key: 't3qWG.png'
		};
		s3.getObject(params, (err, data) => {
			const b64 = Buffer.from(data.Body).toString('base64');
			// res.send(`data:image/png;base64,${b64}`);
			// console.log(data.Body);

			res.send(data.Body);
		});
	}
});

module.exports = router;
