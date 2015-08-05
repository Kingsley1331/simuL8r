var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var base64image = require('base64-image');
var database = require('./database');
var app = express();
var routes = require('./routes/index')();
app.use(express.static(__dirname));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

mongoose.connect(database.url);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

function startServer(){
	//var port = 3000;
	var port = 8081;
	app.listen(port);
	console.log('listening on port:' + port);
}

//  cd "../../xampp/htdocs/The Project/simuL8r"


