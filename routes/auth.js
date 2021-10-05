const express = require('express');
const router = express.Router();
const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
var User = require('../models/User');
// var id = require('../config/credentials.json');
var bcrypt = require('bcryptjs');
const dev = process.env.NODE_ENV !== 'production';
const uuid = require('uuid');
const moment = require('moment');
var nodemailer = require('nodemailer');
const { ensureAuthenciated } = require('../middleware/auth');
var jwt = require('jsonwebtoken');

var transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE,
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// const middlefun = (req, res, next) => {
// 	// console.log(req.headers)
// 	if (req.query.applogin) {
// 		// console.log(req.query.linkingUri)
// 		baseUri = req.query.linkingUri;
// 		// console.log(baseUri)
// 		req.session.redirectTo = baseUri;
// 		// req.session.save()
// 		next();
// 	} else {
// 		req.session.redirectTo = '/dashboard?';
// 		next();
// 	}
// };

router.get(
	'/google',
	// middlefun,
	passport.authenticate('google', { scope: ['email', 'profile'] })
);
// router.get('/google', (req, res) => {
// 	console.log(req);
// });
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/', session: true }),
	(req, res) => {
		// console.log(req.user);
		const token = jwt.sign(req.user.toJSON(), process.env.JWT_ACCESS_TOKEN);
		res.cookie('auth', token);
		res.redirect('/dashboard');
	}
);
router.get(
	'/facebook',
	// middlefun,
	passport.authenticate('facebook', { scope: ['email'] }, { scope: ['email'] })
);
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect(`/dashboard`);
	}
);

router.post('/local', async (req, res) => {
	try {
		let user = await User.findOne({ username: req.body.username });
		// console.log(user)
		if (!user) {
			res.json({
				msg: 'User And Password Doesnt Match',
				status: false,
			});
		}

		bcrypt.compare(req.body.password, user.password).then((valid) => {
			if (!valid) {
				res.json({
					msg: 'User And Password Doesnt Match',
					status: false,
				});
			} else {
				const token = jwt.sign(user.toJSON(), process.env.JWT_ACCESS_TOKEN);
				res.cookie('auth', token);

				// console.log(token);
				res.json({
					msg: 'success',
					status: true,
					type: user.type,
					accesstoken: token,
				});
			}
		});
	} catch (err) {
		console.error(err);
	}
});

passport.serializeUser((user, done) => {
	// console.log(user)
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	// console.log(id)
	User.findById(id, (err, user) => done(err, user));
});

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FB_CLIENTID,
			clientSecret: process.env.FB_CLIENTSECRET,
			callbackURL: dev
				? 'http://localhost:8080/auth/facebook/callback'
				: process.env.FB_CALLBACKURL,
			profileFields: ['id', 'emails', 'name'],
		},
		function (accessToken, refreshToken, profile, done) {
			// console.log(profile)
			User.findOne({ 'facebook.id': profile.id }, function (err, user) {
				if (err) return done(err);
				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.displayName;
					newUser.username = profile.displayName;

					// if (user.emails !== undefined) {
					// 	newUser.facebook.email = profile.emails[0].value;
					// 	newUser.email = profile.emails[0].value;
					// }

					newUser.save().then((newUser) => {
						return done(null, newUser);
					});
					// console.log(profile);
				}
			});
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENTID,
			clientSecret: process.env.GOOGLE_CLIENTSECRET,
			callbackURL: dev
				? 'http://localhost:8080/auth/google/callback'
				: process.env.GOOGLE_CALLBACK,
		},
		function (accessToken, refreshToken, profile, done) {
			// console.log(profile);
			// console.log(profile.displayName);
			User.findOne({ 'google.id': profile.id }, function (err, user) {
				if (err) return done(err);
				if (user) {
					return done(null, user);
				} else {
					// console.log(profile)
					var user = new User();
					user.google.id = profile.id;
					user.google.token = accessToken;
					// newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
					user.google.email = profile.emails[0].value;
					user.email = profile.emails[0].value;
					console.log(profile.displayName);
					user.username = profile.displayName;
					user.save().then((user) => {
						return done(null, user);
					});
				}
			});
		}
	)
);

router.post('/googleapp', (req, res) => {
	var { profile, accessToken } = req.body;
	User.findOne({ 'google.id': profile.id }, function (err, user) {
		if (err) return done(err);
		if (user) {
			const token = jwt.sign(user.toJSON(), process.env.JWT_ACCESS_TOKEN);
			res.cookie('auth', token);
			res.json({
				accesstoken: token,
			});
		} else {
			// console.log(profile)
			var user = new User();
			user.google.id = profile.id;
			user.google.token = accessToken;
			// newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
			user.google.email = profile.email;
			user.email = profile.email;
			// console.log(profile.displayName);
			user.username = profile.name;
			user.save().then((user) => {
				const token = jwt.sign(user.toJSON(), process.env.JWT_ACCESS_TOKEN);
				res.cookie('auth', token);
				res.json({
					accesstoken: token,
				});
			});
		}
	});
});

