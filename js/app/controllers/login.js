app.controller('LoginCtrl', function($scope, $http, $rootScope, $location){
	$scope.user = {};
	$scope.user.username = 'Kingsley';
	$scope.user.password = '12345';
	console.log('login');
	$scope.login = function(user){
		console.log(user);
		$http.post('/login', user)
		.then(function(response){
			console.log('response: ', response);
			$rootScope.currentUser = user;
			$rootScope.loggedin = true;
			//alert('loggedin');
			console.log('$rootScope.currentUser: ', $rootScope.currentUser)
			//location.replace('/simuL8r');
			location.replace('#/home');
			//$location.url('/profile');
			setTimeout($rootScope.setNav, 500);
		}, function(err){
			alert(user.username + ' was not recognized, please try again.');
		});
	}
});