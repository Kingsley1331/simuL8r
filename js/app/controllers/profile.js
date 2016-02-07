app.controller('ProfileCtrl', function($scope, $location, $rootScope, $http){
	console.log('HomeCtrl');
	$rootScope.loggedin = true;
	$scope.userScenes = {};	
	$scope.showUserScenes = true;	
	$scope.remove = function(id){
		var deleteUser = confirm('Are you sure you want to delete your account?');
		//alert(deleteUser);
		console.log('User id: ',id);
		if(deleteUser){
			$http.delete('/user/' + id)
			.success(function(response){
				console.log('delete ', response);
				$scope.logout();		
			});
		}
	}			
		
	$scope.logout = function(){
		$rootScope.loggedin = false;
		$http.post('/logout')
		.success(function(){
			$rootScope.currentUser = null;
			$rootScope.loggedin = false;
			console.log('logging out!!!');
			$location.url('/home');
		});
	}

		
	$scope.getUserScenes = function(id){
		//$scope.selectedUserScenes = {};
		$http.get('/scenes/' + id)
		.success(function(response){
			console.log('userScenes ', response);
			$scope.userScenes = response;
		});
		//$scope.showUserScenes = !$scope.showUserScenes;
	}	

	$scope.getSelectedScene = function(id){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;		
		location.replace('#/simuL8r?id=' + id);		
	}
	
	$scope.getUserScenes($rootScope.currentUser._id);
});