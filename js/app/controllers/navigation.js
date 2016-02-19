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