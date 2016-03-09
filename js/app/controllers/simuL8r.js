app.controller('SimCtrl', function($scope, $http, $location, $window, $rootScope, $timeout){
	physics = false;
	$scope.playIcon = 'https://s3.amazonaws.com/simuL8rBucket/images/icons/play.png';
	$scope.play = false;
	$scope.checkPlay = function(bool){
		if($scope.play === false || bool === false){
			$scope.playIcon = 'https://s3.amazonaws.com/simuL8rBucket/images/icons/play.png';
		}else if($scope.play === true || bool === true){
			$scope.playIcon = 'https://s3.amazonaws.com/simuL8rBucket/images/icons/pause.png';
		}
	}
	
	
	$scope.hasRemoteTableLoaded = false; 
	$scope.hasLocalTableLoaded = false; 
	$timeout($rootScope.setNav, 1000);	
	
		/** put this in a service **/
	$http.get('/loggedin').success(function(user){
		// User is Authenticated
		if(user !== '0'){
			$rootScope.currentUser = user;
			$rootScope.loggedin=true;
			$scope.showRemote = true;
			$scope.showLocal = false;
		}else if(user == '0'){// User is Not Authenticated
			$rootScope.loggedin=false;
			$scope.showRemote = false;
			$scope.showLocal = true;	
			$scope.getAll_i();			
		}
	});	
	init();
	$rootScope.currentUser;
	$scope.IDBscenes = [];
	$scope.sceneName = '';
	
	
		/***********************************************************start pagination ******************************************************************/
	$scope.pageSize = 4;
	$scope.currentPageNumber = 1;	
	$scope.currentPage = [];
	$scope.pagesArray = [];
	$scope.numberOfScenes = 0;
	$scope.numberOfPages = 1;	
	$scope.showPageNav = false;

	$scope.pageSize_i = 4;
	$scope.currentPageNumber_i = 1;	
	$scope.currentPage_i = [];
	$scope.pagesArray_i = [];
	$scope.numberOfScenes_i = 0;
	$scope.numberOfPages_i = 1;		
	$scope.showPageNav_i = false;
	
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
	
	$scope.pageTurner_i = function(bool){
		if(bool === true){
			if($scope.currentPageNumber_i < $scope.numberOfPages_i){
				$scope.currentPageNumber_i++;
			}
		}else if(bool === false){
			if($scope.currentPageNumber_i > 1){
				$scope.currentPageNumber_i--;
			}
		}
		$scope.paginator_i($scope.currentPageNumber_i);
		console.log('currentPageNumber_i ', $scope.currentPageNumber_i);
	}
	
	$scope.paginator = function(pageNumber){
		$scope.currentPageNumber = pageNumber;
		$scope.numberOfScenes = $scope.scenes.length;
		for(var j = 0; j < $scope.numberOfScenes; j++){
			$scope.currentPage[j] = $scope.scenes[j];
		}		
		$scope.numberOfPages = Math.ceil($scope.numberOfScenes / $scope.pageSize);
		var firstUserIndex = (pageNumber - 1) * $scope.pageSize;
		$scope.currentPage.splice(0, firstUserIndex);	
		console.log('currentPage', $scope.currentPage);
	}		

	$scope.paginator_i = function(pageNumber){
		$scope.currentPageNumber_i = pageNumber;		
		$scope.numberOfScenes_i = $scope.IDBscenes.length;
		for(var j = 0; j < $scope.numberOfScenes_i; j++){
			$scope.currentPage_i[j] = $scope.IDBscenes[j];
		}		
		$scope.numberOfPages_i = Math.ceil($scope.numberOfScenes_i / $scope.pageSize_i);
		var firstUserIndex = (pageNumber - 1) * $scope.pageSize_i;
		$scope.currentPage_i.splice(0, firstUserIndex);	
		console.log('currentPage_i', $scope.currentPage_i);
		$( '#' + pageNumber + '_i' ).trigger( 'click' );
	}	
		
	$timeout(function(){
		//$scope.addPageEventListeners();
	}, 1000);

$scope.reset = function(){
	$('.pagination > li').removeClass('active');
	$scope.paginator_i(1);
}
	
	
$scope.addPageEventListeners = function(){	
	var pages = $('.pagination > li');	
	//if(!$scope.hasRemoteTableLoaded){
		$('#1').addClass('active');
		$scope.hasRemoteTableLoaded = true;	
	//}
	//if(!$scope.hasLocalTableLoaded){
		$('#1_i').addClass('active');
		$scope.hasLocalTableLoaded = true;		
	//}
	pages.click(function(){
		pages.each(function(index){
			if($(this).hasClass('li_user')){
				if($(this).attr('id') == $scope.currentPageNumber){
					$(this).addClass('active');					
				}else{
					$(this).removeClass('active');
				}
			}else if($(this).hasClass('li_IDBscene')){
					if($(this).attr('id') == $scope.currentPageNumber_i + '_i'){
					$(this).addClass('active');					
				}else{
					$(this).removeClass('active');
				}
			}			
		});			
		$(this).addClass('active');
		$('#prev').removeClass('active');
		$('#next').removeClass('active');
		$('#prev_i').removeClass('active');
		$('#next_i').removeClass('active');		
	});	
}
	$scope.pageNavigator = function(){
		for(var i = 0; i < $scope.numberOfPages; i++){
			$scope.pagesArray[i] = i;
		}
	}				
		
	$scope.pageNavigator_i = function(){
		for(var i = 0; i < $scope.numberOfPages_i; i++){
			$scope.pagesArray_i[i] = i;
		}
	}		
		
		
		/***********************************************************end pagination ******************************************************************/		
		
		/*********************************************************** start tabs ******************************************************************/		
	var remoteTab = $('#remote');
	var localTab = $('#local');
	/*** put this into a service ***/
	function toggleTabs(tab){
		tab.mouseenter(function(){
			tab.css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
		});	
		tab.mouseleave(function(){
			if(tab == remoteTab){
				if(!$scope.showRemote){
					tab.css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
				}
			}else if(tab == localTab){
				if(!$scope.showLocal){
					tab.css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
				}				
			}
		});			
	}
	
	toggleTabs(remoteTab);
	toggleTabs(localTab);	

	$scope.setTabs = function(tab){
		if(tab === 'remote'){
			$('#remote').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
			$('#local').css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});	
		}else if(tab === 'local'){
			$('#local').css({'background-color' : '#1e282c', 'border-bottom' : '2px solid #00c0ef'});
			$('#remote').css({'background-color' : 'rgba(69, 73, 74, 1)', 'border-style' : 'none'});
		}	
	}
	
		/*********************************************************** end tabs ******************************************************************/		
	
	$scope.currentScene = '';
	
	
	$scope.showSceneTable = false;
	$scope.scenesVisibility = 'show scenes';
	
	$scope.toggleSceneTable = function(){
		if(!$scope.showSceneTable){
			$scope.showSceneTable = true;
			$scope.scenesVisibility = 'hide scenes';			
		}else if($scope.showSceneTable){
			$scope.showSceneTable = false;
			$scope.scenesVisibility = 'show scenes';			
		}
	}
	
	$scope.currentUser = {};
	
	$scope.simulation = shapeSelection;
	console.log('SimCtrl: ', $scope.simulation);
	
	$scope.scenes = {};
	$scope.currentThumbnail = {};//current thumbnail
	
	$scope.create = function(){
		if($rootScope.loggedin){
			var name = prompt('please choose a name for this scene', 'untitled');
			
			if(name !== ''){
				shapeSelection.name = name;
			}
			var dataURL = canvas.toDataURL();
			shapeSelection.imageUrl = dataURL;	
			$scope.simulation = shapeSelection;
			if(name){
			$http.post('/scenes', $scope.simulation)
			.success(function(response){		
				$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
				var thumbnailUrl = $scope.currentThumbnail[response._id];
				var name = response.name;
				$scope.addData(name);
				//$scope.showSceneTable = false;
				$scope.sceneName = response.name;
			});
			$scope.getAll($scope.currentPageNumber);
		}
		}else{
			$scope.addData();
		}
	}
	

	function shapeLoader(response, id){
		try {
			loadShapes(response);
		}catch(err){
			console.log('error', err);
			var path ='/simuL8r?id=' + id;
			$window.location.href = path;
		}
	}

	$scope.select = function(id){
		$http.get('/scene/' + id)
		.success(function(response){
			//console.log('response ', response);
			//alert(response);
			$scope.simulation = response;
			console.log('id ', id);//5623da04562dc2301b1a1e74
			delete response._id;
			delete response.__v;
			console.log('select ', response);
			$scope.sceneName = shapeSelection.name = response.name;
			var canvas = shapeSelection.canvas;
			var dbCanvas = response.canvas;
			var shapes = response.shapes;
			if(dbCanvas){
				shifter(canvas, dbCanvas, shapes);
			}
			//loadShapes(response);
			shapeLoader(response, id);
			wallMaker();
		});
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
			if(name){
				$http.put('/scenes/' + id, $scope.simulation)
				.success(function(response){
					console.log('update ', response);					
					//$scope.currentThumbnail[response._id] = 'images/thumbnails/' + response._id + '.png';
					//var thumbnailUrl = $scope.currentThumbnail[response._id];
						$scope.getAll($scope.currentPageNumber);
						$scope.sceneName = response.name;
				});
			}
	}
	
	$scope.remove = function(id){
		var deleteScene = confirm('Are you sure you want to delete this scene?');
		if (deleteScene){
			$http.delete('/scene/' + id)
			.success(function(response){
				console.log('remove ', response);
				//$scope.showSceneTable = false;
			});
			$scope.getAll();
		}
	}
	
	$scope.removeAll = function(){
		$http.delete('/scenes/' + $scope.simulation.userID)
		.success(function(response){
			console.log('All scenes have been removed');
		});
		$scope.getAll();
	}

	$scope.getAll = function(pageNumber){
		$scope.simulation = shapeSelection;
		$http.get('/scenes/' + $scope.simulation.userID)
		.success(function(response){
			console.log('getAll ', response);
			$scope.scenes = response;
					
			$scope.numberOfScenes = response.length;
		
				for(var j = 0; j < $scope.numberOfScenes; j++){
					$scope.currentPage[j] = $scope.scenes[j];
				}
		
			$scope.numberOfPages = Math.ceil($scope.numberOfScenes / $scope.pageSize);
			if($scope.numberOfPages > 1){
				$scope.showPageNav = true;
			}
			$scope.pageNavigator();	
			
			if(pageNumber){
				$scope.paginator(pageNumber);
			}else{
				$timeout(function() {
					$scope.addPageEventListeners();
				}, 1000);
			}
		});	
	}
	
	$scope.removeAllScenes = function(){
		var deleteAllScenes = confirm('Are you sure you want to delete all scenes?');
		if(deleteAllScenes){
			$http.get('/remove/' + $scope.simulation.userID)
			.success(function(response){
				$scope.removeAll();
				console.log('remove ', response);
				$scope.showSceneTable = false;
			});
		}
	}
	
	
	$scope.retrieve = function(id){
		clearAll(wallConfig);
		$scope.select(id);
		$scope.currentScene = id;
	}
	
	$scope.refresh = function(id){
		if($scope.currentScene !== ''){
		clearAll(wallConfig);
		$scope.select(id);
		}
	}
	
	
	$scope.newScene = function(){
		clearAll(wallConfig);
		$scope.simulation = shapeSelection;
		console.log('newScene: ', $scope.simulation);
	}
	
	/*$scope.saveThumbnail = function(id){
		var image = canvas.toDataURL('image/png');
		postData = {
					canvasData: image,
					id: id
				};
		 $http.post('/upload', postData)
		 .success(function(response){
			console.log('successful upload!');
		});
	}*/
	
	$scope.logout = function(){
		console.log('Simtroller logging out!!!');
		location.replace('/signout');
	}
	
	$scope.findCurrentUser = function(){
		$http.get('/loggedin').success(function(user){
			// User is Authenticated
			if(user !== '0'){
				$rootScope.currentUser = $scope.currentUser = user;
				shapeSelection.userID = user._id;
				console.log('$scope.simulation: ', $scope.simulation);
				console.log('$scope.currentUser: ', $scope.currentUser);
				console.log('user: ', user);
				/*$scope.simulation.isPublic = true;
				$scope.simulation.userID = user._id;*/
				return user;
			}
		});
	}
	
	console.log('getQueryVariable: ', getQueryVariable('id'));
	/*
	// load scenes from id value in querystring
	$scope.loadSelectedScene = function(){
		id = getQueryVariable('id');
		console.log('loadSelectedScene id', id);
		if(id){
			$scope.currentScene = id;
			$scope.select(id);
		}
	}*/
	
	// this should be put into a service
	$scope.loadSelectedScene = function(){
		var searchObject = $location.search();
		id = searchObject.id;
		//console.log('loadSelectedScene id', id);
		if(id){
			$scope.currentScene = id;
			$scope.select(id);
		}
	}
		
	function checkParameters(){
		var searchObject = $location.search();
		if(searchObject.bp == 1){
			showBlueprint.on = true;
			var bp = document.getElementById('bp');
			bp.style.display = 'block';
		}else if(searchObject.bp == 0){
			showBlueprint.on = false;
		}
		if(searchObject.g){
			gravity = searchObject.g;
		}
	}		
		
	checkParameters();	
		
	$timeout($scope.loadSelectedScene, 1000);
	canvas = document.getElementById('canvas');
	
	canvas.addEventListener('canvasReady', $scope.loadSelectedScene);
	
	$scope.findCurrentUser();
	
	function rotateOptions(id, options){
		$(id).click(function(){
			event.stopPropagation();
			resetRotate();
			$(id).css('color', 'white');
			$(id).css('text-decoration', 'underline');
			options = true;
		});
	}

	$(document).ready(function(){
		$('#reverseX').click(function(){
			event.stopPropagation();
			resetRotate();
			$('#reverseX').css('color', 'white');
			$('#reverseX').css('text-decoration', 'underline');
			reversingX = true;
		});
		$('#reverseY').click(function(){
			event.stopPropagation();
			resetRotate();
			$('#reverseY').css('color', 'white');
			$('#reverseY').css('text-decoration', 'underline');
			reversingY = true;
		});
		$('#rotate90').click(function(){
			event.stopPropagation();
			resetRotate();
			$('#rotate90').css('color', 'white');
			$('#rotate90').css('text-decoration', 'underline');
			rotating90 = true;
		});
		$('#rotate180').click(function(){
			event.stopPropagation();
			resetRotate();
			$('#rotate180').css('color', 'white');
			$('#rotate180').css('text-decoration', 'underline');
			rotating180 = true;
		});
	});
	
	/************************************************** indexedDB ******************************************************************/
	
	console.log('indexedDB');
	var scenes = [];
	var sceneTable = document.getElementById('sceneTable');
		
	// In the following line, you should include the prefixes of implementations you want to test.
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// DON'T use "var indexedDB = ..." if you're not in a function.
	// Moreover, you may need references to some window.IDB* objects:
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
	
