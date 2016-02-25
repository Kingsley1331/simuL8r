app.controller('EditCtrl', function($scope, $http, $rootScope, $location){
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			console.log('user', user);
			$rootScope.currentUser = user;
			console.log('id: ', $rootScope.currentUser._id);
			$rootScope.loggedin=true;
	
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
	console.log('uploader: ',uploader);
	//console.log('userObject: ',userObject);
	//userObject.setAttribute('value', 'usernameghgg');
	//console.log('userObject1: ',userObject);
	
	$scope.changeMessage = function(){
		if($scope.message === 'please enter a password'){
			$scope.inputClass = 'hiddenInput';
			$scope.message = 'passwords do not match!';
		}
	}
	
	$scope.signup = function(user){
		console.log(user);
		if($scope.newPassword === ''){
			$scope.inputClass = 'shownInput';
			$scope.message = 'please enter a password';
		}
		if($scope.newPassword === $scope.user.password){
			$http.post('/signup', user)
			.then(function(response){
				console.log('response: ', response);
				//var usernameVal = user.username;
				//var useridVal = response._id;
				var useridVal = response.data._id;
				console.log('useridVal: ', useridVal);
				alert(useridVal);
				//userObject.setAttribute('value', usernameVal);
				userId.setAttribute('value', useridVal);
				$rootScope.currentUser = user;
				//uploader.submit();
			}, function(err){
				alert('The username ' + '"' + user.username + '"' + ' already exists please enter a different one');
			});
		}
	}
	
	
	
	$scope.updateScene = function(id){
		//console.log('shapeSelection.name+++++++++++++++++++++++++++++++++++++++++++++++++++++++++', shapeSelection.name)
		var name = prompt("add or update this scene's name", shapeSelection.name);			
		if(!shapeSelection.name){
			shapeSelection.name = 'untitled';
		}
		
		var dataURL = canvas.toDataURL();
		shapeSelection.imageUrl = dataURL;
		shapeSelection.name = name;	
		$scope.simulation = shapeSelection;
		console.log('updateScene: ', $scope.simulation);			
				$http.put('/scenes/' + id, $scope.simulation)
				.success(function(response){
					console.log('update ', response);					
					//$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
					//var thumbnailUrl = $scope.currentThumbnail[response._id];
						$scope.getAll($scope.currentPageNumber);
						$scope.sceneName = response.name;
				});

	}	
	
	
	$scope.editUser = function(){
		console.log('editUser: ', $scope.user);			
		$http.put('/user/' + $rootScope.currentUser._id, $scope.user)
		.success(function(response){
			console.log('update ', response);
			var useridVal = response._id;
			userId.setAttribute('value', useridVal);
			uploader.submit();	
			$location.url('/home');			
		});
	}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});

