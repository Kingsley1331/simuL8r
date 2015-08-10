function SimCtrl($scope, $http){

	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			return true;
		}else{// User is Not Authenticated
			location.replace('/');
		}
	});
	
	$scope.currentUser = {};
	
	
	
	$scope.simulation = shapeSelection;
	console.log('SimCtrl: ', $scope.simulation);
	
	$scope.scenes = {};
	$scope.currentThumbnail = {};//current thumbnail
	
	$scope.create = function(){
		$scope.simulation = shapeSelection;
		console.log('create: ', $scope.simulation);
		$http.post('/scenes', $scope.simulation)
		.success(function(response){
			//console.log('create response ', response);
			$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
			var thumbnailUrl = $scope.currentThumbnail[response._id];
			$scope.saveThumbnail(thumbnailUrl);
		});
		$scope.getAll();
	}

	$scope.select = function(id){
		$http.get('/scenes/' + id)
		.success(function(response){
			//console.log('response ', response);
			//alert(response);
			$scope.simulation = response;
			delete response._id;
			delete response.__v;
			delete response.userID;
			delete response.isPublic;
			console.log('select ', response);
			loadShapes(response);
		});
	}
	
	$scope.updateScene = function(id){
		$scope.simulation = shapeSelection;
		console.log('updateScene: ', $scope.simulation);
		$http.put('/scenes/' + id, $scope.simulation)
		.success(function(response){
			console.log('update ', response);
			$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
			var thumbnailUrl = $scope.currentThumbnail[response._id];
			$scope.saveThumbnail(thumbnailUrl);
		});
		//$scope.getAll();
	}
	
	$scope.remove = function(id){
		$http.delete('/scenes/' + id)
		.success(function(response){
			console.log('remove ', response);
		});
		$scope.getAll();
	}

	$scope.removeAll = function(){
		$http.delete('/scenes')
		.success(function(response){
			console.log('All scenes have been removed');
		});
		$scope.getAll();
	}
	
	$scope.getAll = function(){
		$http.get('/scenes')
		.success(function(response){
			console.log('create ', response);
			$scope.scenes = response;
		});
	}

	$scope.retrieve = function(id){
		clearAll(wallConfig);
		$scope.select(id);
	}
	
	$scope.newScene = function(){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;
		console.log('newScene: ', $scope.simulation);
	}
	
	$scope.saveThumbnail = function(id){
		var image = canvas.toDataURL('image/png');
		postData = {
					canvasData: image,
					id: id
				};
		 $http.post('/upload', postData)
		 .success(function(response){
			console.log('successful upload!');
		});
	}
	
	$scope.logout = function(){
		console.log('Simtroller logging out!!!');
		location.replace('/signout');
	}
	
	$scope.findCurrentUser = function(){
		$http.get('/loggedin').success(function(user){
			// User is Authenticated
			if(user !== '0'){
				$scope.currentUser = user;
				console.log('$scope.simulation: ', $scope.simulation);
				/*$scope.simulation.isPublic = true;
				$scope.simulation.userID = user._id;*/
				return user;
			}
		});
	}
	
	$scope.findCurrentUser();
}

