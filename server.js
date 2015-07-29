var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var databaseName = 'simulations';
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());

app.post('/scenes', function(req, res){ //server listens for post request from client	
	var sim = req.body;                          //the data is stored on the http request body because we're using post
	var newScene = new Scenes({
		circle: sim.circle,
		square: sim.square,
		triangle: sim.triangle,
		customShape: sim.customShape,
		pencil: sim.pencil,
		curve: sim.curve,
		wall: sim.wall
	});
	newScene.save(function(err, newScene){
		if(err){console.error(err)}
		console.log(err);
	});
});

app.post('/upload', function(req, res){
		console.log(req.body);
});

app.put('/scenes/:id', function(req, res){
	var id = req.params.id;
	
	var sim = req.body;
	var newScene = new Scenes({
		circle: sim.circle,
		square: sim.square,
		triangle: sim.triangle,
		customShape: sim.customShape,
		pencil: sim.pencil,
		curve: sim.curve,
		wall: sim.wall
	});
	
	Scenes.findById(id, function(err, scene) {
	  if (err){ 
		console.log(err);
		};
		
		scene.circle = newScene.circle,
		scene.square = newScene.square,
		scene.triangle = newScene.triangle,
		scene.customShape = newScene.customShape,
		scene.pencil = newScene.pencil,
		scene.curve = newScene.curve,
		scene.wall = newScene.wall
		
		scene.save(function(err) {
		if (err){
			console.log(err);
		};
			res.send(scene);
		});
	});
});


app.delete('/scenes/:id', function(req, res){
	var id = req.params.id;
	Scenes.remove({_id: id}, function(err) {
		if(err){
			console.log(err);
		}
		else{
			console.log('scene ' + id + ' has just been deleted');
			res.send(id);
		}
	});
});


app.delete('/scenes', function(req, res){
	Scenes.remove({}, function(err) {
		if(err){
			console.log(err);
		}
		else{
			console.log('All scenes have been removed');
		}
	});
});


var Scenes = mongoose.model('scenes', {
	circle: Array,
	square: Array,
	triangle: Array,
	customShape: Array,
	pencil: Array,
	curve: Array,
	wall: Array
});

app.get('/scenes', function(req, res){ //server listens for get request from client	
	Scenes.find(function(err, scenes){
		res.send(scenes);
	});
});

app.get('/scenes/:id', function(req, res){
	var id = req.params.id;
	Scenes.findOne({_id : id}, function(err, scenes){  // this is a filter that compares 'id' in the parameter with _id in the database/********* Scenes *********/
		console.log('update ', scenes);
		/*Scenes.count({_id: id}, function(err, c){
			console.log('Count is ' + c);
		});*/
		res.send(scenes);
	 });
})


mongoose.connect('mongodb://localhost/' + databaseName);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);


function startServer(){
	var port = 3000;
	app.listen(port);
	console.log('listening on port:' + port);
}

//  cd "../../xampp/htdocs/The Project/simuL8r"