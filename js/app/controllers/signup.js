app.controller('SignupCtrl', function($scope, $http, $rootScope){
	$scope.user = {};
	var uploader = document.getElementById('uploadForm1');
	var userObject = document.getElementById('username');
	console.log('uploader: ',uploader);
	console.log('userObject: ',userObject);
	//userObject.setAttribute('value', 'usernameghgg');
	//console.log('userObject1: ',userObject);
	
	$scope.user.username = 'Kingsley3';
	$scope.user.password = '12345';
	$scope.user.email = 'k@a3.com';
	$scope.user.firstname = 'King';
	$scope.user.lastname = 'Ankomah';
	$scope.user.profilePic = 'profilePic'; 
	
	$scope.signup = function(user){
		console.log(user);
		$http.post('/signup', user)
		.success(function(response){
			console.log('response: ', response);
			var usernameVal = user.username;
			userObject.setAttribute('value', usernameVal);
			$rootScope.currentUser = user;
			uploader.submit();
		});
	}
});