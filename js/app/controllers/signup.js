/*app.controller('SignupCtrl', function($scope, $http, $rootScope){
	$scope.user = {};
	var uploader = document.getElementById('uploadForm1');
	//var userObject = document.getElementById('username');
	var userId = document.getElementById('userid');
	console.log('uploader: ',uploader);
	//console.log('userObject: ',userObject);
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
			//var usernameVal = user.username;
			var useridVal = response._id;
			//userObject.setAttribute('value', usernameVal);
			userId.setAttribute('value', useridVal);
			$rootScope.currentUser = user;
			uploader.submit();
		});
	}
});*/

app.controller('SignupCtrl', function($scope, $http, $rootScope){
	$scope.user = {};
	var uploader = document.getElementById('uploadForm1');
	//var userObject = document.getElementById('username');
	var userId = document.getElementById('userid');
	console.log('uploader: ',uploader);
	//console.log('userObject: ',userObject);
	//userObject.setAttribute('value', 'usernameghgg');
	//console.log('userObject1: ',userObject);
	
	$scope.user.username = 'Kingsley3';
	$scope.user.password = '12345';
	$scope.user.email = 'k@a3.com';
	$scope.user.firstname = 'King';
	$scope.user.lastname = 'Ankomah';
	$scope.user.profilePic = 'profilePic'; 
	$scope.newPassword = '12345';
	$scope.message = 'passwords do not match!';
	$scope.inputClass = 'hiddenInput';
	
	$scope.changeMessage = function(){
		if($scope.message === 'please confirm the password' || $scope.message === 'please enter a password'){
			$scope.inputClass = 'hiddenInput';
			$scope.message = 'passwords do not match!';
		}
	}
	
	$scope.signup = function(user){
		console.log(user);
		if($scope.newPassword === ''){
			$scope.inputClass = 'shownInput';
			$scope.message = 'please confirm the password';
		}if($scope.user.password === ''){
			$scope.inputClass = 'shownInput';
			$scope.message = 'please enter a password';
		}
		
		if($scope.newPassword === $scope.user.password && $scope.user.password !== ''){
			$http.post('/signup', user)
			.then(function(response){
				console.log('response: ', response);
				//var usernameVal = user.username;
				//var useridVal = response._id;
				var useridVal = response.data._id;
				console.log('useridVal: ', useridVal);
				//userObject.setAttribute('value', usernameVal);
				userId.setAttribute('value', useridVal);
				$rootScope.currentUser = user;
				uploader.submit();
			}, function(err){
				alert('The username ' + '"' + user.username + '"' + ' already exists please enter a different one');
			});
		}
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

