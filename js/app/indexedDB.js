(function() {
	console.log('indexedDB');
	
	//var newScene = {circle: 'circle', square: 'square', triangle: 'triangle' };
	
	// In the following line, you should include the prefixes of implementations you want to test.
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// DON'T use "var indexedDB = ..." if you're not in a function.
	// Moreover, you may need references to some window.IDB* objects:
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
	
  // Let us open our database
	var DBOpenRequest = window.indexedDB.open("simulations2", 4);
	
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

		//var objectStore = db.createObjectStore("scenes", { keyPath: "shapeSelector" });
		var objectStore = db.createObjectStore("scenes", { keyPath: "circle" });

		// define what data items the objectStore will contain
		/*
		objectStore.createIndex("hours", "hours", { unique: false });
		objectStore.createIndex("minutes", "minutes", { unique: false });
		objectStore.createIndex("day", "day", { unique: false });
		objectStore.createIndex("month", "month", { unique: false });
		objectStore.createIndex("year", "year", { unique: false });
		objectStore.createIndex("notified", "notified", { unique: false });*/



		/*objectStore.createIndex(shapeSelector['userID'], shapeSelector['userID'], { unique: false });
		objectStore.createIndex(shapeSelector['isPublic'], shapeSelector['isPublic'], { unique: false });
		objectStore.createIndex(shapeSelector['circle'], shapeSelector['circle'], { unique: false });
		objectStore.createIndex(shapeSelector['square'], shapeSelector['square'], { unique: false });
		objectStore.createIndex(shapeSelector['triangle'], shapeSelector['triangle'], { unique: false });
		objectStore.createIndex(shapeSelector['customShape'], shapeSelector['customShape'], { unique: false });
		objectStore.createIndex(shapeSelector['pencil'], shapeSelector['pencil'], { unique: false });
		objectStore.createIndex(shapeSelector['curve'], shapeSelector['curve'], { unique: false });
		objectStore.createIndex(shapeSelector['wall'], shapeSelector['wall'], { unique: false });*/
		
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

		// add our newItem object to the object store
		var objectStoreRequest = objectStore.add(shapeSelection);        
		objectStoreRequest.onsuccess = function(event) {
		  
			// report the success of our new item going into the database
			console.log('New scene added to database'); 
		};
	}
	
})();