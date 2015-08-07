var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var base64image = require('base64-image');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var multer = require('multer');
var databaseConfig = require('./database');
var initPassport = require('./passport/init');

var app = express();
var routes = require('./routes/index')(passport);
app.use(express.static(__dirname));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // for parsing json from request body
app.use(bodyParser.urlencoded({ // for parsing application/json
  extended: true
}));
/*** NEW ***/
//app.use(multer()); // for parsing multipart/form-data

//app.use('/', routes);

mongoose.connect(databaseConfig.url);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

// Configuring Passport
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
initPassport(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log('Login in again');
   /* var err = new Error('Not Found');
	if(err){
		err.status = 404;
		next(err);
	}*/
	if(!req.user){
		console.log('Login in again');
		res.redirect('login.html')
	}
	next();
});


function startServer(){
	//var port = 3000;
	var port = 8081;
	app.listen(port);
	console.log('listening on port:' + port);
}

//  cd "../../xampp/htdocs/The Project/simuL8r"