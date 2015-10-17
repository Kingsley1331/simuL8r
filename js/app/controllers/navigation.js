app.controller('NavCtrl', function($scope, $rootScope, $http, $location){
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
})