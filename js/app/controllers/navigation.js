app.controller('NavCtrl', function($scope, $rootScope, $http, $location){
	/** put this in a service **/
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			$rootScope.currentUser = user;
			$rootScope.loggedin=true;
		}else if(user == '0'){// User is Not Authenticated
			$rootScope.loggedin=false;
		}
	});		
	
	$scope.logout = function(){
		$http.post('/logout')
		.success(function(){
			$rootScope.currentUser = null;
			$rootScope.loggedin = false;
			console.log('logging out!!!');
			$location.url('/home');
		});
	}
	
	$rootScope.setNav = function(){
		$('ul.sidebar-menu > li').removeClass('active');
		$('ul.sidebar-menu > li').click(function(){
			$('ul.sidebar-menu > li').removeClass('active');
			$(this).addClass('active');	
		});
		if($location.url() === '/profile'){
			$('#profile-view').addClass('active');
		}
		if($location.url() === '/demos'){
			$('#demos-view').addClass('active');
		}
		if($location.url() === '/home'){
			$('#home-view').addClass('active');
		}
	}
	
	setTimeout($rootScope.setNav, 500);	
	
	
	
	//navigation
	/*setTimeout(function setNav(){
		$('ul.sidebar-menu > li').click(function(){
			$('ul.sidebar-menu > li').removeClass('active');
			$(this).addClass('active');	
		});
		if($location.url() === '/profile'){
			$('#profile-view').addClass('active');
		}
		if($location.url() === '/demos'){
			$('#demos-view').addClass('active');
		}
		if($location.url() === '/home'){
			$('#home-view').addClass('active');
		}
	}, 500);*/	
})