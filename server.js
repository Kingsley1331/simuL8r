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
    req.busboy.on('file', function(field, file, name){
        filename = name;
        file.pipe(fs.createWriteStream(path + name)); // Save to path 
    });
    // Send result back
    req.busboy.on('finish', function(field){
        res.json({
            status: 'ok',
            file: filename
        });
    });
});


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