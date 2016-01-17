var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var base64image = require('base64-image');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var multer = require('multer');
var fs = require('fs');
var databaseConfig = require('./database');
var initPassport = require('./passport/init');
var busboy = require('connect-busboy');
var User = require('./models/users');
var flash = require('connect-flash');
var app = express();
var routes = require('./routes/index')(passport);
//app.use(express.static(__dirname + 'login.html'));
app.use(busboy({ immediate: true }));
app.use(express.static(__dirname));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({  // for parsing application/x-www-form-urlencoded
  extended: true
}));

app.get('/',function(req,res){
      res.sendfile("main.html");
});

app.use(function (err, req, res, next) {
  console.log(err); // <-- this should show you the fieldname of the offending file
  console.log(err.stack);
})

mongoose.connect(databaseConfig.url);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

app.post('/uploadProfile', function(req, res){
	var path = './images/profiles/',
		filename = '';
	// Upload file
	req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {	
		req.busboy.on('file', function(field, file, name, encoding, mimetype){
			var pos = mimetype.indexOf('/');
			mimetype = '.' + mimetype.slice(pos + 1);
			console.log('key: ', key, 'value: ', value);
			file.pipe(fs.createWriteStream(path + value + mimetype)); // Save to path 				
				User.findById(value, function(err, user){// value is the user id that was passed into the form
				if (err){ 
					console.log('Error#############',err);
				}
				user.local.profilePic = 'images/profiles/' + value + mimetype;
				
				user.save(function(err) {
				if (err){
					console.log(err);
				};
					//res.send(user);
				});
			});
		});	
	});		
    // Listen for 'finish' event and redirect to the main app
    req.busboy.on('finish', function(field){
		res.redirect('/simuL8r');
        //res.json({ 
           // status: 'ok',
           // file: filename
       // });
    });
});

// Configuring Passport
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
// Initialize Passport
initPassport(passport);
app.use('/', routes);


function startServer(){
	var port = 5000;
	app.listen(port);
	console.log('listening on port:' + port);
}

//  cd "../../xampp/htdocs/The Project/simuL8r"