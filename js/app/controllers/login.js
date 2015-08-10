app.controller('LoginCtrl', function($scope, $http, $rootScope, $location){
	$scope.user = {};
	$scope.user.username = 'Kingsley';
	$scope.user.password = '12345';

	$scope.login = function(user){
		console.log(user);
		$http.post('/login', user)
		.success(function(response){
			console.log('response: ', response);
			$rootScope.currentUser = user;
			location.replace('/simuL8r');
			//$location.url('/profile');
		});
	}
});