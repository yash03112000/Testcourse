const express = require('express');
const next = require('next');

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const isDev = process.env.NODE_ENV !== 'production';
const MongoStore = require('connect-mongo')(session);
const { ensureAuthenciated } = require('./middleware/auth');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
// const config = isDev?require('./config/config'):'';
var cors = require('cors');
require('dotenv').config();
// const {ensureAuthenticated} = require('./routes/auth')

app.prepare().then(() => {
	const server = express();

	const connectDB = async () => {
		try {
			const conn = await mongoose.connect(
				dev ? process.env.MONGO_URI : process.env.MONGO_URI_PROD,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
					useCreateIndex: true,
				}
			);

			mongoose.Promise = global.Promise;

			console.log(`MongoDB Connected: ${conn.connection.host}`);
		} catch (err) {
			console.error(err);
			process.exit(1);
		}
	};

	connectDB();
	server.use(cors());
	// server.set('trust proxy', 1);
	// console.log(process.env.NODE_ENV);

	if (isDev) {
		// console.log(process.env.NODE_ENV);
		server.use(
			morgan('dev', {
				skip: function (req, res) {
					if (req.url.split('/static/')[0] == '/_next') {
						return true;
					} else {
						return false;
					}
				},
			})
		);
	}
	server.use(express.urlencoded({ extended: true, limit: '10mb' }));
	server.use(express.json({ limit: '10mb' }));
	server.use(fileUpload());
	// server.use(formidableMiddleware());
	var idk = session({
		secret: 'keyboard cat',
		resave: false,
		cookie: { maxAge: 60000000 },
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	});

	server.use(idk);

	//Passport Middleware
	server.use(passport.initialize());
	server.use(passport.session());
	server.use('/auth', require('./routes/auth'));
	server.use('/payment', ensureAuthenciated, require('./routes/Payments'));
	server.use('/Testserver', ensureAuthenciated, require('./routes/TestServer'));
	server.use(
		'/DashboardServer',
		ensureAuthenciated,
		require('./routes/DashboardServer')
	);
	server.use(
		'/AddTestServer',
		ensureAuthenciated,
		require('./routes/AddTestServer')
	);
	server.use(
		'/QuestionServer',
		ensureAuthenciated,
		require('./routes/QuestionServer')
	);
	server.use(
		'/AddCourseServer',
		ensureAuthenciated,
		require('./routes/AddCourseServer')
	);
	server.use(
		'/AddDigitalServer',
		ensureAuthenciated,
		require('./routes/AddDigitalServer')
	);
	server.use('/CourseServer', require('./routes/CourseServer'));
	server.use('/ImageServer', require('./routes/ImageServer'));
	server.use('/DigitalServer', require('./routes/DigitalServer'));

	server.all('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
