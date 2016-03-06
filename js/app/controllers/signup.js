app.controller('SignupCtrl', function($scope, $http, $rootScope){
	$scope.user = {};
	var uploader = document.getElementById('uploadForm1');
	var userId = document.getElementById('userid');
	console.log('uploader: ',uploader);
	
	$scope.user.username = '';
	$scope.user.password = '';
	$scope.user.email = '';
	$scope.user.firstname = '';
	$scope.user.lastname = '';
	$scope.user.profilePic = 'profilePic'; 
	$scope.newPassword = '';
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
				var useridVal = response.data._id;
				console.log('useridVal: ', useridVal);
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

