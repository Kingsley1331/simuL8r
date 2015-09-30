app.controller('HomeCtrl', function($scope, $http){
	console.log('HomeCtrl');
	
	$scope.users = {};
	
	$scope.showAllUsers = function(){
		console.log('getting users');
		$http.get('/users').success(function(users){
			console.log('users: ', users);
			$scope.users = users;
		})
	}


});