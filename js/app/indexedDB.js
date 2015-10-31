(function() {
	console.log('indexedDB');
	var scenes = [];
	var display = true;
	var sceneTable = document.getElementById('sceneTable');
	
	//var newScene = {circle: 'circle', square: 'square', triangle: 'triangle' };
	
	// In the following line, you should include the prefixes of implementations you want to test.
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// DON'T use "var indexedDB = ..." if you're not in a function.
	// Moreover, you may need references to some window.IDB* objects:
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
	
/*if (IDBTransaction){
    IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
    IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
}*/

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
	DBOpenRequest.onupgradeneeded = function(event) { 
		var db = event.target.result;

		db.onerror = function(event) {
			console.log( 'Error loading database.');
		};

		// Create an objectStore for this database
		var objectStore = db.createObjectStore("scenes", { keyPath: "userID" });

		// define what data items the objectStore will contain
		objectStore.createIndex('userID', 'userID', { unique: false });
		objectStore.createIndex('isPublic', 'isPublic', { unique: false });
		objectStore.createIndex('circle', 'circle', { unique: false });
		objectStore.createIndex('square', 'square', { unique: false });
		objectStore.createIndex('triangle', 'triangle', { unique: false });
		objectStore.createIndex('customShape', 'customShape', { unique: false });
		objectStore.createIndex('pencil', 'pencil', { unique: false });
		objectStore.createIndex('curve', 'curve', { unique: false });
		objectStore.createIndex('wall', 'wall', { unique: false });
		
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
		
		// call an object store that's already been added to the database
		var objectStore = transaction.objectStore("scenes");
		console.log(objectStore.indexNames);
		console.log(objectStore.keyPath);
		console.log(objectStore.name);
		console.log(objectStore.transaction);
		console.log(objectStore.autoIncrement);

		var scene = {};
		
		loadDatabase(scene);

		// add our newItem object to the object store
		scene.userID = Math.floor(10000000000 * Math.random());
		var objectStoreRequest = objectStore.add(scene); 		
		objectStoreRequest.onsuccess = function(event) {
			// report the success of our new item going into the database
			console.log('New scene added to database');
			
			appendTable(null, scene.userID, scene);
			
		};
	}
		

	function loadDatabase(scene){
		clearAll(wallConfig);
		for(key in shapeSelection){ // for each shape category
			if(key != 'userID' && key != 'isPublic'){
				scene[key] = [];
				for(var i = 0; i < shapeSelection[key][2].length; i++){ // for each shape in the shape array e.g squareArray
					scene[key][i] = {};
					for(z in shapeSelection[key][2][i]){ // for the zth property in the ith shape
						if(typeof shapeSelection[key][2][i][z] != 'function'){
							scene[key][i][z] = shapeSelection[key][2][i][z]; 
						}
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
			//for(var i = 0; i < sceneTable.childNodes.length; i++){	
				//sceneTable.children[i].innerHTML = '';
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
						//console.log('sceneTable.children.length', sceneTable.children.length);
						console.log('All entries displayed.');
						console.log('scenes: ', scenes);	
					}

				};
			}
			display = false;
		}
	}
	
	function appendTable(i, id, scene){
		if(i !== null){
			var userID = scenes[i].userID;
		}else if(i === null){
			var userID = id;
		}
		
		var tr = document.createElement('tr');
		var displayData = document.createElement('td');
		var button = document.createElement('button');
		var deleteButton = document.createElement('button');
		var updateButton = document.createElement('button');
		//var DeleteAllButton = document.createElement('button');
		
		button.setAttribute('id', userID);
		button.setAttribute('class', 'browser');
		button.innerHTML = userID;
		
		deleteButton.innerHTML = 'delete';
		deleteButton.setAttribute('class', 'browser');
		
		updateButton.innerHTML = 'update';
		updateButton.setAttribute('class', 'browser');
		
		//DeleteAllButton.innerHTML = 'delete';
		//DeleteAllButton.setAttribute('class', 'browser');
		
		
			button.addEventListener('click', function(){
				clearAll(wallConfig);
				if(i !== null){
					loadShapes_idb(scenes[i]);
				}else if(i === null){
					loadShapes_idb(scene);
				}
			} , false);
		
		
		deleteButton.addEventListener('click', function(){
			deleteData(userID);
		} , false);
		
		updateButton.addEventListener('click', function(){
			editRecord(userID);
		} , false);
		
		displayData.appendChild(button);
	
		//create empty cells and append them to the row
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');
		var td6 = document.createElement('td');
		var deleteScene = document.createElement('td');
		var update = document.createElement('td');
		//var removeAllScenes = document.createElement('td');
		
		deleteScene.appendChild(deleteButton);
		update.appendChild(updateButton);
		//removeAllScenes.appendChild(DeleteAllButton);
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);	
		
		var td6 = document.createElement('td');
		
		tr.appendChild(displayData);
		tr.appendChild(deleteScene);
		tr.appendChild(update);
		//tr.appendChild(removeAllScenes);
		sceneTable.appendChild(tr);
	}


	function deleteData(id){
		console.log('one');
		var request = indexedDB.open('test');
		var deleteScene = confirm('Are you sure you want to delete this scene?');
		if(deleteScene){
			request.onsuccess = function(e){
				console.log('two');
				var idb = e.target.result;
				var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
				console.log('objectStore: ', objectStore);
				//var request = objectStore.delete(6128202404);
				var request = objectStore.delete(id);
				//var request = objectStore.delete('keyPath');
			 
				request.onsuccess = function(ev){
					console.log('three-->', ev);
				};
			 
				request.onerror = function(ev){
					console.log('Error occured', ev.srcElement.error.message);
				};
			}
		}
	}
	
	//function editRecord(key, newValue){
	function editRecord(key){
		var request = indexedDB.open('test');
		
		var scene = {};
		scene = loadDatabase(scene);
		
		console.log('loadDatabase: ', scene);
		
		request.onsuccess = function(e){
			var idb = e.target.result;
			var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
			var request = objectStore.get(key);
	 
			request.onsuccess = function(ev){
				var data = ev.target.result;
				//var editDivEl = document.querySelector('#editRecordDiv');
	 
				if (data === undefined){
					console.log('Key doesnt exist or has been previouslyremoved');
					return;
				}
	 
				scene.userID = key;
				data = scene;
				var result = objectStore.put(data);
				console.log('data: ', data);
				result.onsuccess = function(ev){
					var sceneName = ev.target.result;
					console.log('Updated scene: ', ev.target);
					console.log('Successfully edited key ' + sceneName);
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