app.controller('HomeCtrl', function($scope, $rootScope, $http){
	console.log('HomeCtrl');
	setTimeout($rootScope.setNav, 500);
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
	
	$scope.selU_scenePageSize = 5;
	$scope.selU_currentScenePageNumber = 1;	
	$scope.selU_currentScenePage = [];
	$scope.selU_scenePagesArray = [];
	$scope.selU_numberOfScenes = 0;
	$scope.selU_numberOfScenePages = 1;		
	
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
		
	$scope.selU_scenePageTurner = function(bool){
		if(bool === true){
			if($scope.selU_currentScenePageNumber < $scope.selU_numberOfScenePages){
				$scope.selU_currentScenePageNumber++;
			}
		}else if(bool === false){
			if($scope.selU_currentScenePageNumber > 1){
				$scope.selU_currentScenePageNumber--;
			}
		}
		$scope.selU_scenePaginator($scope.selU_currentScenePageNumber);
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
		$scope.currentScenePageNumber = pageNumber;
		$scope.numberOfScenes = $scope.scenes.length;
		for(var j = 0; j < $scope.numberOfScenes; j++){
			$scope.currentScenePage[j] = $scope.scenes[j];
		}		
		$scope.numberOfScenePages = Math.ceil($scope.numberOfScenes / $scope.scenePageSize);
		var firstSceneIndex = (pageNumber - 1) * $scope.scenePageSize;
		$scope.currentScenePage.splice(0, firstSceneIndex);
	}	

	$scope.selU_scenePaginator = function(pageNumber){
		$scope.selU_currentScenePageNumber = pageNumber;
		$scope.selU_numberOfScenes = $scope.selectedUserScenes.length;
		for(var j = 0; j < $scope.selU_numberOfScenes; j++){
			$scope.selU_currentScenePage[j] = $scope.selectedUserScenes[j];
		}		
		$scope.selU_numberOfScenePages = Math.ceil($scope.selU_numberOfScenes / $scope.selU_scenePageSize);
		var firstSceneIndex = (pageNumber - 1) * $scope.selU_scenePageSize;
		$scope.selU_currentScenePage.splice(0, firstSceneIndex);
	}
	
	setTimeout(function(){
		$scope.addPageEventListeners()
	}, 500);


$scope.addPageEventListeners = function(){
	var pages = $('.pagination > li');	
	$('#1').addClass('active');	
	$('#1_scene').addClass('active');
	$('#1selU_scene').addClass('active');	
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
			}else if($(this).hasClass('selU_scene')){
					if($(this).attr('id') == $scope.selU_currentScenePageNumber + 'selU_scene'){
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
		$('#selU_prev').removeClass('active');
		$('#selU_next').removeClass('active');		
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
		
	$scope.selU_scenesPageNavigator = function(){
		for(var i = 0; i < $scope.selU_numberOfScenePages; i++){
			$scope.selU_scenePagesArray[i] = i;
		}
		console.log('selU_scenePagesArray ', $scope.selU_scenePagesArray);
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
			$scope.numberOfScenePages = Math.ceil($scope.numberOfScenes / $scope.scenePageSize);
			$scope.scenesPageNavigator();
			setTimeout(function(){
				$scope.addPageEventListeners();
			}, 500);			
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
			
			$scope.selU_numberOfScenes = response.length;
			for(var j = 0; j < $scope.selU_numberOfScenes; j++){
				$scope.selU_currentScenePage[j] = $scope.selectedUserScenes[j];
			}
			$scope.selU_numberOfScenePages = Math.ceil($scope.selU_numberOfScenes / $scope.selU_scenePageSize);
			$scope.selU_scenesPageNavigator();	
			setTimeout(function(){
				$scope.addPageEventListeners();
			}, 500);
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
	/*** put this into a service ***/
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
