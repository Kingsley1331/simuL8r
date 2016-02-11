app.controller('HomeCtrl', function($scope, $rootScope, $http){
	console.log('HomeCtrl');
	$rootScope.loggedin = true;
	$scope.showUsers = true;
	$scope.showUser = false;
	$scope.users = [];
	$scope.selectedUser = {};
	$rootScope.defaultPic = 'http://www.kingsleygames.co.uk/Apps/php_&_mysql/Targets/profiles/Default/Default.jpg';
	
	$scope.showScenes = false;
	$scope.showSelectedUserScenes = false;
	$scope.scenes = [];
	$scope.scenesNames = [{name:'blue bar'}, {name:'red'}, {name:'panda'}, {name:'bunny'}, {name:'dolphin'}];
	$scope.selectedUserScenes = {};
	$scope.selectedScene = {};
	$scope.userNames = {};
	
		/***********************************************************start pagination ******************************************************************/
	$scope.userPageSize = 5;
	$scope.currentUserPageNumber = 1;	
	$scope.currentUserPage = [];
	$scope.userPagesArray = [];
	$scope.numberOfUsers = 0;
	$scope.numberOfUserPages = 1;
	
	$scope.scenePageSize = 5;
	$scope.currentScenePageNumber = 1;	
	$scope.currentScenePage = [];
	$scope.scenePagesArray = [];
	$scope.numberOfScenes = 0;
	$scope.numberOfScenePages = 1;	
	
	$scope.userPageTurner = function(bool){
		if(bool === true){
			if($scope.currentUserPageNumber < $scope.numberOfUserPages){
				$scope.currentUserPageNumber++;
			}
		}else if(bool === false){
			if($scope.currentUserPageNumber > 1){
				$scope.currentUserPageNumber--;
			}
		}
		$scope.userPaginator($scope.currentUserPageNumber);
	}
	
	$scope.scenePageTurner = function(bool){
		if(bool === true){
			if($scope.currentScenePageNumber < $scope.numberOfScenePages){
				$scope.currentScenePageNumber++;
			}
		}else if(bool === false){
			if($scope.currentScenePageNumber > 1){
				$scope.currentScenePageNumber--;
			}
		}
		$scope.scenePaginator($scope.currentScenePageNumber);
	}	
		
	
	$scope.userPaginator = function(pageNumber){
		$scope.currentUserPageNumber = pageNumber;
		$scope.numberOfUsers = $scope.users.length;
		for(var j = 0; j < $scope.numberOfUsers; j++){
			$scope.currentUserPage[j] = $scope.users[j];
		}		
		$scope.numberOfUserPages = Math.ceil($scope.numberOfUsers / $scope.userPageSize);
		var firstUserIndex = (pageNumber - 1) * $scope.userPageSize;
		$scope.currentUserPage.splice(0, firstUserIndex);	
	}	
	
	$scope.scenePaginator = function(pageNumber){
		console.log('pageNumber ', pageNumber);
		$scope.currentScenePageNumber = pageNumber;
		$scope.numberOfScenes = $scope.scenes.length;
		for(var j = 0; j < $scope.numberOfScenes; j++){
			$scope.currentScenePage[j] = $scope.scenes[j];
		}		
		$scope.numberOfScenePages = Math.ceil($scope.numberOfScenes / $scope.scenePageSize);
		var firstSceneIndex = (pageNumber - 1) * $scope.scenePageSize;
		console.log('firstSceneIndex ', firstSceneIndex)
		$scope.currentScenePage.splice(0, firstSceneIndex);
		console.log('currentScenePage ', $scope.currentScenePage.length);
	}	


	setTimeout(function(){
		$scope.addPageEventListeners()
	}, 500);


$scope.addPageEventListeners = function(){
	var pages = $('.pagination > li');	
	$('#1').addClass('active');	
	$('#1_scene').addClass('active');	
	pages.click(function(){
		pages.each(function(index){
			if($(this).hasClass('li_user')){
				if($(this).attr('id') == $scope.currentUserPageNumber){
					$(this).addClass('active');					
				}else{
					$(this).removeClass('active');
				}
			}else if($(this).hasClass('li_scene')){
					if($(this).attr('id') == $scope.currentScenePageNumber + '_scene'){
					$(this).addClass('active');					
				}else{
					$(this).removeClass('active');
				}
			}			
		});			
		$(this).addClass('active');
		$('#prev').removeClass('active');
		$('#next').removeClass('active');
		$('#Sprev').removeClass('active');
		$('#Snext').removeClass('active');						
	});	
}


				
	$scope.usersPageNavigator = function(){
		for(var i = 0; i < $scope.numberOfUserPages; i++){
			$scope.userPagesArray[i] = i;
		}
	}
	
	$scope.scenesPageNavigator = function(){
		for(var i = 0; i < $scope.numberOfScenePages; i++){
			$scope.scenePagesArray[i] = i;
		}
	}	
		
		/***********************************************************end pagination ******************************************************************/	
	
	
	
	$scope.getUsers = function(){
		$http.get('/users').success(function(users){
			console.log('users: ', users);
			$scope.users = users;
			$scope.numberOfUsers = users.length;
			for(var j = 0; j < $scope.numberOfUsers; j++){
				$scope.currentUserPage[j] = $scope.users[j];
			}
			for(var i = 0; i < users.length; i++){
				if(users[i].local){
					$scope.userNames[users[i]._id] = users[i].local.username;
				}
				if(users[i].google){
					$scope.userNames[users[i]._id] = users[i].google.name;
				}
			}
			$scope.numberOfUserPages = Math.ceil($scope.numberOfUsers / $scope.userPageSize);
			$scope.usersPageNavigator();
		});
	}
	
	$scope.getUsers();
		
	$('#usersTab').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
	$scope.showAllUsers = function(){
		$scope.showSelectedUserScenes = false;
		console.log('getting users');
		$scope.getUsers();
		$scope.showUsers = true;
		$scope.showUser = false;
		$scope.showScenes = false;
		$('#usersTab').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
		$('#scenesTab').css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
	}

	$scope.showAllScenes = function(bool){
		//$scope.getUsers();
		$http.get('/scenes')
		.success(function(response){
			console.log('getAllScenes ', response);
			$scope.scenes = response;
			$scope.numberOfScenes = response.length;
			for(var j = 0; j < $scope.numberOfScenes; j++){
				$scope.currentScenePage[j] = $scope.scenes[j];
			}
			console.log('numberOfScenes', $scope.numberOfScenes);
			console.log('scenePageSize', $scope.scenePageSize);
			$scope.numberOfScenePages = Math.ceil($scope.numberOfScenes / $scope.scenePageSize);
			$scope.scenesPageNavigator();	
		});	
		$scope.showScenes = bool;
		$scope.showUsers = !bool;
		if(bool === true){
			$('#scenesTab').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
			$('#usersTab').css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});	
		}else{
			$('#usersTab').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
			$('#scenesTab').css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
		}	
	}	
	$scope.showAllScenes();

	
	$scope.remove = function(id){
		var deleteUser = confirm('Are you sure you want to delete this user');
		//alert(deleteUser);
		console.log('User id: ',id);
		if(deleteUser){
			$http.delete('/user/' + id)
			.success(function(response){
				console.log('delete ', response);
				$scope.showAllUsers(false);
			});
		}
	}

	$scope.selectUser = function(id){
		showSelectedUserScenes = false;
		$http.get('/user/' + id)
		.success(function(response){
			//console.log('selected user', response);
			console.log(response);
			$scope.selectedUser = response;
			
			/*$scope.$watch('selectedUser', function(){
				$scope.selectedUser = response;
				//alert('selectedUser has changed');
		   });*/
			$scope.showUsers = false;
			$scope.showUser = true;	
			$scope.getSelectUserScenes(id);		
			console.log('$scope.selectedUser: ', $scope.selectedUser);
		});
	}
	
	$scope.getSelectUserScenes = function(id){
		//$scope.selectedUserScenes = {};
		$http.get('/scenes/' + id)
		.success(function(response){
			console.log('getSelectUserScenes ', response);
			$scope.selectedUserScenes = response;
		});
		$scope.showSelectedUserScenes = !$scope.showSelectedUserScenes;
	}	
	
	$scope.getSelectedScene = function(id){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;		
		location.replace('#/simuL8r?id=' + id);		
	}
	
	var usersTab = $('#usersTab');
	var scenesTab = $('#scenesTab');
	
	function toggleTabs(tab){
		tab.mouseenter(function(){
			tab.css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
		});	
		tab.mouseleave(function(){
			if(tab == usersTab){
				if(!$scope.showUsers){
					tab.css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
				}
			}else if(tab == scenesTab){
				if(!$scope.showScenes){
					tab.css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
				}				
			}
		});			
	}
	
	toggleTabs(usersTab);
	toggleTabs(scenesTab);	
});
