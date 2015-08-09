app.controller('NavCtrl', function($scope, $rootScope, $http, $location){
	$scope.logout = function(){
		$http.post('/logout')
		.success(function(){
			$rootScope.currentUser = null;
			console.log('logging out!!!');
			$location.url('/home');
		});
	}
})