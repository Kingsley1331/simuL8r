app.controller('SignupCtrl', function($scope, $http, $rootScope){
	$scope.user = {};
	
	$scope.user.username = 'Kingsley3';
	$scope.user.password = '12345';
	$scope.user.email = 'k@a3.com';
	$scope.user.firstname = 'King';
	$scope.user.lastname = 'Ankomah';
	
	$scope.signup = function(user){
		console.log(user);
		$http.post('/signup', user)
		.success(function(response){
			console.log('response: ', response);
			$rootScope.currentUser = user;
		});
	}
});