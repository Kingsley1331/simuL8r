app.controller('DemosCtrl', function($scope, $rootScope, $http, $window){
	console.log('$rootScope.loggedin ', $rootScope.loggedin);
	console.log('$rootScope.currentUser ', $rootScope.currentUser);	
	$scope.demoScenes = {};
	// newscene function 
	clearAll(wallConfig);
	//$scope.simulation = shapeSelection;
	
	$scope.getSelectedScene = function(id){
		var path ='#/simuL8r?id=' + id;
		$window.location.href = path;	
	}
	
	$scope.getDemoScenes = function(){
		$http.get('/scenes/56c7b7c287b16ffc197f1654')
		.success(function(response){
			console.log('getDemoScenes ', response);
			$scope.demoScenes = response;
		});
	}	

	$scope.getDemoScenes();	

});