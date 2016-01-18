var express = require('express');
var router = express.Router();
var Scenes = require('./../models/scenes');
var Users = require('./../models/users');
var fs = require('fs');
var busboy = require('connect-busboy');

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
	
	router.get('/users', function(req, res){ //server listens for get request from client
		//var userID = req.params.userID;
		Users.find({}, function(err, users){
			res.send(users);
		});
	});
	
	router.delete('/user/:id', function(req, res){
		var id = req.params.id;
		
		Scenes.remove({userID : id}, function(err) {
			if(err){
				console.log(err);
			}
			else{
				console.log('All scenes have been removed from user ' + id);
			}
		});	
		
		Users.find({_id: id}, function(err, user){
		console.log('!user[0].google.name ', !user[0].google.name);
		console.log('user[0].google.name ', user[0].google.name);
			if(!user[0].google.name){
				deleteFile(user[0].local.profilePic);
			}
			Users.remove({_id: id}, function(err){
				if(err){
					console.log(err);
				}
				else{
					console.log('user ' + id + ' has just been deleted');
					res.send(id);
				}
			});
		});
	});		
	

		/*Scenes.remove({userID : userID}, function(err) {
			if(err){
				console.log(err);
			}
			else{
				console.log('All scenes have been removed');
			}
		});*/

	
	router.post('/scenes', function(req, res){ //server listens for post request from client	
		var sim = req.body;                          //the data is stored on the http request body because we're using post
		var newScene = new Scenes({
			name: sim.name,
			userID: sim.userID,
			isPublic: sim.isPublic,
			imageUrl: sim.imageUrl,
			shapes: {
				circle: sim.shapes.circle,
				square: sim.shapes.square,
				triangle: sim.shapes.triangle,
				customShape: sim.shapes.customShape,
				pencil: sim.shapes.pencil,
				curve: sim.shapes.curve,
				wall: sim.shapes.wall
			}
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
			name: sim.name,
			userID: sim.userID,
			isPublic: sim.isPublic,
			imageUrl: sim.imageUrl,
			shapes: {
				circle: sim.shapes.circle,
				square: sim.shapes.square,
				triangle: sim.shapes.triangle,
				customShape: sim.shapes.customShape,
				pencil: sim.shapes.pencil,
				curve: sim.shapes.curve,
				wall: sim.shapes.wall
			}
		});
		
		Scenes.findById(id, function(err, scene){
		  if (err){ 
			console.log(err);
			};
			scene.name = newScene.name,
			scene.userID = newScene.userID,
			scene.isPublic = newScene.isPublic,
			scene.imageUrl = newScene.imageUrl,
			scene.shapes.circle = newScene.shapes.circle,
			scene.shapes.square = newScene.shapes.square,
			scene.shapes.triangle = newScene.shapes.triangle,
			scene.shapes.customShape = newScene.shapes.customShape,
			scene.shapes.pencil = newScene.shapes.pencil,
			scene.shapes.curve = newScene.shapes.curve,
			scene.shapes.wall = newScene.shapes.wall
			
			scene.save(function(err) {
			if (err){
				console.log(err);
			};
				res.send(scene);
			});
		});
	});


	router.delete('/scene/:id', function(req, res){
		var id = req.params.id;
		//deleteFile('images/thumbnails/' + id + '.png');
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

	
	router.delete('/scenes/:userID', function(req, res){
		var userID = req.params.userID;
		Scenes.remove({userID : userID}, function(err) {
			if(err){
				console.log(err);
			}
			else{
				console.log('All scenes have been removed');
			}
		});
	});
	
	
	router.get('/remove/:userID', function(req, res){ //server listens for get request from client
		var userID = req.params.userID;
		Scenes.find({userID : userID}, function(err, scenes){
			for(var i = 0; i < scenes.length; i++){
				console.log('scenes: ', scenes);
				//deleteFile('images/thumbnails/' + scenes[i]._id + '.png');
			}
			res.send(scenes);
		});
	});
	
	
	router.get('/scenes/:userID', function(req, res){ //server listens for get request from client
		var userID = req.params.userID;
		Scenes.find({userID : userID}, function(err, scenes){
			res.send(scenes);
		});
	});

	router.get('/scenes', function(req, res){ //server listens for get request from client
		//var userID = req.params.userID;
		Scenes.find({}, function(err, scenes){
			res.send(scenes);
		});
	});
	
	router.get('/scene/:id', function(req, res){
		var id = req.params.id;
		Scenes.findOne({_id : id}, function(err, scenes){  // this is a filter that compares 'id' in the parameter with _id in the database/********* Scenes *********/
			console.log('update ', scenes);
			/* Scenes.count({_id: id}, function(err, c){
				console.log('Count is ' + c);
			}); */
			res.send(scenes);
		 });
	});

	router.post('/upload', function(req, res){
		var canvasData = req.body.canvasData;
		var thumbnailUrl = req.body.id;
		var imageBuffer = decodeBase64Image(canvasData);
		console.log(imageBuffer);
		/*fs.writeFile(thumbnailUrl, imageBuffer.data, function(err) { 
			if(err){
				console.log(err);
			}else{
				console.log('file saved');
			}
		});*/
	});
	
	router.post('/uploadProfile', function(req, res){
		var path = '/images/profiles/',
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
	
	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		//successRedirect: '/',
		//failureRedirect: '/signup.html',
		//failureFlash : true 
	}), function(req, res){
		console.log('req.body: ', req.body);
		console.log('req.user ', req.user);
		res.json(req.user);
	});
	
	
	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		/*successRedirect: '/main.html',
		failureRedirect: '/',
		failureFlash : true  */
	}), function(req, res){
		console.log('req.body: ', req.body);
		console.log('req.user ', req.user);
		res.json(req.user);
	});
	
	router.post('/logout', function(req, res){
		req.logOut();
		//res.send(200);
		res.redirect('/');
	});

	router.get('/loggedin', function(req, res){
		res.send(req.isAuthenticated() ? req.user : '0');
	});
	
	/* Handle Login GET */
	router.get('/', function(req, res){
		console.log('router req.user: ', req.user);
		res.send({user: req.user});
	});
	
/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
/* Selected user */
	router.get('/user/:userID', function(req, res) {
		var userID = req.params.userID;
		Users.find({_id : userID}, function(err, user){
			res.send(user);
		});
	});
	
	router.get('/simuL8r', function(req, res) {
		if(req.isAuthenticated()){
			var filename = "./main.html";
			res.writeHead(200, {
				"Content-Type": "text/html"
			});
			fs.readFile(filename, "utf8", function(err, data) {
				if (err) throw err;
				res.write(data);
				res.end();
			});
		}else{
			res.redirect('/#/login');
		}
	});
	
	/***** facebook *****/
	
	// Redirect the user to Facebook for authentication.  When complete,
	// Facebook will redirect the user back to the application at
	//     /auth/facebook/callback
	router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	// Facebook will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	router.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/#/home',
										  failureRedirect: '/login' }));
	
	/***** GOOGLE *****/
	
	// Redirect the user to Google for authentication.  When complete, Google
	// will redirect the user back to the application at
	//     /auth/google/return
	router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	// Google will redirect the user to this URL after authentication.  Finish
	// the process by verifying the assertion.  If valid, the user will be
	// logged in.  Otherwise, authentication has failed.
	router.get('/auth/google/callback',
	  passport.authenticate('google', { successRedirect: '/#/home',
										failureRedirect: '/login' }));
		
	return router;
}
