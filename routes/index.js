var express = require('express');
var router = express.Router();
var Scenes = require('./../models/scenes');
var fs = require('fs');


function deleteFile(path){
	fs.unlink(path, function(err){
	   if(err){
		   return console.error(err);
	   }
	   console.log("File deleted successfully!");
	});
}

function deleteAllFiles() {
	fs.readdir('images/thumbnails/', function(err, files){
	   if(err){
		   return console.error(err);
	   }
	   files.forEach(function(file){
			console.log(file);
			if(file != '.gitignore'){
			   deleteFile('images/thumbnails/' + file);
		   }
	   });
	});
}


/**
An example dataString might look like this ==> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==;"
the RegExp method used is match, match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) 
firstly it searches the for the string "data:" with ([A-Za-z-+\/]+) as a filter using ";" as a delimiter
and then it searches for the string "base64," with (.+)$/ as a filter using "," as a delimiter
the results are then returned as an array in the matches variable.
**/

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  return response;
}



module.exports = function(passport){

	router.post('/scenes', function(req, res){ //server listens for post request from client	
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
			if(err){
				console.error(err)
				}
			console.log(newScene);
			res.send(newScene);
		});
	});


	router.put('/scenes/:id', function(req, res){
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


	router.delete('/scenes/:id', function(req, res){
		var id = req.params.id;
		deleteFile('images/thumbnails/' + id + '.png');
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


	router.delete('/scenes', function(req, res){
		Scenes.remove({}, function(err) {
			if(err){
				console.log(err);
			}
			else{
				console.log('All scenes have been removed');
			}
		});
		deleteAllFiles();
	});

	router.get('/scenes', function(req, res){ //server listens for get request from client	
		Scenes.find(function(err, scenes){
			res.send(scenes);
		});
	});

	router.get('/scenes/:id', function(req, res){
		var id = req.params.id;
		Scenes.findOne({_id : id}, function(err, scenes){  // this is a filter that compares 'id' in the parameter with _id in the database/********* Scenes *********/
			console.log('update ', scenes);
			/*Scenes.count({_id: id}, function(err, c){
				console.log('Count is ' + c);
			});*/
			res.send(scenes);
		 });
	});

	router.post('/upload', function(req, res){
		var canvasData = req.body.canvasData;
		var thumbnailUrl = req.body.id;
		var imageBuffer = decodeBase64Image(canvasData);
		console.log(imageBuffer);
		fs.writeFile(thumbnailUrl, imageBuffer.data, function(err) { 
			if(err){
				console.log(err);
			}else{
				console.log('file saved');
			}
		});
	});
	
	
	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup.html'/*,
		failureFlash : true*/  
	}));
	
	
	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login.html',
		failureFlash : true  
	}));
	
/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/login.html');
	});	
	
	
	return router;
}