if (window.IDBTransaction){
    window.IDBTransaction.READ_WRITE = window.IDBTransaction.READ_WRITE || 'readwrite';
    window.IDBTransaction.READ_ONLY = window.IDBTransaction.READ_ONLY || 'readonly';
}
	
  // Let us open our database
	//var DBOpenRequest = window.indexedDB.open("simulations", 4);
	var DBOpenRequest = window.indexedDB.open("test", 4);
	
	// Gecko-only IndexedDB temp storage option:
	// var request = window.indexedDB.open("toDoList", {version: 4, storage: "temporary"});

	// these two event handlers act on the database being opened successfully, or not
	DBOpenRequest.onerror = function(event){
		console.log('Error loading database');
	};
	
	DBOpenRequest.onsuccess = function(event){
		console.log('Database initialised');
		// store the result of opening the database in the db variable. This is used a lot below
		db = DBOpenRequest.result;
		
		// Run the getAll_i() function to populate the task list with all the to-do list data already in the IDB
		//getAll_i();
	};
	
	
	// This event handles the event whereby a new version of the database needs to be created
	// Either one has not been created before, or a new version number has been submitted via the
	// window.indexedDB.open line above
	//it is only implemented in recent browsers
	DBOpenRequest.onupgradeneeded = function(event){ 
		var db = event.target.result;

		db.onerror = function(event) {
			console.log( 'Error loading database.');
		};

		// Create an objectStore for this database
		var objectStore = db.createObjectStore("scenes", { keyPath: "userID" });
		
		// define what data items the objectStore will contain
		objectStore.createIndex('name', 'name', { unique: false });		
		objectStore.createIndex('userID', 'userID', { unique: false });
		objectStore.createIndex('imgURL', 'imgURL', { unique: false });
		objectStore.createIndex('canvas', 'canvas', { unique: false });
		objectStore.createIndex('isPublic', 'isPublic', { unique: false });
		objectStore.createIndex('shapes', 'shapes', { unique: false });

		
		
		console.log('Object store created');
	};

	/*var browserSave = document.getElementById('browserSave');
	//browserSave.addEventListener('click', addData , false);
	
	var webData = document.getElementById('webData');
	webData.addEventListener('click', displayData , false);
	
	var removeAllScenes = document.getElementById('removeAllScenes');
	removeAllScenes.addEventListener('click', removeAll , false);*/
	
	
	 $scope.addData = function(scene_name){		
		// open a read/write db transaction, ready for adding the data
		//var transaction = db.transaction(["scenes"], "readwrite");
		 var transaction = db.transaction(["scenes"], "readwrite");
		// report on the success of opening the transaction
		 transaction.oncomplete = function(){
			console.log('Transaction completed: database modification finished');
			// update the display of data to show the newly added item, by running getAll_i() again.
			//getAll_i(); 
		};

		transaction.onerror = function(){
			console.log('Transaction not opened due to error: ' + transaction.error);
		};
		
		
		dataURL = canvas.toDataURL();
		//console.log('dataURL4: ' , dataURL);		
				
		// call an object store that's already been added to the database
		var objectStore = transaction.objectStore("scenes");
		var scene = {};
		
		//scene = loadDatabase(scene);
		scene = $scope.loadDatabase();
		// add our newItem object to the object store
		scene.userID = Math.floor(10000000000 * Math.random());
		if(!scene_name){
			var name = prompt('please choose a name for this scene (local)', 'untitled');
			scene.name = name;
		}else{
			scene.name = scene_name;
		}
		
		scene.imgURL = dataURL;
		if(name){
			var objectStoreRequest = objectStore.add(scene); 		
			objectStoreRequest.onsuccess = function(event) {
				// report the success of our new item going into the database
				console.log('New scene added to database');
				$scope.getAll_i($scope.currentPageNumber_i);			
				//appendTable(null, scene.userID, scene, scene.imgURL);	
				/*setTimeout(function(){
					$scope.getAll_i();
				}, 300);*/			
			};
		}
	}	
	
	/** The structure of the scene object is different from that of the shapeSelection object
		structure: scene = {
						name: 'untitled',
						userID: null,
						isPublic: true,			
						shapes:{square: squareArray, circle: circleArray, triangle: triangleArray,.....}
			}	
	**/
	//function loadDatabase(scene){
	$scope.loadDatabase = function(){
		var scene = {};
		scene.shapes = {};	
		for(key in shapeSelection.shapes){ // for each shape category
				scene.shapes[key] = []; // this line initialises the shapeArray 
				for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){ // for each shape in the shape array e.g squareArray
					scene.shapes[key][i] = {}; // initiate the ith shape as an empty object					
					for(z in shapeSelection.shapes[key][2][i]){ // for the zth property in the ith shape
						if(typeof shapeSelection.shapes[key][2][i][z] != 'function'){
							scene.shapes[key][i][z] = shapeSelection.shapes[key][2][i][z]; 
						}
					}
				}
			}
			scene.canvas = {};
			scene.canvas.width = shapeSelection.canvas.width;
			scene.canvas.height = shapeSelection.canvas.height;
		return scene;
	}

	
	 $scope.getAll_i = function(pageNumber){
		//console.log('sceneTable.children.length', sceneTable.children.length);
		//console.log('sceneTable.childNodes.length', sceneTable.childNodes.length);
		for(var i = 3; i < sceneTable.children.length; i++){
			sceneTable.removeChild(sceneTable.childNodes[i]);
		}			
		scenes = [];
		var request = indexedDB.open('test');
		request.onsuccess = function(e){
			var idb = e.target.result;
			var transaction = idb.transaction('scenes', IDBTransaction.READ_ONLY);
			var objectStore = transaction.objectStore('scenes');
			objectStore.openCursor().onsuccess = function(event){
				var cursor = event.target.result;
				if (cursor){
					//console.log('Cursor data', cursor.value);
					//console.log('event: ', event);
					scenes.push(cursor.value);
					//$scope.IDBscenes.push(cursor.value);
					cursor.continue();
				}else{
					console.log('scenes ', scenes);
					//$scope.IDBscenes = scenes;
					console.log('IDBscenes ', $scope.IDBscenes);
					for(var i = 0; i < scenes.length; i++){
						//appendTable(i);
					}
					$scope.IDBscenes = scenes;
					console.log('IDBscenes ', $scope.IDBscenes);
					console.log('All entries displayed.');
					
					$scope.numberOfScenes_i = $scope.IDBscenes.length;
					for(var j = 0; j < $scope.numberOfScenes_i; j++){
						$scope.currentPage_i[j] = $scope.IDBscenes[j];
					}
					
					$scope.numberOfPages_i = Math.ceil($scope.numberOfScenes_i / $scope.pageSize_i);
					if($scope.numberOfPages_i > 1){
						$scope.showPageNav_i = true;
					}		
					$scope.pageNavigator_i();
					if(pageNumber){
						$scope.paginator_i(pageNumber);
					}else{
						$timeout(function() {
							$scope.addPageEventListeners();
							$( '#1_i' ).trigger( 'click' );
						}, 5000);
					}
					
				}
			};	
		}
	}
	
	/*if($rootScope.loggedin === false){
		$scope.getAll_i();
	}*/
	
	function appendTable(i, id, scene, imgURL){
		if(i !== null){
			var userID = scenes[i].userID;
			var imgURL = scenes[i].imgURL;
		}else if(i === null){
			var userID = id;
		}
		
		var tr = document.createElement('tr');
		var displayData = document.createElement('td');
		var sceneThumb = document.createElement('img');
		var deleteButton = document.createElement('button');
		var updateButton = document.createElement('button');
		
		sceneThumb.setAttribute('id', 'sceneThumbnail');
		sceneThumb.src = imgURL;
		
		deleteButton.innerHTML = 'delete';
		deleteButton.setAttribute('class', 'browser');
		
		updateButton.innerHTML = 'update';
		updateButton.setAttribute('class', 'browser');
		
		sceneThumb.addEventListener('click', function(){
			
			clearAll(wallConfig);			
			//
			if(i !== null){			
				currentScene = loadShapes_idb(scenes[i]);
				if(scenes[i].shapes){
					shifter(shapeSelection.canvas, scenes[i].canvas, currentScene.shapes);
				}
			}else if(i === null){
				currentScene = loadShapes_idb(scene);
				shifter(shapeSelection.canvas, scene.canvas, currentScene.shapes);				
			}
			wallMaker();
		}, false);		
		
		
		
		
		/*deleteButton.addEventListener('click', function(){
			deleteData(userID);
		}, false);
		
		updateButton.addEventListener('click', function(){
			editRecord(userID);
		}, false);*/
		
		displayData.appendChild(sceneThumb);
	
		//create empty cells and append them to the row
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');
		var deleteScene = document.createElement('td');
		var update = document.createElement('td');
		
		deleteScene.appendChild(deleteButton);
		update.appendChild(updateButton);
		
		if(i !== null){
			var name = document.createTextNode(scenes[i].name);	
		}else if(i === null){
			var name = document.createTextNode(scene.name);	
		}	
		
		td5.appendChild(name);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);		
		tr.appendChild(displayData);
		tr.appendChild(update);		
		tr.appendChild(deleteScene);
		sceneTable.appendChild(tr);
	}

      $scope.retrieveIDBscene = function(scene){
			clearAll(wallConfig);						
				currentScene = loadShapes_idb(scene);
				if(scene.shapes){
					shifter(shapeSelection.canvas, scene.canvas, currentScene.shapes);
				}
				currentScene = loadShapes_idb(scene);
				shifter(shapeSelection.canvas, scene.canvas, currentScene.shapes);				
			wallMaker();
	   }
	
	
	

	$scope.deleteData = function(id){
		var request = indexedDB.open('test');
		var deleteScene = confirm('Are you sure you want to delete this scene?');
		if(deleteScene){
			request.onsuccess = function(e){
				var idb = e.target.result;
				var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
				console.log('objectStore: ', objectStore);
				var request = objectStore.delete(id);
				//$scope.showSceneTable = false;
				request.onsuccess = function(ev){
					console.log('three-->', ev);
				};
			 
				request.onerror = function(ev){
					console.log('Error occured', ev.srcElement.error.message);
				};
			}
		}
	}
	
	 $scope.editRecord = function(key){
		var request = indexedDB.open('test');
		
		var scene = {};
		//scene = loadDatabase(scene);
		scene = $scope.loadDatabase();
		request.onsuccess = function(e){
			var idb = e.target.result;
			var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
			var request = objectStore.get(key);
	 
			request.onsuccess = function(ev){
				var data = ev.target.result;
				if(data === undefined){
					console.log('Key doesnt exist or has been previously removed');
					return;
				}
				
				dataURL = canvas.toDataURL();
				scene.userID = key;
				currentScene.imgURL = dataURL;
				data = scene;
				var name = prompt("add or update this scene's name", currentScene.name);			
				data.name = name;
				data.imgURL = currentScene.imgURL;
				if(name){
					var result = objectStore.put(data);
					console.log('data: ', data);
					result.onsuccess = function(ev){
						var sceneKey = ev.target.result;
						console.log('Updated scene: ', ev.target);
						console.log('Successfully edited key ' + sceneKey);
						$scope.getAll_i($scope.currentPageNumber_i);
					};
		 
					result.onerror = function(ev){
						console.log('Error occured', ev.srcElement.error.message);
					};
				}
			};
	 
			request.onerror = function(ev){
				console.log('Error occured', ev.srcElement.error.message);
			};
		};
	}
	
	 $scope.IDB_removeAll = function(){
		var deleteScene = confirm('Are you sure you want to delete all scenes?');
		$scope.showSceneTable = false;
		if(deleteScene){
			var request = indexedDB.deleteDatabase('test');
			request.onsuccess = function() { console.log('drop succeeded'); };
			request.onerror = function() { console.log('drop failed') };
		}
	}


