(function() {
	console.log('indexedDB');
	var scenes = [];
	var display = true;
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
		
		// Run the displayData() function to populate the task list with all the to-do list data already in the IDB
		//displayData();
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
		objectStore.createIndex('isPublic', 'isPublic', { unique: false });
		objectStore.createIndex('shapes', 'shapes', { unique: false });

		
		
		console.log('Object store created');
	};

	var browserSave = document.getElementById('browserSave');
	browserSave.addEventListener('click', addData , false);
	
	var webData = document.getElementById('webData');
	webData.addEventListener('click', displayData , false);
	
	var removeAllScenes = document.getElementById('removeAllScenes');
	removeAllScenes.addEventListener('click', removeAll , false);
	
	
	function addData(){		
		// open a read/write db transaction, ready for adding the data
		//var transaction = db.transaction(["scenes"], "readwrite");
		 var transaction = db.transaction(["scenes"], "readwrite");
		// report on the success of opening the transaction
		 transaction.oncomplete = function(){
			console.log('Transaction completed: database modification finished');
			// update the display of data to show the newly added item, by running displayData() again.
			//displayData(); 
		};

		transaction.onerror = function(){
			console.log('Transaction not opened due to error: ' + transaction.error);
		};
		
		
		dataURL = canvas.toDataURL();
		//console.log('dataURL4: ' , dataURL);		
				
		// call an object store that's already been added to the database
		var objectStore = transaction.objectStore("scenes");
		var scene = {};
		
		scene = loadDatabase(scene);
		// add our newItem object to the object store
		scene.userID = Math.floor(10000000000 * Math.random());
		var name = prompt('please choose a name for this scene', 'untitled');
		scene.name = name;
		
		scene.imgURL = dataURL;

		var objectStoreRequest = objectStore.add(scene); 		
		objectStoreRequest.onsuccess = function(event) {
			// report the success of our new item going into the database
			console.log('New scene added to database');		
			appendTable(null, scene.userID, scene, scene.imgURL);			
		};
	}	
	
	/** The structure of the scene object is different from that of the shapeSelection object
		structure: scene = {
						name: 'untitled',
						userID: null,
						isPublic: true,			
						shapes:{square: squareArray, circle: circleArray, triangle: triangleArray,.....}
			}	
	**/
	function loadDatabase(scene){
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
		return scene;
	}

	
	function displayData(){
		if(display){
			console.log('sceneTable.children.length', sceneTable.children.length);
			console.log('sceneTable.childNodes.length', sceneTable.childNodes.length);
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
						console.log('Cursor data', cursor.value);
						console.log('event: ', event);
						scenes.push(cursor.value);
						cursor.continue();
					}else{
						for(var i = 0; i < scenes.length; i++){
							appendTable(i);
						}
						console.log('All entries displayed.');
						console.log('scenes: ', scenes);	
					}
				};
			}
			display = false;
		}
	}
	
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
			if(i !== null){			
				currentScene = loadShapes_idb(scenes[i]);
			}else if(i === null){
				currentScene = loadShapes_idb(scene);				
			}
		} , false);		
		
		
		
		
		deleteButton.addEventListener('click', function(){
			deleteData(userID);
		} , false);
		
		updateButton.addEventListener('click', function(){
			editRecord(userID);
		} , false);
		
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


	function deleteData(id){
		var request = indexedDB.open('test');
		var deleteScene = confirm('Are you sure you want to delete this scene?');
		if(deleteScene){
			request.onsuccess = function(e){
				var idb = e.target.result;
				var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
				console.log('objectStore: ', objectStore);
				var request = objectStore.delete(id);
			 
				request.onsuccess = function(ev){
					console.log('three-->', ev);
				};
			 
				request.onerror = function(ev){
					console.log('Error occured', ev.srcElement.error.message);
				};
			}
		}
	}
	
	function editRecord(key){
		var request = indexedDB.open('test');
		
		var scene = {};
		scene = loadDatabase(scene);	
		request.onsuccess = function(e){
			var idb = e.target.result;
			var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
			var request = objectStore.get(key);
	 
			request.onsuccess = function(ev){
				var data = ev.target.result;
				if(data === undefined){
					console.log('Key doesnt exist or has been previousl yremoved');
					return;
				}
				
				dataURL = canvas.toDataURL();
				scene.userID = key;
				currentScene.imgURL = dataURL;
				data = scene;
				console.log('shapeSelection: ', currentScene, currentScene.name);
				console.log('currentScene: ', currentScene.imgURL);
				var name = prompt("add or update this scene's name", currentScene.name);				
				data.name = name;
				data.imgURL = currentScene.imgURL;
				
				var result = objectStore.put(data);
				console.log('data: ', data);
				result.onsuccess = function(ev){
					var sceneKey = ev.target.result;
					console.log('Updated scene: ', ev.target);
					console.log('Successfully edited key ' + sceneKey);
				};
	 
				result.onerror = function(ev){
					console.log('Error occured', ev.srcElement.error.message);
				};
			};
	 
			request.onerror = function(ev){
				console.log('Error occured', ev.srcElement.error.message);
			};
		};
	}
	
	function removeAll(){
		var deleteScene = confirm('Are you sure you want to delete all scenes?');
		if(deleteScene){
			var request = indexedDB.deleteDatabase('test');
			request.onsuccess = function() { console.log('drop succeeded') };
			request.onerror = function() { console.log('drop failed') };
		}
	}
})();