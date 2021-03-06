var app = angular.module('simuL8r', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
	.when('/home', {
		templateUrl: 'views/home.html',
		controller: 'HomeCtrl',
		resolve: {
			loginCheck: checkLoggedin
		}
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl'
	})
	.when('/profile', {
		templateUrl: 'views/profile.html',
		controller: 'ProfileCtrl',		
		resolve: {
			loginCheck: checkLoggedin
		}
	})
	.when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'SignupCtrl'
	})
	.when('/edit', {
		templateUrl: 'views/edit.html',
		controller: 'EditCtrl'
	})
	.when('/demos', {
		templateUrl: 'views/demos.html',
		controller: 'DemosCtrl'
	})
	.when('/simuL8r', {
		templateUrl: 'views/simuL8r.html',
		controller: 'SimCtrl'
	})	
	.otherwise({
		redirectTo: '/home'
	})
});

function checkLoggedin($q, $timeout, $http, $location, $rootScope){
	var deferred = $q.defer();
	$http.get('/loggedin').success(function(user){
		$rootScope.errorMessage = null;
		// User is Authenticated
		if(user !== '0'){
			$rootScope.currentUser = user;
			deferred.resolve();
		}else{// User is Not Authenticated
			$rootScope.errorMessage = 'You need to log in.';
			deferred.reject();
			$location.url('/login');
		}
	});
	
	return deferred.promise;
};