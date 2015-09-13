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
var done = false;

var app = express();
var routes = require('./routes/index')(passport);
//app.use(express.static(__dirname + 'login.html'));
app.use(express.static(__dirname));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({  // for parsing application/x-www-form-urlencoded
  extended: true
}));

//app.use(multer({dest: './login/'}).single('singleInputFileName')); // for parsing multipart/form-data

/*
app.use(multer({dest: './images/profiles/',
	rename: function (fieldname, filename){
		return filename + Date.now();
	}
}).single('singleInputFileName'));*/
/*
var type = multer({ dest: './images/profiles/',
	 rename: function (fieldname, filename) {
		return filename+Date.now();
	},
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  done=true;
	}
}).single('profilePic');*/


var type = multer({ dest: './images/profiles/'}).single('profilePic');

app.get('/',function(req,res){
      res.sendfile("main.html");
});
/*
app.post('/uploadProfile',function(req,res){
  if(done==true){
	console.log(req.files);
	res.end("File uploaded.");
  }
});*/

app.post('/uploadProfile', type, function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'images/profiles/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
 /* src.on('end', function() { res.render('complete'); });
  src.on('error', function(err) { res.render('error'); });*/

});

app.use(function (err, req, res, next) {
  console.log(err); // <-- this should show you the fieldname of the offending file
  console.log(err.stack);
})

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

function startServer(){
	var port = 3000;
	app.listen(port);
	console.log('listening on port:' + port);
}

//  cd "../../xampp/htdocs/The Project/simuL8r"