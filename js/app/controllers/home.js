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

	$scope.remove = function(id){
		console.log('User id: ',id);
		$http.delete('/user/' + id)
		.success(function(response){
			console.log('delete ', response);
			$scope.showAllUsers();
		});
	}
	
});