/******************************************* settings *********************************************/
var velocity_x = document.getElementById('vx');
var velocity_y = document.getElementById('vy');
var v_angular = document.getElementById('v_angular');
var frame_rate = document.getElementById('frame_rate');
var applySettings = document.getElementById('applySettings');
var fix = document.getElementById('fix');
var showOptions = document.getElementById('showOptions');
var settings = document.getElementById('settings');
var settingsShowing = false


var displaySettings = function(){
	var f_rate = Number(frame_rate.value) || 100;
	var x = Number(velocity_x.value);
	var y = Number(velocity_y.value);
	var ang_v = Number(v_angular.value);
	var isFixed = fix.checked;
	console.log('isFixed: ', isFixed);
	
	if(selectedShape[0]){
		selectedShape[0].velocity = [x, y];	
		selectedShape[0].angularVelocity = ang_v;
		selectedShape[0].gravity = !isFixed;
		clearFrames();
		startFrames(f_rate);
	}
	if(selectedShape[0] && isFixed){
		selectedShape[0].isFixed = true;
		selectedShape[0].mass = Infinity;
		selectedShape[0].momentOfInertia = Infinity;
		selectedShape[0].velocity = [0, 0];
	}
}

/** do this with angular**/
function showSettings(){
	if(!settingsShowing){
		settings.style.display = 'inline-block';
		console.log('show settings');
		settingsShowing = true;
	}else if(settingsShowing){
		settings.style.display = 'none';
		console.log('hide settings');
		settingsShowing = false;
	}
}

function clearFrames(){
	intervalRunning = false;
	clearInterval(playScenes);
}

function startFrames(frame__rate){
	if(intervalRunning === false){
		intervalRunning = true;
		playScenes = setInterval(animator, 1000 / frame__rate);
	}
}

applySettings.addEventListener('click', displaySettings);
showOptions.addEventListener('click', showSettings);


/******************************************* spectrum.js boilerplate code *********************************************/


showColourPallet = function(){
	$("#ChangeColour").spectrum({
		color: "#ECC",
		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxSelectionSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		move: function (color) {
			
		},
		show: function () {
		
		},
		beforeShow: function () {
		
		},
		hide: function () {
		
		},
		change: function() {
			
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
}

showColourPallet();

/**************/
	
function arrow_keys_handler(e) {
	switch(e.keyCode){
		case 32: if(physics === true){
			physics = false;
			$scope.play = false;
			$scope.checkPlay(false);
		}else if(physics === false){
			physics = true;
			$scope.play = true;
			$scope.checkPlay(true);
		}
		e.preventDefault();
		//$scope.checkPlay();
		break; 
		default: break; // do not block other keys
	}
};

	//$timeout(function(){window.addEventListener("keydown", arrow_keys_handler)}, 500);	
	
	
});
