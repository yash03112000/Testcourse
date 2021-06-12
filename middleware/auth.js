module.exports = {
	ensureAuthenciated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			// console.log('here');
			res.sendStatus(403).end();
		}
	},
	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/dashboard');
		} else {
			return next();
		}
	},
};
