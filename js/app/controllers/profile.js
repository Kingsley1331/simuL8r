app.controller('ProfileCtrl', function($scope, $location, $rootScope, $http){
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
	console.log('HomeCtrl');
	$scope.userScenes = {};	
	$scope.showUserScenes = true;	
	
		/***********************************************************start pagination ******************************************************************/
	$scope.pageSize = 5;
	$scope.currentPageNumber = 1;	
	$scope.currentPage = [];
	$scope.pagesArray = [];
	$scope.numberOfScenes = 0;
	$scope.numberOfPages = 1;
	$scope.showPageNav = false;	
	
	$scope.pageTurner = function(bool){
		if(bool === true){
			if($scope.currentPageNumber < $scope.numberOfPages){
				$scope.currentPageNumber++;
			}
		}else if(bool === false){
			if($scope.currentPageNumber > 1){
				$scope.currentPageNumber--;
			}
		}
		$scope.paginator($scope.currentPageNumber);
	}
		
	$scope.paginator = function(pageNumber){
		$scope.currentPageNumber = pageNumber;
		$scope.numberOfScenes = $scope.userScenes.length;
		for(var j = 0; j < $scope.numberOfScenes; j++){
			$scope.currentPage[j] = $scope.userScenes[j];
		}		
		$scope.numberOfPages = Math.ceil($scope.numberOfScenes / $scope.pageSize);
		var firstUserIndex = (pageNumber - 1) * $scope.pageSize;
		$scope.currentPage.splice(0, firstUserIndex);	
	}	
		
	setTimeout(function(){
		$scope.addPageEventListeners()
	}, 500);


$scope.addPageEventListeners = function(){
	var pages = $('.pagination > li');	
	$('#1').addClass('active');	
	pages.click(function(){
		pages.each(function(index){
			if($(this).hasClass('li_user')){
				if($(this).attr('id') == $scope.currentPageNumber){
					$(this).addClass('active');					
				}else{
					$(this).removeClass('active');
				}
			}		
		});			
		$(this).addClass('active');
		$('#prev').removeClass('active');
		$('#next').removeClass('active');		
	});	
}
	$scope.pageNavigator = function(){
		for(var i = 0; i < $scope.numberOfPages; i++){
			$scope.pagesArray[i] = i;
		}
	}				
		
		/***********************************************************end pagination ******************************************************************/		
	

	$scope.remove = function(id){
		var deleteUser = confirm('Are you sure you want to delete your account?');
		//alert(deleteUser);
		console.log('User id: ',id);
		if(deleteUser){
			$http.delete('/user/' + id)
			.success(function(response){
				console.log('delete ', response);
				$scope.logout();		
			});
		}
	}			
		
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

		
	$scope.getUserScenes = function(id){
		//$scope.selectedUserScenes = {};
		$http.get('/scenes/' + id)
		.success(function(response){
			console.log('userScenes ', response);
			$scope.userScenes = response;
			
			$scope.numberOfScenes = response.length;
			for(var j = 0; j < $scope.numberOfScenes; j++){
				$scope.currentPage[j] = $scope.userScenes[j];
			}			
			
			$scope.numberOfPages = Math.ceil($scope.numberOfScenes / $scope.pageSize);
			if($scope.numberOfPages > 1){
				$scope.showPageNav = true;
			}
			$scope.pageNavigator();
		});
		//$scope.showUserScenes = !$scope.showUserScenes;
	}	

	$scope.getSelectedScene = function(id){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;		
		location.replace('#/simuL8r?id=' + id);		
	}
	
	$scope.getUserScenes($rootScope.currentUser._id);
});