router.post('/SignUp', (req, res, next) => {
	User.findOne({ username: req.body.username })
		.exec()
		.then((user) => {
			// console.log(user)
			if (user) {
				console.log('Already Exist Will Put In React after Better Forms');
				res.json({
					msg: 'Username Exist',
				});
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(req.body.password, salt, (err, hash) => {
						// Store hash in your password DB.
						var newuser = new User();
						newuser.username = req.body.username;
						newuser.password = hash;
						newuser.email = req.body.email;
						newuser
							.save()
							.then(() => {
								res.json({ msg: 'Added' });
								console.log('Added');
							})
							.catch((err) => next(err));
					});
				});
			}
		})

		.catch((err) => next(err));
});

router.get('/', (req, res) => {
	const token = req.headers['x-access-token'];
	// console.log(token);
	jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
		if (err || !user) res.sendStatus(403).end();
		else {
			req.user = user;
			// console.log(user);
			res.json({
				user: user.username,
			});
		}
	});
	// if (req.isAuthenticated()) {
	// 	User.findById(req.user.id)
	// 		.exec()
	// 		.then((user) => {
	// 			res.json({
	// 				user: user.username,
	// 			});
	// 		})
	// 		.catch((err) => console.log(err));
	// } else {
	// 	res.status(403).end();
	// }
});

router.post('/forget', async (req, res) => {
	try {
		const { email } = req.body;
		if (typeof email === 'undefined') {
			res.json({
				status: 404,
				msg: ' Not Found',
			});
		} else {
			const user = await User.findOne({ email: email }).exec();
			if (user) {
				// console.log(process.env.EMAIL_PASSWORD);
				var otp = {};
				otp.id = uuid.v4();
				otp.time = moment();
				user.otp = otp;
				user.save().then((user) => {
					const mailOptions = {
						from: process.env.EMAIL_ADDRESS, // sender address
						to: user.email, // list of receivers
						subject: 'Forget Password', // Subject line
						html: `<p>Your OTP is ${user.otp.id}</p>`, // plain text body
					};
					transporter.sendMail(mailOptions, function (err, info) {
						if (err) console.log(err);
						else {
							console.log(info);
							res.json({
								status: 200,
							});
						}
					});
				});
			} else {
				res.json({
					status: 404,
					msg: ' Not Found',
				});
			}
		}
	} catch (e) {
		console.log(e);
		res.json({
			status: 404,
			msg: ' Error Occured',
		});
	}
});

router.post('/forget/set', async (req, res) => {
	try {
		const { password, otp, email } = req.body;
		if (
			typeof otp === 'undefined' ||
			typeof password === 'undefined' ||
			typeof email === 'undefined'
		) {
			res.json({
				status: 404,
				msg: ' Not Found',
			});
		} else {
			const user = await User.findOne({ email: email }).exec();
			if (user) {
				// console.log(process.env.EMAIL_PASSWORD);
				if (moment(user.otp.time).add(5, 'minute').isAfter(moment())) {
					if (otp == user.otp.id) {
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(req.body.password, salt, (err, hash) => {
								user.password = hash;
								user.save().then((user) => {
									res.json({
										status: 200,
									});
								});
							});
						});
					} else {
						res.json({
							status: 404,
							msg: 'Invalid',
						});
					}
				} else {
					res.json({
						status: 404,
						msg: 'Expired',
					});
				}
			} else {
				res.json({
					status: 404,
					msg: ' Not Found',
				});
			}
		}
	} catch (e) {
		console.log(e);
		res.json({
			status: 404,
			msg: ' Error Occured',
		});
	}
});

router.post('/change', ensureAuthenciated, async (req, res) => {
	try {
		const { oldPassword, newPassword } = req.body;
		if (
			typeof oldPassword === 'undefined' ||
			typeof newPassword === 'undefined'
		) {
			res.json({
				status: 404,
				msg: 'Fill All Fields',
			});
		} else {
			const user = await User.findById(req.user.id).exec();
			// console.log(user);
			if (user) {
				bcrypt.compare(oldPassword, user.password).then((valid) => {
					if (!valid) {
						res.json({
							status: 403,
							msg: 'Wrong Password',
						});
					} else {
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newPassword, salt, (err, hash) => {
								user.password = hash;
								user.save().then((user) => {
									res.json({
										status: 200,
									});
								});
							});
						});
					}
				});
			} else {
				res.json({
					status: 404,
					msg: 'Error',
				});
			}
		}
	} catch (e) {
		res.json({
			status: 404,
			msg: ' Error Occured',
		});
	}
});

// passport.use(
// 	'local',
// 	new LocalStrategy(async (username, password, done) => {
// 		// console.log(username)
// 		try {
// 			let user = await User.findOne({ username: username });
// 			// console.log(user)
// 			if (!user) {
// 				return done(null, false);
// 			}

// 			bcrypt.compare(password, user.password).then((res) => {
// 				if (!res) return done(null, false);
// 				else return done(null, user);
// 			});
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	})
// );

// router.post('/local', (req, res, next) => {
// 	passport.authenticate('local', (err, user, info) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!user) {
// 			return res.json({
// 				msg: 'User And Password Doesnt Match',
// 				status: false,
// 			});
// 		}
// 		jwt.sign(user._id,processs.env.JWT_ACCESS_TOKEN)
// 		req.logIn(user, function (err) {
// 			if (err) {
// 				return next(err);
// 			}
// 			return res.json({
// 				msg: 'success',
// 				status: true,
// 				type: user.type,
// 			});
// 		});
// 	})(req, res, next);
// });

// router.get('/logout', (req, res) => {
// 	req.logout();
// 	res.status(200).end();
// });

module.exports = router;
