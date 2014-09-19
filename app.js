
/**
 * Module dependencies
 */

var express = require('express'),
	app = module.exports = express(),
	http = require('http').Server(app),
	path = require('path'),
	mongoose = require('mongoose'),
	ejs = require('ejs'),
	config = require(__dirname + '/config/' + app.get('env')),
	Session = require('connect-mongo')(express),
	pack = require(__dirname + '/package.json'),
	cookieParser = require('cookie-parser'),
	compression = require('compression'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	morgan  = require('morgan'),
	serveStatic = require('serve-static'),
	expressJwt = require('express-jwt'),
	io = require('socket.io')(http),
	socket = require('./routes/socket.js')
	usernames = {}
;

global.app = app;
app.config = config;
app.logger = console;
app.usernames = usernames;
app.io = io;

/**
 * Configuration
 */

// Include middleware.
app.use('/api', expressJwt({secret: app.config.session.secret}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(compression());
app.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method
		delete req.body._method
		return method
	}
}));
app.use(serveStatic(__dirname, { maxAge: app.config.server.cache.maxAge }));
app.use(morgan('dev'));
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);

var mongo = mongoose.connect(app.config.mongo.uri);

// Session handling.
app.use(express.session({
	secret: app.config.session.secret,
	store: new Session({
		url: app.config.mongo.uri
	}),
	cookie: { maxAge: null } // seconds to milliseconds.
}));

// Global error handler.
process.on('uncaughtException', function(err) {
	app.logger.error(err.stack);
});

// Setup views.
app.set('view engine', 'ejs');

/**
 * Routes
 */

require(__dirname + '/routes/route.js');

// Middleware Error Handler. Handles error as object or as array of objects.
app.use(function(err, req, res, next) {
	console.error(err);
	return false;
});

io.sockets.on('connection', socket);

/**
 * Start Server
 */
mongoose.connection.on('open', function() {
	// Bind to configured port.
	http.listen(app.config.server.port, function() {
		app.logger.info('Started on port %s in %s mode', app.config.server.port, app.settings.env);
	});
});