var jwt = require('jsonwebtoken');

module.exports = {
	ensureAuthenciated: (req, res, next) => {
		const token = req.headers['x-access-token'];
		// console.log(token);
		jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
			req.user = {};
			req.user.isAuthenticated = false;
			// console.log(user);
			// console.log(err);
			if (err || !user) res.sendStatus(403).end();
			else {
				req.user = user;
				req.user.id = user._id;
				req.user.isAuthenticated = true;
				next();
			}
		});
	},
	isAuthenticated: (req, res, next) => {
		const token = req.headers['x-access-token'];
		// console.log(token);
		jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
			// console.log(user);
			// console.log(err);
			req.user = {};
			req.user.isAuthenticated = false;
			if (err || !user) next();
			else {
				req.user = user;
				req.user.id = user._id;
				req.user.isAuthenticated = true;
				next();
			}
		});
	},
	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/dashboard');
		} else {
			return next();
		}
	},
};
