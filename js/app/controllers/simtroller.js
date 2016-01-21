simApp.controller('SimCtrl', function($scope, $http){
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			return true;
		}else{// User is Not Authenticated
			location.replace('/');
		}
	});
	
	$scope.currentScene = '';
	
	
	$scope.showSceneTable = false;
	$scope.scenesVisibility = 'show scenes';
	
	$scope.toggleSceneTable = function(){
		if(!$scope.showSceneTable){
			$scope.showSceneTable = true;
			$scope.scenesVisibility = 'hide scenes';			
		}else if($scope.showSceneTable){
			$scope.showSceneTable = false;
			$scope.scenesVisibility = 'show scenes';			
		}
	}
	
	$scope.currentUser = {};
	
	$scope.simulation = shapeSelection;
	console.log('SimCtrl: ', $scope.simulation);
	
	$scope.scenes = {};
	$scope.currentThumbnail = {};//current thumbnail
	
	$scope.create = function(){
		var name = prompt('please choose a name for this scene', 'untitled');
		
		if(name !== ''){
			shapeSelection.name = name;
		}
		var dataURL = canvas.toDataURL();
		shapeSelection.imageUrl = dataURL;
		
		//console.log('imageUrl', shapeSelection.imageUrl);
		
		$scope.simulation = shapeSelection;
		console.log('create: ', $scope.simulation);

		$http.post('/scenes', $scope.simulation)
		.success(function(response){
			//console.log('create_response: ', response);
			console.log(response);			
			$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
			var thumbnailUrl = $scope.currentThumbnail[response._id];
			//$scope.saveThumbnail(thumbnailUrl);
		});
		$scope.getAll();
	}
	//positions all elements retrieved from the database relative to the bottom of the canvas
	function shifter(currentCanvas, dbCanvas, shapes){
		var width = dbCanvas.width;
		var height = dbCanvas.height;
		var innerHeight = window.innerHeight;
		var innerWidth = window.innerWidth;
		
		if(dbCanvas.width <= innerWidth && currentCanvas.width > innerWidth ){
			setCanvasSize(canvas, innerWidth, innerHeight);
			setCanvasSize(bufferCanvas, innerWidth, innerHeight);	
			currentCanvas.height = innerHeight;
		}
		
		var heightDiff = currentCanvas.height - dbCanvas.height;
		if(heightDiff > 0){
			for(var e in shapes){
				var len = shapes[e][2].length;
				for(var i = 0; i < len; i++){
					shapes[e][2][i].Y += heightDiff;
				}
			}
		}else if(heightDiff < 0){	
			setCanvasSize(canvas, width, height);
			setCanvasSize(bufferCanvas, width, height);			
		}
	}

	$scope.select = function(id){
		$http.get('/scene/' + id)
		.success(function(response){
			//console.log('response ', response);
			//alert(response);
			$scope.simulation = response;
			console.log('id ', id);//5623da04562dc2301b1a1e74
			delete response._id;
			delete response.__v;
			console.log('select ', response);
			shapeSelection.name = response.name;
			var canvas = shapeSelection.canvas;
			var dbCanvas = response.canvas;
			var shapes = response.shapes;
			console.log('canvas: ', canvas);
			console.log('response: ', response);
			console.log('dbCanvas: ', dbCanvas);
			if(response.canvas){
				shifter(canvas, dbCanvas, shapes);
			}
			loadShapes(response);
			wallMaker();
		});
	}
	
	$scope.updateScene = function(id){
		//console.log('shapeSelection.name+++++++++++++++++++++++++++++++++++++++++++++++++++++++++', shapeSelection.name)
		var name = prompt("add or update this scene's name", shapeSelection.name);			
		if(!shapeSelection.name){
			shapeSelection.name = 'untitled';
		}
		
		var dataURL = canvas.toDataURL();
		shapeSelection.imageUrl = dataURL;
		shapeSelection.name = name;	
		$scope.simulation = shapeSelection;
		console.log('updateScene: ', $scope.simulation);			
				$http.put('/scenes/' + id, $scope.simulation)
				.success(function(response){
					console.log('update ', response);
					
					$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
					var thumbnailUrl = $scope.currentThumbnail[response._id];
					//$scope.saveThumbnail(thumbnailUrl);
					$scope.getAll();
				});

	}
	
	$scope.remove = function(id){
		var deleteScene = confirm('Are you sure you want to delete this scene?');
		if (deleteScene){
			$http.delete('/scene/' + id)
			.success(function(response){
				console.log('remove ', response);
			});
			$scope.getAll();
		}
	}
	
	$scope.removeAll = function(){
		$http.delete('/scenes/' + $scope.simulation.userID)
		.success(function(response){
			console.log('All scenes have been removed');
		});
		$scope.getAll();
	}
		
	$scope.getAll = function(){
		$scope.simulation = shapeSelection;
		$http.get('/scenes/' + $scope.simulation.userID)
		.success(function(response){
			console.log('getAll ', response);
			$scope.scenes = response;
		});
	}
	
	$scope.removeAllScenes = function(){
		var deleteAllScenes = confirm('Are you sure you want to delete all scenes?');
		if(deleteAllScenes){
			$http.get('/remove/' + $scope.simulation.userID)
			.success(function(response){
				$scope.removeAll();
				console.log('remove ', response);
			});
		}
	}
	
	
	$scope.retrieve = function(id){
		clearAll(wallConfig);
		$scope.select(id);
		$scope.currentScene = id;
	}
	
	$scope.refresh = function(id){
		if($scope.currentScene !== ''){
		clearAll(wallConfig);
		$scope.select(id);
		}
	}
	
	
	$scope.newScene = function(){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;
		console.log('newScene: ', $scope.simulation);
	}
	
	/*$scope.saveThumbnail = function(id){
		var image = canvas.toDataURL('image/png');
		postData = {
					canvasData: image,
					id: id
				};
		 $http.post('/upload', postData)
		 .success(function(response){
			console.log('successful upload!');
		});
	}*/
	
	$scope.logout = function(){
		console.log('Simtroller logging out!!!');
		location.replace('/signout');
	}
	
	$scope.findCurrentUser = function(){
		$http.get('/loggedin').success(function(user){
			// User is Authenticated
			if(user !== '0'){
				$scope.currentUser = user;
				shapeSelection.userID = user._id;
				console.log('$scope.simulation: ', $scope.simulation);
				console.log('$scope.currentUser: ', $scope.currentUser);
				console.log('user: ', user);
				/*$scope.simulation.isPublic = true;
				$scope.simulation.userID = user._id;*/
				return user;
			}
		});
	}
	
	console.log('getQueryVariable: ', getQueryVariable('id'));
	
	// load scenes from id value in querystring
	$scope.loadSelectedScene = function(){
		id = getQueryVariable('id');
		console.log('loadSelectedScene id', id);
		$scope.select(id);
	}
	
	$scope.loadSelectedScene();
	
	$scope.findCurrentUser();

});
