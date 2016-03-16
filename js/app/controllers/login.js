app.controller('LoginCtrl', function($scope, $http, $rootScope, $location, $timeout){
	$scope.user = {};
	$scope.user.username = '';
	$scope.user.password = '';
	console.log('login');
	var ua = window.navigator.userAgent;
	var ie = ua.indexOf("MSIE");
	var edge = ua.indexOf("Edge");
	
	
	// if internet explorer or Edge
	 if(ie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || navigator.appName == "Netscape" && (navigator.appVersion.indexOf('Trident') === -1) && edge !== -1){
		if($location.search().rl != 1){
			$timeout(function(){
				location.reload();
				location.replace('https://intense-atoll-8693.herokuapp.com/#/login?rl=1');
				if($rootScope.loggedin === true){
					location.replace('https://intense-atoll-8693.herokuapp.com/#/home');
				}
			}, 100);	
		}
	}
	
	$scope.login = function(user){
		console.log(user);
		$http.post('/login', user)
		.then(function(response){
			console.log('response: ', response);
			$rootScope.currentUser = user;
			$rootScope.loggedin = true;
			//alert('loggedin');
			console.log('$rootScope.currentUser: ', $rootScope.currentUser)
			$location.url('/home');
			$timeout($rootScope.setNav, 500);
		}, function(err){
			alert(user.username + ' was not recognized, please try again.');
		});
	}
	

	
	function centerForm(){
		var windowWidth = window.innerWidth;
		$('.col-lg-4').css('position', 'absolute');
		var formWidth = $('.panel-green').css('width').replace('px','');
		var left = (windowWidth - formWidth) / 2;
		if(windowWidth < 1070){left += 100}
		if(windowWidth < 768){left -= 100}
		$('.col-lg-4').css({'left' :  left + 'px'});
	}
	
	centerForm();
	
	$(window).resize(function(){
		centerForm();
	});
	
	
});