(function() {
	console.log('indexedDB');
	var scenes = [];
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
	
	var deleteData = document.getElementById('deleteData');
	webData.addEventListener('click', deleteData , false);
	
	
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

		// add our newItem object to the object store
		scene.userID = Math.floor(10000000000 * Math.random());
		var objectStoreRequest = objectStore.add(scene); 		
		objectStoreRequest.onsuccess = function(event) {
			// report the success of our new item going into the database
			console.log('New scene added to database'); 
		};
	}
		

	function displayData(){
		var request = indexedDB.open('test');
		request.onsuccess = function(e){
			idb = e.target.result;
			var transaction = idb.transaction('scenes', IDBTransaction.READ_ONLY);
			var objectStore = transaction.objectStore('scenes');
			objectStore.openCursor().onsuccess = function(event){
				var cursor = event.target.result;
				if (cursor){
					console.log('Cursor data', cursor.value);
					scenes.push(cursor.value);
					cursor.continue();
				}else{
					console.log('All entries displayed.');
				}
				console.log('scenes: ', scenes);
				loadShapes_idb(scenes[0]);
			};
		}
	}
	

	function deleteData(){
		var request = indexedDB.open('test');
		request.onsuccess = function(e){
			var idb = e.target.result;
			var objectStore = idb.transaction('scenes', IDBTransaction.READ_WRITE).objectStore('scenes');
			var request = objectStore.delete('464019891');
		 
			request.onsuccess = function(ev){
				console.log(ev);
			};
		 
			request.onerror = function(ev){
				console.log('Error occured', ev.srcElement.error.message);
			};
		}
		
	}
	
})();