app.controller('DemosCtrl', function($scope, $rootScope, $http, $window){
	/** put this in a service **/
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			$rootScope.currentUser = user;
			$rootScope.loggedin=true;
		}else if(user == '0'){// User is Not Authenticated
			$rootScope.loggedin=false;
		}
	});	

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
		$http.get('/scenes/56ccce1e088555030081f894')
		.success(function(response){
			console.log('getDemoScenes ', response);
			$scope.demoScenes = response;
		});
	}	

	$scope.getDemoScenes();	

});