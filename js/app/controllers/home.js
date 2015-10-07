app.controller('HomeCtrl', function($scope, $http){
	console.log('HomeCtrl');
	
	$scope.showUsers = false;
	$scope.showUser = false;
	$scope.users = {};
	$scope.selectedUser = {};
	
	$scope.showAllUsers = function(deletingUser){
		console.log('getting users');
		$http.get('/users').success(function(users){
			console.log('users: ', users);
			$scope.users = users;
		});
		if(deletingUser){
			$scope.showUsers = !$scope.showUsers;
		}
		$scope.showUser = false;	
	}

	
	$scope.remove = function(id){
		var deleteUser = confirm('Are you sure you want to delete this user');
		//alert(deleteUser);
		console.log('User id: ',id);
		if(deleteUser){
			$http.delete('/user/' + id)
			.success(function(response){
				console.log('delete ', response);
				$scope.showAllUsers(false);
			});
		}
	}

	$scope.selectUser = function(id){
		$http.get('/user/' + id)
		.success(function(response){
			//console.log('selected user', response);
			console.log(response);
			$scope.selectedUser = response;
			
			/*$scope.$watch('selectedUser', function(){
				$scope.selectedUser = response;
				//alert('selectedUser has changed');
		   });*/
			$scope.showUsers = false;
			$scope.showUser = true;			 
			console.log('$scope.selectedUser: ', $scope.selectedUser);
		});
	}
});