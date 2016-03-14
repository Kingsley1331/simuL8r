app.controller('EditCtrl', function($scope, $http, $rootScope, $location){
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			console.log('user', user);
			$rootScope.currentUser = user;
			console.log('id: ', $rootScope.currentUser._id);
			$rootScope.loggedin = true;	
			$scope.user.username = $rootScope.currentUser.local.username;
			$scope.user.password = '';
			$scope.user.email = $rootScope.currentUser.local.email;
			$scope.user.firstname = $rootScope.currentUser.local.firstname;
			$scope.user.lastname = $rootScope.currentUser.local.lastname;
			$scope.user.profilePic = 'profilePic'; 
			$scope.newPassword = '';
			$scope.message = 'passwords do not match!';
			$scope.inputClass = 'hiddenInput';						
		}else if(user == '0'){// User is Not Authenticated
			$rootScope.loggedin=false;
		}
	});	
	
	$scope.user = {};
	var uploader = document.getElementById('uploadForm1');
	//var userObject = document.getElementById('username');
	var userId = document.getElementById('userid');
	console.log('uploader: ', uploader);
	//console.log('userObject: ',userObject);
	//userObject.setAttribute('value', 'usernameghgg');
	//console.log('userObject1: ',userObject);
	
	$scope.changeMessage = function(){
		if($scope.message === 'please enter a password'){
			$scope.inputClass = 'hiddenInput';
			$scope.message = 'passwords do not match!';
		}
	}
	
	$scope.fileData;
	$scope.getFileData = function(files){
		console.log(files);
		$scope.fileData = files;
	}
	
	$scope.editUser = function(){
		console.log('editUser: ', $scope.user);			
		$http.put('/user/' + $rootScope.currentUser._id, $scope.user)
		.success(function(response){
			console.log('update ', response);
			var useridVal = response._id;
			userId.setAttribute('value', useridVal);
			//console.log($scope.fileData[0].name);
			if($scope.fileData !== undefined){
				alert('submiting');
				uploader.submit();	
			}
			$location.url('/home');			
		});
	}	
});

