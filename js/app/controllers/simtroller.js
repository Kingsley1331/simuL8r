function SimCtrl($scope, $http){
	$scope.simulation = shapeSelection;
	console.log('SimCtrl: ', $scope.simulation);
	
	$scope.scenes = {};
	
	$scope.create = function(){
		$scope.simulation = shapeSelection;
		console.log('create: ', $scope.simulation);
		$http.post('/scenes', $scope.simulation)
		.success(function(response){
			console.log('create response ', response);
		});
		$scope.getAll();
	}
	
	$scope.select = function(id){
		$http.get('/scenes/' + id)
		.success(function(response){
			$scope.simulation = response;
			delete response._id;
			delete response.__v;
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
		});
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
	
}