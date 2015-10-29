app.controller('ProfileCtrl', function($scope, $rootScope, $http){
	console.log('HomeCtrl');
	$rootScope.loggedin = true;
	$scope.userScenes = {};	
	$scope.showUserScenes = false;	
	/*$scope.showUsers = false;
	$scope.showUser = false;
	$scope.users = {};
	$scope.selectedUser = {};
	
	$scope.showScenes = false;

	$scope.scenes = {};

	$scope.selectedScene = {};
	$scope.userNames = {};	
	
	$scope.getUsers = function(){
		$http.get('/users').success(function(users){
		console.log('users: ', users);
		$scope.users = users;
			for(var i = 0; i < users.length; i++){
				if(users[i].local){
					$scope.userNames[users[i]._id] = users[i].local.username;
				}
				if(users[i].google){
					$scope.userNames[users[i]._id] = users[i].google.name;
				}
			}
		});
	}
	
	$scope.showAllUsers = function(deletingUser){
		$scope.showSelectedUserScenes = false;
		console.log('getting users');
		$scope.getUsers();
		if(deletingUser){
			$scope.showUsers = !$scope.showUsers;
		}
		$scope.showUser = false;	
	}

	$scope.showAllScenes = function(){
		$scope.getUsers();
		$http.get('/scenes')
		.success(function(response){
			console.log('getAllScenes ', response);
			$scope.scenes = response;
		});
		$scope.showScenes = !$scope.showScenes;		
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
		showSelectedUserScenes = false;
		$http.get('/user/' + id)
		.success(function(response){
			//console.log('selected user', response);
			console.log(response);
			$scope.selectedUser = response;
			$scope.showUsers = false;
			$scope.showUser = true;			 
			console.log('$scope.selectedUser: ', $scope.selectedUser);
		});
	}
			*/
	$scope.getUserScenes = function(id){
		//$scope.selectedUserScenes = {};
		$http.get('/scenes/' + id)
		.success(function(response){
			console.log('userScenes ', response);
			$scope.userScenes = response;
		});
		$scope.showUserScenes = !$scope.showUserScenes;
	}	

	$scope.getSelectedScene = function(id){
		location.replace('/simuL8r?id=' + id);		
	}
});