var circle;
var canvas;
var circleArray = [];
var squareArray = [];
var triangleArray = [];
var lineArray = [];
var customShapeArray = [];
var pencilArray = [];
var curveArray = [];
var wallArray = [];
var startPencil = false;
var shapes = false;
var circles = false;
var triangles = false;
var squares = false;
var onObject = false;
var dragging = false;
var cursor_grab = "-webkit-grabbing" || "-moz-grabbing" || "grabbing" || 'move';
var cursor_drag = "-webkit-grab" || "-moz-grab" || "grab" || 'move';
var mousePos;
var selectedShape = [];
var frame_Rate = 100;
var playScenes;
var selectedColour = '';
var zoom = 1;
var zoomCenter = [];
var shift = [0, 0];
var centerShift = [0, 0];
var isZooming = false;
var zoomDisplay;

var shapeSelection = {
						name: 'untitled',
						userID: null,
						isPublic: true,
						imageUrl: '',
						canvas: {
							width:0,
							height:0
						},
						shapes: {
							circle:[false, circleGen, circleArray, 0],
							square:[false, squareGen, squareArray, 1],
							triangle:[false, triangleGen, triangleArray, 2],
							customShape:[false, customShapeGen, customShapeArray, 3],
							pencil:[true, pencilGen, pencilArray, 4],
							curve:[false, curveGen, curveArray, 5],
							wall:[false, wallGen, wallArray, 6]
						}
					};

var pencilPointsArray = [];
var superPencilPoints = [];
var triangle;
var square;
var shapeCounter = 0;
var deletion = false;
var reSize = false;
var reShape = false;
var onReshape = false;
var expand = false;
var colourChange = false;
var selectSize = 15; // resize: the shortest distance between the radius
var smallBox = 9; // size of the small black square in the expansion square
var colours = {
				transparent:['transparent', false], blue:['blue', false], red:['red', false], yellow:['yellow', false],
				green:['green', false], white:['white', false], black:['black', false], lightblue:['lightblue', false],
				lightgreen:['lightgreen', false], orange:['orange', false], purple:['purple', false], violet:['violet',
				false], beige:['beige', false],
				aqua:['aqua', false], grey:['grey', false], pink:['pink', false]
			};
var zoomerizer = false;
var rotate = false;
var physics = false;
var pencils = true;
var copy = false;
var onSlider = false;
var onRotateDial = false;
var onRotator = false;
var sliderPosition = 0;
var sliderButtonWidth = 250;
var startDraw = false;
var pointsArray = [];
var closedPath = false;
var closePathRadius = 5;
var rotVertices = 0;
var rotVertices2 = [];
var counter = 0;
var saving = false;
var screenWidth = screen.availWidth;
var screenHeight = screen.availHeight;
var tipping = true;
var offcenter = [0,0];
var select = false;
var stroking = false;
var pointStroking = true;
var reversingX = false;
var reversingY = false;
var rotating90 = false;
var rotating180 = false;
var copyArray = [];
var copying = true;
var onBar = false; //checks to see if the cursor is on the navigation bar
var line = false;
var clickCount = 0;
var mouse_down = false;
var mergeDistance = 5;

var collisionCounter = 0;
var circularArray = [];

var numberOfShapes = 0;

var currentlyReshaping = null; //there must be a better way to do this


function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for(var i = 0; i < vars.length; i++){
		var pair = vars[i].split('=');
		if(decodeURIComponent(pair[0]) == variable){
			return decodeURIComponent(pair[1]);
		}
	}
	return false;
}
/*
function checkParameters(){
	if(getQueryVariable('bp') == 1){
		showBlueprint.on = true;
		var bp = document.getElementById('bp');
		bp.style.display = 'block';
	}else if(getQueryVariable('bp') == 0){
		showBlueprint.on = false;
	}
	if(getQueryVariable('g')){
		gravity = getQueryVariable('g');
	}
}*/

// the function below determines whether the pencil draws shapes or strokes
$(document).ready(function(){
	$('#strokes').click(function(){
		$('#strokes').css('color', 'white');
		$('#shapes').css('color', '#A3FFA3');
		$('#strokes').css('text-decoration', 'underline');
		$('#shapes').css('text-decoration', 'none');
		stroking = true;
	});
	$('#shapes').click(function(){
		$('#strokes').css('color', '#A3FFA3');
		$('#shapes').css('color', 'white');
		$('#shapes').css('text-decoration', 'underline');
		$('#strokes').css('text-decoration', 'none');
		stroking = false;
	})
})


function resetRotate(){
	//alert('resetRotate');
	$('#reverseX').css('color', '#A3FFA3');
	$('#reverseY').css('color', '#A3FFA3');
	$('#rotate90').css('color', '#A3FFA3');
	$('#rotate180').css('color', '#A3FFA3');
	$('#reverseX').css('text-decoration', 'none');
	$('#reverseY').css('text-decoration', 'none');
	$('#rotate90').css('text-decoration', 'none');
	$('#rotate180').css('text-decoration', 'none');
	reversingX = false;
	reversingY = false;
	rotating90 = false;
	rotating180 = false;
}


$(document).ready(function(){
	$('#reverseX').click(function(){
		resetRotate();
		$('#reverseX').css('color', 'white');
		$('#reverseX').css('text-decoration', 'underline');
		reversingX = true;
	});
	$('#reverseY').click(function(){
		resetRotate();
		$('#reverseY').css('color', 'white');
		$('#reverseY').css('text-decoration', 'underline');
		reversingY = true;
	});
	$('#rotate90').click(function(){
		//alert('rotating90');
		resetRotate();
		$('#rotate90').css('color', 'white');
		$('#rotate90').css('text-decoration', 'underline');
		rotating90 = true;
	});
	$('#rotate180').click(function(){
		resetRotate();
		$('#rotate180').css('color', 'white');
		$('#rotate180').css('text-decoration', 'underline');
		rotating180 = true;
	});
});

function pencilStyle(){
	if(!pencils){
		$('#pencilList').css('display', 'inline-block');
	}else if(pencils){
		$('#pencilList').css('display', 'none');
	}
}

function rotateListStyle(){
	if(!rotate){
		$('#rotateList').css('display', 'inline-block');
	}else if(rotate){
		$('#rotateList').css('display', 'none');
	}
}

$(document).ready(function(){
	$('#bar').hover(function(){
	if(rotate)
		$('#rotateList').fadeIn(250);
		$('#bar').mouseleave(function(){
			setTimeout(listStyleCallback, 2500);
		})
	})
})

$(document).ready(function(){
	$('#bar').hover(function(){
	if(pencils)
		$('#pencilList').fadeIn(250);
		$('#bar').mouseleave(function(){
			setTimeout(listStyleCallback, 2500);
		})
	})
})


function listStyleCallback(){
	if(!onBar && rotate) {$('#rotateList').fadeOut(1000);}
	if(!onBar && pencils) {$('#pencilList').fadeOut(1000);}
}


$(document).ready(function(){
	$('#bar').hover(function(){
		onBar = true;
	})
	$('#bar').mouseleave(function(){
		onBar = false;
	})
})


function distance(x,y){
	return Math.sqrt(x*x + y*y);
}

function angleFinder(x1, y1, x2, y2){
	var product = x1*x2 + y1*y2;
	var mag = distance(x1,y1)*distance(x2,y2);
	return Math.acos(product/mag);
}

function angleCalc(x1, y1, x2, y2){
	var theta = angleFinder(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2));

	if((y1 >= 0 && x1 >=0) || (y1 >= 0 && x1 <=0)) {
		var product = x1*x2 + y1*y2;
		var mag = distance(x1, y1)*distance(x2, y2);
		return Math.acos(product/mag);
	}
	if(y1 <= 0 && x1 <= 0){
		var product = x1*x2 + y1*y2;
		var mag = distance(x1, y1)*distance(x2, y2);
		return Math.PI + theta;

	}else if(y1 <= 0 && x1 >=0){
		var product = x1*x2 + y1*y2;
		var mag = distance(x1, y1)*distance(x2, y2);
		return 2*Math.PI - theta;
	}
}

function rotater2(center_x, center_y, point_x, point_y, angle){
	var length = distance(point_x - center_x, point_y - center_y);
	var angle_1 = angleCalc(point_x - center_x, point_y - center_y, length, 0);
	var totalAngle = angle_1 + angle;
	var x_change = center_x + length*Math.cos(totalAngle) - point_x;
	var y_change = center_y + length*Math.sin(totalAngle) - point_y;
	return [x_change, y_change];
}

//positions all elements retrieved from the database relative to the bottom of the canvas
function shifter(currentCanvas, dbCanvas, shapes){
	var width = dbCanvas.width;
	var height = dbCanvas.height;
	var innerHeight = window.innerHeight;
	var innerWidth = window.innerWidth;

	if(dbCanvas.width <= innerWidth && currentCanvas.width > innerWidth ){
		setCanvasSize(canvas, innerWidth, innerHeight);
		setCanvasSize(bufferCanvas, innerWidth, innerHeight);
		currentCanvas.height = innerHeight;
	}

	var heightDiff = currentCanvas.height - dbCanvas.height;
	if(heightDiff > 0){
		for(var e in shapes){
			var len = shapes[e][2].length;
			for(var i = 0; i < len; i++){
				shapes[e][2][i].Y += heightDiff;
			}
		}
	}else if(heightDiff < 0){
		setCanvasSize(canvas, width, height);
		setCanvasSize(bufferCanvas, width, height);
	}
}

function wallMaker(){
	var wallCollisionRadius = 0;
	wallArray = [];
	console.log('wallArray: ', wallArray);
	for(var i = 0; i < 4; i++){
		//left wall
		if(i === 0){
			wallGen();
			wallArray[i].vertices = [[-2000, -canvas.height], [20 + 1000, -canvas.height], [20 + 1000, canvas.height], [-2000, canvas.height], [-2000, -canvas.height]];
			wallArray[i].X = -21 - 1000;
			wallArray[i].Y = canvas.height/2;
			wallArray[i].colour = 'red';
			wallArray[i].setOuterRadius = function(){
												return wallCollisionRadius;
			};
		}
		//right wall
		if(i === 1){
			wallGen();
			wallArray[i].vertices = [[-20 - 1000, -canvas.height], [2000, -canvas.height], [2000, canvas.height], [-20 - 1000, canvas.height], [-20 - 1000, -canvas.height + 80]];
			wallArray[i].X = canvas.width + 21 + 1000;
			wallArray[i].Y = canvas.height/2 - 30;
			wallArray[i].colour = 'red';
			wallArray[i].setOuterRadius = function(){
												return wallCollisionRadius;
			};
		}
		//bottom wall
		if(i === 2){
			wallGen();
			wallArray[i].vertices = [[-canvas.width/2, -20 - 1000], [canvas.width/2, -20 - 1000], [canvas.width/2, 2000], [-canvas.width/2, 2000], [-canvas.width/2, -20 - 1000]];
			wallArray[i].X = canvas.width/2;
			wallArray[i].Y = canvas.height + 21 + 1000;
			wallArray[i].colour = 'red';
			wallArray[i].setOuterRadius = function(){
												return wallCollisionRadius;
			};
		}
		//top wall
		if(i === 3){
			wallGen();
			wallArray[i].vertices = [[-canvas.width/2, -2000], [canvas.width/2, -2000], [canvas.width/2, 9 + 1000], [-canvas.width/2, 9 + 1000], [-canvas.width/2, -2000]];
			wallArray[i].X = canvas.width/2;
			wallArray[i].Y = 40 - 1050;
			wallArray[i].colour = 'red';
			wallArray[i].setOuterRadius = function(){
												return wallCollisionRadius;
			};
		}
	}
/*	wallGen();
	wallArray[0].vertices = [[0, 0], [canvas.width, 0], [canvas.width, canvas.height], [0, canvas.height], [0, 1], [-500, 1], [-500, canvas.height + 500],
	 													[canvas.width + 500, canvas.height + 500], [canvas.width + 500, -500], [-500, -500], [-500, 0], [0, 0]];
	wallArray[0].colour = 'red';
	wallArray[0].setOuterRadius = function(){
																return wallCollisionRadius;
														};
	wallArray[0].mass = Infinity;
	wallArray[0].momentOfInertia = Infinity;*/

	shapeSelection.shapes.wall[2] = wallArray;
}

function setCanvasSize(canvas, width, height){
	$(canvas).prop('width', width);
	$(canvas).prop('height', height);
	shapeSelection.canvas = {
		width: width,
		height: height
	};
	$('#navigation-bar').css({'width': width});
	$('.main-sidebar').css({'height': height + 100 + 'px'});
	$('#barnav').css({'width': width});
}
/*
function moveButons(){
	$( document ).ready(function() {
		$('#showScenes').css({'left': '-400px', 'top' : '15px'});
		//$('showOptions')
		//$('refresh')
	});
};


moveButons();*/

// customEvent Polyfill
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var canvasReadyEvent = new CustomEvent("canvasReady", {
  detail: {
    hazcheeseburger: true
  }
});


function init(){
	//displayData();
	//checkParameters();
	/*var arrow_keys_handler = function(e) {
    switch(e.keyCode){
		case 32: if(physics == true){
			physics = false;
		}else{
			physics = true;
		}
		e.preventDefault();
		break;
        default: break; // do not block other keys
    }
};
	window.addEventListener("keydown", arrow_keys_handler, false);*/

	selectPencilStroke();

	pencilCursor();
	zoomCursor();
	//if(tipping){tips.style.visibility = 'visible';}

	mousePos = 0;
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	setCanvasSize(canvas, window.innerWidth -230, window.innerHeight - 100);
	zoomCenter = [canvas.width/2, canvas.height/2];
	window.onresize = function(event) {
		/*canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');*/
		//setCanvasSize();
    };

	body = document.getElementById('body');

	bar = document.getElementById('bar');
	bar.style.width = window.innerWidth + 'px';;

	//tips = document.getElementById('tips');

	bufferCanvas = document.createElement('canvas');
  bufferCtx = bufferCanvas.getContext("2d");
  bufferCtx.canvas.width = context.canvas.width;
  bufferCtx.canvas.height = context.canvas.height;

	shapeSelection.canvas = {
		width: context.canvas.width,
		height: context.canvas.height
	};

	options();
	locate();
	mouseMove()
	mouseDown();
	mouseUp();
	eraser();
	animate();

	intervalRunning = true;
	playScenes = setInterval(animator, 1000 / frame_Rate);

	wallMaker();

	canvas.dispatchEvent(canvasReadyEvent);
}

function options(){
	circle = document.getElementById('circle');
	square = document.getElementById('square');
	triangle = document.getElementById('triangle');
	ReSize = document.getElementById('Re-Size');
	Zoom = document.getElementById('zoom');
	ReShape = document.getElementById('Re-Shape');
	Rotate = document.getElementById('Rotate');
	ChangeColour = document.getElementById('ChangeColour');
	none = document.getElementById('none');
	erase = document.getElementById('erase');
	save = document.getElementById('save');
	image = document.getElementById('canvasImg')
	customShape = document.getElementById('customShape');
	curve = document.getElementById('line');
	pencil_id = document.getElementById('pencil_id');
	//PickColor = document.getElementById('PickColor');
	Copy = document.getElementById('copy');
	Physics = document.getElementById('physics');
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();


function animate(){
	draw();
	requestAnimFrame(function() {
		animate();
	});
}


function locate(){
	onObject = false; // is onOject necessary now that select exists
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
		if(shapeSelection.shapes[key][2][i].selected){
			onObject = true;
		if(!dragging){
			//if(!pencils){
			if(!pencils && !zoomerizer){
				canvas.style.cursor = cursor_drag;
				}
			}
		}
	}if(onObject == false){
			if(!pencils && !zoomerizer){
				canvas.style.cursor = "auto";
			}
		}
	}
}

function mouseMove(){
	canvas.addEventListener('mousemove', function(evt){
	mousePos = getMousePos(evt, canvas);
	if(!select){copying = true;}
	locate();
	pencilPoints();
	if(!dragging) { // The if(!dragging) condition ensures the shape being dragged is the only one that is highlighted
		selected();
	}
	//merge();
	physMove();
	}, false)
}

function mouseDown(){
	canvas.addEventListener('mousedown', function(evt){
	mouse_down = true;
	if(shapeSelection.shapes.curve.curveArray){ console.log(shapeSelection.shapes.curve.curveArray.length);}
	eraser();
	rotater();
	rotation20();
	reSizer();
	drag();
	pointStart();
	reShaper();
	physTest();
	//onRotateDial = true;
	var points = [1,1];
	var arrays = [[1,2], [2,2], [3,3]];
	if(pencils){startPencil = true;}
	}, false)
}


function mouseUp(){
	canvas.addEventListener('mouseup', function(evt){
	mouse_down = false;
	onSlider = false;
	onRotator = false;
	onRotateDial = false;
	startPencil = false;
	superPencilPointsMachine();
	copyShape();
	drop();
	stopResize();
	if(reShape){offReshaper();}
	clearPhysMove();
	}, false)
}

// this function generates initial set of points (pencilPointsArray) which eventually define the individual strokes and shapes
function pencilPoints(){
	if(pencils && startPencil){
		pencilPointsArray.push([mousePos.x, mousePos.y]);
	}
}

//superPencilPointsMachine() uses pencilPointsArray to create an array of strokes and shapes
function superPencilPointsMachine(){
	if(pencils)
		superPencilPoints.push(pencilPointsArray);
}


function pencilCursor(){
	if(pencils) {
		$('canvas').css('cursor', 'url(images/pencil_cursor.png) 0 15, auto');
	}else{
		$('canvas').css('cursor', 'default');
	}
}

function zoomCursor(){
	if(zoomerizer) {
		$('canvas').css('cursor', 'url(https://s3.amazonaws.com/simuL8rBucket/images/icons/zoom-cursor.png) 8 15, auto');
	}else{
		$('canvas').css('cursor', 'default');
	}
}


function selectPencilStroke(){
	$('#shapes').css('color', 'white');
	$('#shapes').css('text-decoration', 'underline');
	pencil_id = document.getElementById('pencil_id');
	hover(pencil_id);
}

function drag(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(shapeSelection.shapes[key][2][i].selected && !dragging && !onReshape && !onSlider && !onRotator && !shapeSelection.shapes[key][2][i].expand && !shapeSelection.shapes[key][2][i].v_expand && !shapeSelection.shapes[key][2][i].h_expand){ // remove the expand conditions when the expand box is resized around the shape
				offcenter[0] = shapeSelection.shapes[key][2][i].X - mousePos.x;
				offcenter[1] = shapeSelection.shapes[key][2][i].Y - mousePos.y;
				dragging = true;
				shapeSelection.shapes[key][2][i].dragging = true;
				shapeSelection.shapes[key][2][i].onObject = true;
				shapeSelection.shapes[key][2][i].locateTouchPoint();
				shapeSelection.shapes[key][2][i].velocity = [0, 0];
				if(!pencils && !zoomerizer) {canvas.style.cursor = cursor_grab;}
				//if(physics){
					//shapeSelection.shapes[key][2][i].lineWidth = 4;
					selectedShape[0] = shapeSelection.shapes[key][2][i];
					selectedShape[1] = key;
					console.log('selectedShape: ', selectedShape)
				//}
				/*if(selectedShape[0] && selectedShape[1] !== 'wall'){
					//selectedShape[0].velocity = [2, 2];
					console.log('fghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
				}*/
			}
		}
	}
}

function selected(){
	select = false;
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			shapeSelection.shapes[key][2][i].selected = false;
			//shapeSelection.shapes[key][2][i].lineWidth = 0.7;
			bufferCtx.beginPath();
			bufferCtx.moveTo(shapeSelection.shapes[key][2][i].vertices[0][0] + shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].vertices[0][1] + shapeSelection.shapes[key][2][i].Y);

			for(var j = 0; j < shapeSelection.shapes[key][2][i].vertices.length; j++){
				bufferCtx.lineTo(shapeSelection.shapes[key][2][i].vertices[j][0] + shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].vertices[j][1] + shapeSelection.shapes[key][2][i].Y);
			}
			if(bufferCtx.isPointInPath(mousePos.x, mousePos.y) && !select){
				if(distance(shapeSelection.shapes[key][2][i].slider[0] - mousePos.x, shapeSelection.shapes[key][2][i].slider[1] - mousePos.y) >= 10){
					shapeSelection.shapes[key][2][i].selected = true;
					//shapeSelection.shapes[key][2][i].lineWidth = 4;
					select = true;
				}
			}
		}
	}
}

function drop(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			dragging = false;
			shapeSelection.shapes[key][2][i].dragging = false;
			shapeSelection.shapes[key][2][i].onObject = false;
			if(!pencils && !zoomerizer) canvas.style.cursor = cursor_drag;
		}
	}
}


function eraser(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(shapeSelection.shapes[key][2][i].selected && deletion){
				shapeSelection.shapes[key][2].splice(i,1);
				//canvas.style.cursor = cursor_grab;
			}
		}
	}
}


function reSizer(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(shapeSelection.shapes[key][2][i].selected && reSize){
			/** make sure that only one object at time can be resized **/
			shapeSelection.shapes[key][2][i].expandBox = true;
			for(keys in shapeSelection.shapes){
				if(keys != 'userID' && keys != 'isPublic' && keys != 'name'){
					for(var j = 0; j < shapeSelection.shapes[keys][2].length; j++){
						if(key != keys){
							shapeSelection.shapes[keys][2][j].expandBox = false;}
						else {
							if(j != i){
								shapeSelection.shapes[keys][2][j].expandBox = false;
							}
						}
					}
				}
			}
		}

				// detects if cursor is over any of the small expansion boxes at the corners
							/** top-left **/
				if((distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
							/** bottom-right **/
					distance(shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2 ||
							/** top-right **/
					distance(shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
							/** bottom-left **/
					distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2

				)&& shapeSelection.shapes[key][2][i].expandBox){
					shapeSelection.shapes[key][2][i].expand = true;
					if(!pencils) canvas.style.cursor = cursor_grab;
				}


				// detects if cursor is over any of the small expansion boxes at the right and left handsides
							/** left **/
				if((distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y - mousePos.y) <= smallBox/2 ||
							/** right **/
					distance(shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection.shapes[key][2][i].Y - mousePos.y) <= smallBox/2

				) && shapeSelection.shapes[key][2][i].expandBox){
				if(key == 'customShape' || 'Square' || 'Triangle'/* temporary condition*/){
					shapeSelection.shapes[key][2][i].h_expand = true;
					}
					if(!pencils) canvas.style.cursor = cursor_grab;
				}


				// detects if cursor is over any of the small expansion boxes at the top and bottom sides
							/** top **/
				if((distance(shapeSelection.shapes[key][2][i].X - mousePos.x, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
							/** bottom **/
					distance(shapeSelection.shapes[key][2][i].X - mousePos.x, shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2

				)&& shapeSelection.shapes[key][2][i].expandBox){
				if(key == 'customShape' || 'Square' || 'Triangle'/* temporary condition*/){
					shapeSelection.shapes[key][2][i].v_expand = true;
					}
					if(!pencils) canvas.style.cursor = cursor_grab;
				}
			}
		}
	}

function stopResize(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			expand = false;
			//if(shapeSelection.shapes[key][2][i].v_expand || shapeSelection.shapes[key][2][i].h_expand){shapeSelection.shapes[key][2][i].stretchRadius = shapeSelection.shapes[key][2][i].radius;}
			if(shapeSelection.shapes[key][2][i].expand || shapeSelection.shapes[key][2][i].v_expand || shapeSelection.shapes[key][2][i].h_expand){
				shapeSelection.shapes[key][2][i].stretchRadius = shapeSelection.shapes[key][2][i].radius;
				shapeSelection.shapes[key][2][i].calculateMass(shapeSelection.shapes[key][2][i].vertices, shapeSelection.shapes[key][2][i].boundingRectangle.width, shapeSelection.shapes[key][2][i].boundingRectangle.height, resolution);
			}
			shapeSelection.shapes[key][2][i].expand = false;
			shapeSelection.shapes[key][2][i].v_expand = false;
			shapeSelection.shapes[key][2][i].h_expand = false;
			}
		}
	}

/** pointStart() adds points to the pointsArray on mousedown **/
function pointStart(){
	if((shapes || line) && !onObject && !select){
		startDraw = true;
		if(!closedPath){
			var lastpoint = pointsArray[pointsArray.length - 1];
			pointsArray.push([mousePos.x, mousePos.y]);
			clickCount = 1;
			if(pointsArray.length > 1){
				if(pointsArray[0] && distance(mousePos.x - lastpoint[0], mousePos.y - lastpoint[1]) < closePathRadius){
					clickCount += 1;
				}
			}
		}else{
			pointsArray.push([pointsArray[0][0], pointsArray[0][1]]); // adds the coordinates of the first point to the pointsArray again when clicking on them in order to closePath
			startDraw = false;
		}
	}
}

function rotateListSwitch(key, vertices, i){
	switch(true){
		case reversingX:
			shapeSelection.shapes[key][2][i].reverseX(vertices)
		break;
		case reversingY:
			shapeSelection.shapes[key][2][i].reverseY(vertices)
		break;
		case rotating90:
			shapeSelection.shapes[key][2][i].rotate90(vertices)
		break;
		case rotating180:
			shapeSelection.shapes[key][2][i].rotate180(vertices)
		break;
	}
}

function rotater(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(shapeSelection.shapes[key][2][i].selected && rotate){
				shapeSelection.shapes[key][2][i].referencer();
				var vertices = shapeSelection.shapes[key][2][i].vertices;
				rotateListSwitch(key, vertices, i);
				/*if(!shapeSelection.shapes[key][2][i].rotationLine){  										//sets the global sliderPosition equal to the objects sliderPosition
					sliderPosition = shapeSelection.shapes[key][2][i].sliderPosition;
				}*/
			shapeSelection.shapes[key][2][i].rotationLine = true;

			// makes sure that only one object at time can be rotated
			for(keys in shapeSelection.shapes){
				if(keys != 'userID' && keys != 'isPublic' && keys != 'name'){
					for(var j = 0; j < shapeSelection.shapes[keys][2].length; j++){
						if(key != keys){
							shapeSelection.shapes[keys][2][j].rotationLine = false;
						}
						else{
							if(j != i){
								shapeSelection.shapes[keys][2][j].rotationLine = false;
							}
						}
					}
				}
			}
				} // detects if cursor is hovering over slider
				var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);
				//var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x, mousePos.y], zoom);
				if(distance(shapeSelection.shapes[key][2][i].slider[0] - projMouse.x, shapeSelection.shapes[key][2][i].slider[1] - projMouse.y) <= 10){
					onSlider = true;
				}
			}
		}
	}

	function rotation20(){
		for(key in shapeSelection.shapes){
			for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
				if(shapeSelection.shapes[key][2][i].selected && rotate){
					//shapeSelection.shapes[key][2][i].referencer();
					var vertices = shapeSelection.shapes[key][2][i].vertices;
					rotateListSwitch(key, vertices, i);
					if(!shapeSelection.shapes[key][2][i].rotationLine){  										//sets the global sliderPosition equal to the objects sliderPosition
						sliderPosition = shapeSelection.shapes[key][2][i].sliderPosition;
					}

				// shapeSelection.shapes[key][2][i].rotationLine = true;

				// makes sure that only one object at time can be rotated
				// for(keys in shapeSelection.shapes){
				// 	if(keys != 'userID' && keys != 'isPublic' && keys != 'name'){
				//
				//
				// 		for(var j = 0; j < shapeSelection.shapes[keys][2].length; j++){
				// 			if(key != keys){
				// 				shapeSelection.shapes[keys][2][j].rotationLine = false;
				// 			}
				// 			// else{
				// 			// 	if(j != i){
				// 			// 		shapeSelection.shapes[keys][2][j].rotationLine = false;
				// 			// 	}
				// 			// }
				//
				//
				// 		}
				// 	}
				// }
					} // detects if cursor is hovering over slider
					var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);
					//var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x, mousePos.y], zoom);
					if(distance(shapeSelection.shapes[key][2][i].X - projMouse.x, shapeSelection.shapes[key][2][i].Y - 200 - projMouse.y) <= 10){
						onRotateDial = true;
						console.log('onRotateDial=====================================>', onRotateDial);
					}
				}


			}
		}

function referencer(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(distance(shapeSelection.shapes[key][2][i].slider[0] - mousePos.x, shapeSelection.shapes[key][2][i].slider[1] - mousePos.y) <= 100000){
				shapeSelection.shapes[key][2][i].referencer();
			}
		}
	}
}

/** this function detects whether or not a user has clicked on a vertex **/
function reShaper(){
	if(reShape){
		for(key in shapeSelection.shapes){
			for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
				for(var j = 0; j < shapeSelection.shapes[key][2][i].vertices.length; j++){
					shapeSelection.shapes[key][2][i].vertices[j][2] = false;
					var Xpoint = shapeSelection.shapes[key][2][i].vertices[j][0] + shapeSelection.shapes[key][2][i].X;
					var Ypoint = shapeSelection.shapes[key][2][i].vertices[j][1] + shapeSelection.shapes[key][2][i].Y;
					if(distance(Xpoint - mousePos.x, Ypoint - mousePos.y)< 5){
						shapeSelection.shapes[key][2][i].vertices[j][2] = true;
						currentlyReshaping = key;
					}
				}
			}
		}
	}
}


function offReshaper(){
	for(key in shapeSelection.shapes){ //Very inefficient! this part of the code gets called 7 times on mouseup
		var centralDifference = [0,0];
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
		/** this section calculates the coordinates of the centroid **/
		shapeSelection.shapes[key][2][i].centroid = [0,0];
		for(var k = 0; k < shapeSelection.shapes[key][2][i].pointsArray.length - 1; k++){
			//if(k == 0){continue;}else{
			shapeSelection.shapes[key][2][i].centroid[0] += shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].vertices[k][0];
			shapeSelection.shapes[key][2][i].centroid[1] += shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].vertices[k][1];
			//}
		}
		shapeSelection.shapes[key][2][i].centroid[0] /= (shapeSelection.shapes[key][2][i].pointsArray.length - 1);
		shapeSelection.shapes[key][2][i].centroid[1] /= (shapeSelection.shapes[key][2][i].pointsArray.length - 1);

		// the code below calculates the difference between the centroid and the current position of the center (X,Y)
		centralDifference[0] = shapeSelection.shapes[key][2][i].centroid[0] - shapeSelection.shapes[key][2][i].X;
		centralDifference[1] = shapeSelection.shapes[key][2][i].centroid[1] - shapeSelection.shapes[key][2][i].Y;

		var rotDifference_x = 0;
		var rotDifference_y = 0;

		var Difference_x = centralDifference[0];
		var Difference_y = centralDifference[1];

		// this difference is subtracted from the vertices so that they do not move when the X,Y values are eventually updated (by setting them equal to the centroid)
		for(var m = 0; m < shapeSelection.shapes[key][2][i].pointsArray.length; m++){
			shapeSelection.shapes[key][2][i].vertices[m][0] -= Difference_x;
			shapeSelection.shapes[key][2][i].vertices[m][1] -= Difference_y;
		}

		/** the shape's X and Y properties are set equal to the centroid **/
		//the vertices remain in the same position because the difference has been subtracted from them
		shapeSelection.shapes[key][2][i].X = shapeSelection.shapes[key][2][i].centroid[0];
		shapeSelection.shapes[key][2][i].Y = shapeSelection.shapes[key][2][i].centroid[1];

		for(var j = 0; j < shapeSelection.shapes[key][2][i].vertices.length; j++){
			shapeSelection.shapes[key][2][i].vertices[j][2] = false;
			}
			shapeSelection.shapes[key][2][i].referencer();
			shapeSelection.shapes[key][2][i].findOuterRadius();
			if(currentlyReshaping == key){
				shapeSelection.shapes[key][2][i].calculateMass(shapeSelection.shapes[key][2][i].vertices, shapeSelection.shapes[key][2][i].boundingRectangle.width, shapeSelection.shapes[key][2][i].boundingRectangle.height, resolution);
			}
		}
	//}
	}
}

function copyShape(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(copy && copying && shapeSelection.shapes[key][2][i].selected){
				copying = false;
				var newShape = {}; // newshape is initialised and all its properties are copied to it from the original shape
				for(var e in shapeSelection.shapes[key][2][i]){
					newShape[e] = shapeSelection.shapes[key][2][i][e];
				}
				newShape.rotationLine = false;
				newShape.expandBox = false;

				//if(key !== 'circle'){
					newShape.vertices = [];
					newShape.referenceVertices = [];
					for(var j = 0; j < shapeSelection.shapes[key][2][i].vertices.length; j++){ // this loops ensures that referenceVertices and vertices arrays of the new shape are not simply referencing the original
						newShape.vertices[j] = shapeSelection.shapes[key][2][i].vertices[j];
						newShape.referenceVertices[j] = shapeSelection.shapes[key][2][i].referenceVertices[j];
					}

					for(var n = 0; n < shapeSelection.shapes[key][2][i].pointsArray.length; n++){ //pointsArray must be reset for each copy otherwise it would be fixed for all the descendants of a copied shape
						newShape.pointsArray[n] = [[],[]];
						newShape.pointsArray[n][0] = shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].vertices[n][0];
						newShape.pointsArray[n][1] = shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].vertices[n][1];
					}

					newShape.X = 0; // newShape's X and Y coordinates are set to zero so that the centralize function can work properly
					newShape.Y = 0;

					var k;
					centralize(newShape, newShape.pointsArray, k);
				//}
					newShape.X = mousePos.x + 5; //places the new copy near where the cursor is
					newShape.Y = mousePos.y + 5;
					if(!copying){shapeSelection.shapes[key][2].push(newShape);}
			}
		}
	}
}


function rotateObject(shape, angle){
	for(var i = 0; i < shape.length; i++){
		var rotation = rotater2(0, 0, shape[i][0], shape[i][1], angle);
		shape[i][0] += rotation[0];
		shape[i][1] += rotation[1];
	}
}


//calculates the closest vertex to a given point from an array of vertices
function closestPoint(point, array){
	var distances = array.map(function(ele){
		return distance(ele[0] - point[0], ele[1] - point[1]);
	})

	var min = function(){
		return Math.min.apply(null, distances);
	}

	for(var i = 0; i < distances.length; i++){
		if(distances[i] === min()){
			return array[i];
		}
	}
}

function animator(){
	for(key in shapeSelection.shapes){
		if(key != 'userID' && key != 'isPublic' && key != 'name'){
			for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
				if(physics){
					shapeSelection.shapes[key][2][i].X += shapeSelection.shapes[key][2][i].velocity[0];
					shapeSelection.shapes[key][2][i].Y += shapeSelection.shapes[key][2][i].velocity[1];
					for(var n = 0; n < shapeSelection.shapes[key][2][i].vertices.length; n++){
						var rot = rotater2(0, 0, shapeSelection.shapes[key][2][i].vertices[n][0], shapeSelection.shapes[key][2][i].vertices[n][1], shapeSelection.shapes[key][2][i].angularVelocity);
						shapeSelection.shapes[key][2][i].vertices[n][0] += rot[0];
						shapeSelection.shapes[key][2][i].vertices[n][1] += rot[1];
					}
				}
			}
		}
	}
	collisionDetector();
}

function getMousePos(evt, canvas) {       //canvas.addEventListener uses this function to calculate mouse position
	var rect = canvas.getBoundingClientRect();

	if(evt.clientX && evt.clientY){
		var x = evt.clientX - rect.left;
		var y = evt.clientY - rect.top;
	}

	//if(evt.which === 37 || evt.which === 38 || evt.which === 39 || evt.which === 40){
	if(isShifting(evt)){
		var x = mousePos.xPhysical;
		var y = mousePos.yPhysical;
	}

	var shiftedX = x - zoom * shift[0];
	var shiftedY = y - zoom * shift[1];

	var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [shiftedX, shiftedY], 1/zoom);

	var zoomedX = proj.x;
	var zoomedY = proj.y;

	return {
			x: zoomedX,
			y: zoomedY,
			xPhysical: x,
			yPhysical: y
		};
	}

function rotationRecalculation(shape){
	for(var i = 0; i < shape.pointsArray.length; i++){
		var rot = rotater2(0, 0, shape.referenceVertices[i][0], shape.referenceVertices[i][1], sliderPosition*2*Math.PI/sliderButtonWidth);
		rotVertices2[i] = [0,0];
		rotVertices2[i][0] = rot[0];
		rotVertices2[i][1] = rot[1];
	}
}

var side = 55;
function CustomShape(){
	this.isFixed = false;
	this.isAsleep = false;
	this.id = 1;
	this.contactList = [];
	this.pointsArray = pointsArray;
	this.centroid = [0,0];
	this.vertices = [];
	this.referenceVertices = [];
	this.X = 0;
	this.Y = 0;
	this.mass = 0;
	this.momentOfInertia = 0;
	this.gravity = true;
	this.rotationalKineticEnergy = 0;
	this.translationalKineticEnergy = 0;
	this.velocity = [0,0];
	this.angularVelocity = 0;
	this.radius = 50;
	this.distances = [];
	this.findOuterRadius = function(){
		this.distances = this.vertices.map(function(vertex){
			//return distance(vertex[0] + 50, vertex[1] + 50);
			return distance(vertex[0], vertex[1]);
		})
	};
	this.outerRadius = 0;
	this.setOuterRadius = function(){
		this.outerRadius = Math.max.apply(null, this.distances);
		//return Math.max.apply(null, this.distances);
		return this.outerRadius;
	}

	this.boundingRectangle = {minX:0, minY:0, width:0, height:0};

	/**** Bounding Rectangle X coordinates ****/
	this.distancesX = [];
	this.findBoundingRectX = function(){
		this.distancesX = this.vertices.map(function(vertex){
			return vertex[0];
		})
	};
	this.boundingRectMaxX = 0;

	this.findBoundingRectMaxX = function(){
		this.findBoundingRectX();
		this.boundingRectMaxX = Math.max.apply(null, this.distancesX);
		return this.boundingRectMaxX;
	};

	this.boundingRectMinX = 0;

	this.findBoundingRectMinX = function(){
		this.findBoundingRectX();
		this.boundingRectMinX = Math.min.apply(null, this.distancesX);
		return this.boundingRectMinX;
	};


	/**** Bounding Rectangle Y coordinates ****/
	this.distancesY = [];
	this.findBoundingRectY = function(){
		this.distancesY = this.vertices.map(function(vertex){
			return vertex[1];
		});
	};

	this.boundingRectMaxY = 0;

	this.findBoundingRectMaxY = function(){
		this.findBoundingRectY();
		this.boundingRectMaxY = Math.max.apply(null, this.distancesY);
		return this.boundingRectMaxY;
	};
	this.boundingRectMinY = 0;

	this.findBoundingRectMinY = function(){
		this.findBoundingRectY();
		this.boundingRectMinY = Math.min.apply(null, this.distancesY);
		return this.boundingRectMinY;
	};

	this.makeBoundingRect = function(){
		this.boundingRectangle = {minX:this.findBoundingRectMinX(), minY:this.findBoundingRectMinY(), width:this.findBoundingRectMaxX() - this.findBoundingRectMinX(), height:this.findBoundingRectMaxY() - this.findBoundingRectMinY()};
	};

	this.preCollision = false;
	this.collision = false;
	this.collisionPoint = {x:0, y:0, velocity:[0,0]};
	this.stretchRadius = 50;
	this.onObject = false;
	this.dragging = false;
	this.colour = '#6d9eeb';
	this.expand = false;
	this.h_expand = false;
	this.v_expand = false;
	this.expandBox = false;
	this.sliderPosition = 0;
	this.rotationLine = false;
	this.selected = false;
	this.slider = [0, 0];
	this.rotater = [0, 0];
	this.copy = true;
	this.lineColour = 'black';
	this.lineWidth = 0.7;
	this.touchPoints = [0,0];

	this.locateTouchPoint = function(){
		this.touchPoints = [mousePos.x - this.X, mousePos.y - this.Y];
	}

	this.pickColour = function(){
		this.colour = chooseColour();
	}

	this.resize = function(){

		var gap;

		var rotVertices_2 = [];
		for(var i = 0; i < this.pointsArray.length; i++){

		/** Apply change of size transformation **/

			if(this.expand){
				gap = Math.sqrt(2)*(this.stretchRadius + selectSize) - this.stretchRadius;
				this.vertices[i][0] *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.stretchRadius;
				this.vertices[i][1] *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.stretchRadius;
				this.findOuterRadius();
			}

		/** Apply change of size transformation to the horizonal axis **/

			if(this.h_expand){
				gap = selectSize;
				this.vertices[i][0] *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.stretchRadius;
				this.findOuterRadius();
			}

		/** Apply change of size transformation to the vertical axis **/

			if(this.v_expand){
				gap = selectSize;
				this.vertices[i][1] *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.stretchRadius;
				this.findOuterRadius();
			}

		}
		if(this.expand){
			this.radius *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.radius};
			this.stretchRadius *= (distance(mousePos.x - this.X, mousePos.y - this.Y) - gap)/this.stretchRadius;
			this.referencer();
			this.findOuterRadius();
	}

	this.referencer = function(){
		for(var p = 0; p < this.pointsArray.length; p++){
			this.referenceVertices[p] = [0,0];
			this.referenceVertices[p][0] = this.vertices[p][0];
			this.referenceVertices[p][1] = this.vertices[p][1];
		}
		sliderPosition = 0;
		this.sliderPosition = 0;
		rotationRecalculation(this); // this function makes sure that the values in the rotVertices2 array are changed to match sliderPosition = 0
	}

	this.rotate = function(){ // this.rotate uses this.referenceVertices as a point of reference for calculating rotated points
		var rot = [];
		if(rotVertices2[0]){
				for(var I = 0; I < this.pointsArray.length; I++){
					this.vertices[I][0] -= rotVertices2[I][0];
					this.vertices[I][1] -= rotVertices2[I][1];
				}
			}

		for(var i = 0; i < this.pointsArray.length; i++){
			var rot = rotater2(0, 0, this.referenceVertices[i][0], this.referenceVertices[i][1], sliderPosition*2*Math.PI/sliderButtonWidth);
				rotVertices2[i] = [0,0];
				rotVertices2[i][0] = rot[0];
				rotVertices2[i][1] = rot[1];

				this.vertices[i][0] += rot[0];
				this.vertices[i][1] += rot[1];
			}
		}

	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointsArray are used by the centralize function to calculate this.vertices


	this.reverseX = function(vertices){
		for(var n = 0; n < vertices.length; n++){
			vertices[n][0] *= -1;
		}
		this.referencer();
	}


	this.reverseY = function(vertices){
		for(var n = 0; n < vertices.length; n++){
			vertices[n][1] *= -1;
		}
		this.referencer();
	}


	this.rotate180 = function(vertices){
		for(var n = 0; n < vertices.length; n++){
			vertices[n][0] *= -1;
			vertices[n][1] *= -1;
		}
		this.referencer();
	}

	this.rotate90 = function(vertices){
			for(var n = 0; n < vertices.length; n++){
				var rot = rotater2(0, 0, this.vertices[n][0], this.vertices[n][1], Math.PI*sliderButtonWidth/4);
				vertices[n][0] += rot[0];
				vertices[n][1] += rot[1];
			}
		this.referencer();
	}

	// set initial collision state to false for each vertex
	this.setVertexCollision = function(vertices){
		for(var n = 0; n < vertices.length; n++){
			this.vertices[n][3] = {collision: false};
		}
	}

	this.calculateMass = function(vertices, width, height, resolution){
		var unitSquares = 0;
		var mass = 0;
		var momentOfInertia = 0;
		var centroid = [0, 0];
		var centroidOffset = [0, 0];
		var checkPoint = []; //checkPoint is the point that is currently being checked
		var squaresX = Math.ceil(width/resolution);
		var squaresY = Math.ceil(height/resolution);


		/** Calculate mass **/

		for(var i = 0; i < squaresY; i++){// code repetition(see below): consider using a function
			for(var j = 0; j < squaresX; j++){
				checkPoint[0] = resolution * j + this.boundingRectangle.minX;
				checkPoint[1] = resolution * i + this.boundingRectangle.minY;

				bufferCtx.beginPath();
				bufferCtx.moveTo(vertices[0][0], vertices[0][1]);
				for(var m = 0; m < vertices.length; m++){// these lines draw out the shape that is being checked
					bufferCtx.lineTo(vertices[m][0], vertices[m][1]);
				}
				if(bufferCtx.isPointInPath(checkPoint[0], checkPoint[1])){
					unitSquares++;
					centroid[0] += checkPoint[0] + this.X;
					centroid[1] += checkPoint[1] + this.Y;
				}
			}
		}
		centroid[0] = centroid[0]/unitSquares;
		centroid[1] = centroid[1]/unitSquares;

		centroidOffset[0] = this.X - centroid[0];
		centroidOffset[1] = this.Y - centroid[1];

		this.X = centroid[0];
		this.Y = centroid[1];

		for(var n = 0; n < this.vertices.length; n++){
			this.vertices[n][0] += centroidOffset[0];
			this.vertices[n][1] += centroidOffset[1];
		}

		mass = (resolution * resolution) * unitSquares * massToPixelRatio;

		this.mass = mass;


		/** Calculate moment of inertia **/

		for(var i = 0; i < squaresY; i++){// code repetition(see above): consider using a function
			for(var j = 0; j < squaresX; j++){
				checkPoint[0] = resolution * j + this.boundingRectangle.minX;
				checkPoint[1] = resolution * i + this.boundingRectangle.minY;

				bufferCtx.beginPath();
				bufferCtx.moveTo(vertices[0][0], vertices[0][1]);
				for(var m = 0; m < vertices.length; m++){// these lines draw out the shape that is being checked
					bufferCtx.lineTo(vertices[m][0], vertices[m][1]);
				}
				if(bufferCtx.isPointInPath(checkPoint[0], checkPoint[1])){
					momentOfInertia += (resolution * resolution) * massToPixelRatio * (distance(checkPoint[0] - this.X, checkPoint[1] - this.Y) * distance(checkPoint[0] - this.X, checkPoint[1] - this.Y)) * scale * scale;
				}
			}
		}

		this.momentOfInertia = momentOfInertia;
		//console.log('unitSquares:', unitSquares, 'squaresX: ', squaresX, 'squaresY: ', squaresY, 'mass: ', mass, 'momentOfInertia: ', momentOfInertia, 'vertices:', vertices, 'centroid:', centroid, 'boundingRectangle:', this.boundingRectangle, 'centroidOffset:' ,centroidOffset);
	};

}

function customShapeGen(){
	var customShape = new CustomShape();
	customShapeArray[customShapeArray.length] = customShape;
	customShape.findOuterRadius();
	customShape.setVertexCollision(customShape.vertices);
	numberOfShapes++;
	customShape.id = numberOfShapes;
	customShape.makeBoundingRect();
	customShape.calculateMass(customShape.vertices, customShape.boundingRectangle.width, customShape.boundingRectangle.height, resolution);
}

function Walls(){
	this.mass = Infinity;
	this.momentOfInertia = Infinity;
	this.side = 60;
	this.defaultSide = 60;
	this.velocity = [0, 0];
	this.pointsArray = [[1, 1], [3, 3], [4, 4], [5, 5], [6, 6]];
	this.vertices = [];
	this.radius = this.side/2;
	this.stretchRadius = this.side/2;
	this.copy = true;
	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointArray are used by the centralize function to calculate this.vertices
}

function wallGen(){
	var wall = new Walls();
	wallArray[wallArray.length] = wall;
	wall.findOuterRadius();
}

Walls.prototype = new CustomShape();

function Curves(){
	this.pointsArray = pointsArray;
	this.centroid = [0, 0];
	this.vertices = [0, 0];
	this.velocity = [0, 0];
	this.copy = true;
	this.stroking = pointStroking;
	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointsArray are used by the centralize function to calculate this.vertices
}

function curveGen(){
	var curve = new Curves();
	curveArray[curveArray.length] = curve;
	numberOfShapes++;
	curve.id = numberOfShapes;
}

Curves.prototype = new CustomShape();


function Square(){
	this.side = 55/zoom;
	this.defaultSide = 55/zoom;
	this.velocity = [0, 0];
	this.pointsArray = [
						[mousePos.x - this.side/2, mousePos.y + this.side/2],
						[mousePos.x + this.side/2, mousePos.y + this.side/2],
						[mousePos.x + this.side/2, mousePos.y - this.side/2],
						[mousePos.x - this.side/2, mousePos.y - this.side/2],
						[mousePos.x - this.side/2, mousePos.y + this.side/2]
					];

	this.vertices = [];
	this.radius = 2*this.side/3 - 5;
	this.stretchRadius = 2*this.side/3;
	this.copy = true;
	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointArray are used by the centralize function to calculate this.vertices
}

Square.prototype = new CustomShape();

function squareGen(){
	if(onObject == false){
		var square = new Square();
		squareArray[squareArray.length] = square;
		square.findOuterRadius();
		square.setVertexCollision(square.vertices);
		numberOfShapes++;
		square.id = numberOfShapes;
		square.makeBoundingRect();
		square.calculateMass(square.vertices, square.boundingRectangle.width, square.boundingRectangle.height, resolution);
	}
}


function Circle(){
	circularArray = [];
	this.side = 55/zoom;
	this.defaultSide = 55/zoom;
	this.velocity = [0,0];
	this.pointsArray = [];
	var points = 50;
	var radius = 30/zoom;
	for(var i = 0; i < points; i++){
		var x = radius * Math.cos(i*2*Math.PI/points);
		var y = radius * Math.sin(i*2*Math.PI/points);
		circularArray.push([x, y]);
	}
	for(var i = 0; i < points; i++){
		this.pointsArray[i] = [0,0];
		this.pointsArray[i][0] = mousePos.x + circularArray[i][0];
		this.pointsArray[i][1] = mousePos.y + circularArray[i][1];
	}
	this.pointsArray[points] = [0,0];
	this.pointsArray[points][0] = mousePos.x + circularArray[0][0];
	this.pointsArray[points][1] = mousePos.y + circularArray[0][1];

	this.vertices = [];
	this.radius = 2*this.side/3 - 5;
	this.stretchRadius = 2*this.side/3;
	this.copy = true;
	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointArray are used by the centralize function to calculate this.vertices
}

Circle.prototype = new CustomShape();

function circleGen(){
	if(onObject == false){
		var circle = new Circle();
		circleArray[circleArray.length] = circle;
		circle.findOuterRadius();
		circle.setVertexCollision(circle.vertices);
		numberOfShapes++;
		circle.id = numberOfShapes;
		circle.makeBoundingRect();
		circle.calculateMass(circle.vertices, circle.boundingRectangle.width, circle.boundingRectangle.height, resolution);
	}
}


/******************************************************************************************************************************************************/

function Triangle(){
	this.side = 60/zoom;
	this.defaultSide = 60/zoom;
	this.velocity = [0,0];
	this.pointsArray = [[mousePos.x - this.side/2, mousePos.y + Math.sqrt(3)/6 * this.side],
						[mousePos.x + this.side/2, mousePos.y + Math.sqrt(3)/6 * this.side],
						[mousePos.x, mousePos.y - 2 * Math.sqrt(3)/6 * this.side],
						[mousePos.x - this.side/2, mousePos.y + Math.sqrt(3)/6 * this.side]];
	this.vertices = [];
	this.radius = this.side/2;
	this.stretchRadius = this.side/2;
	this.copy = true;
	var j;
	centralize(this, this.pointsArray, j); // the values in this.pointArray are used by the centralize function to calculate this.vertices
}

Triangle.prototype = new CustomShape();

function triangleGen(){
	if(onObject == false){
		var triangle = new Triangle();
		triangleArray[triangleArray.length] = triangle;
		triangle.findOuterRadius();
		triangle.setVertexCollision(triangle.vertices);
		numberOfShapes++;
		triangle.id = numberOfShapes;
		triangle.makeBoundingRect();
		triangle.calculateMass(triangle.vertices, triangle.boundingRectangle.width, triangle.boundingRectangle.height, resolution);
	}
}

function Pencil(array){
	var pointsLength = superPencilPoints.length;
	if(superPencilPoints[0]){
		this.pointsArray = superPencilPoints[pointsLength - 1];
	}else{
		this.pointsArray = array; //the array parameter is used when loading from mongodb database
	}
	this.centroid = [0, 0];
	this.vertices = [0, 0];
	this.velocity = [0, 0];
	this.copy = true;
	if(stroking){
		this.stroking = true;
	}else if(!stroking){
		this.stroking = false;
	}
	var j;
	if(pencils)centralize(this, this.pointsArray, j); // the values in this.pointArray are used by the centralize function to calculate this.vertices
}

Pencil.prototype = new CustomShape();

function pencilGen(){
	if(onObject == false && pencils && pencilPointsArray[0]){ //the pencilPointsArray[0] condition ensures that no new instance of Pencil can be created when there are no points for it to use
		var pencil = new Pencil();
		pencilArray[pencilArray.length] = pencil;
		pencil.findOuterRadius();
		pencil.setVertexCollision(pencil.vertices);
		numberOfShapes++;
		pencil.id = numberOfShapes;
		pencil.makeBoundingRect();
		pencil.calculateMass(pencil.vertices, pencil.boundingRectangle.width, pencil.boundingRectangle.height, resolution);
	}
	pencilPointsArray = []; // pencilPointsArray is on emptied after its been used
}

/** centralize() calculates the centroid and sets the centre (X,Y) of the shape equal to it **/

function centralize(shape, array, i){
	for(var i = 0; i < array.length - 1; i++){
		//if(i == 0){continue;}//else{
			shape.X += array[i][0];
			shape.Y += array[i][1];
		//}
	}
	//if(shape != curveArray[i] &&  shape[i].stroking)
	shape.X /= (array.length - 1);
	shape.Y /= (array.length - 1);
	for(var i = 0; i < array.length; i++){
		shape.vertices[i] = [0,0,false];
		shape.vertices[i][0] = array[i][0] - shape.X;
		shape.vertices[i][1] = array[i][1] - shape.Y;
	}
}

function draw(){
	bufferCtx.fillStyle = '#E0E0E0';
	bufferCtx.fillRect(0, 0, canvas.width, canvas.height);

	circleDrawer();
	squareDrawer();
	triangleDrawer();
	customShapeDrawer();
	pencilDrawer();
	curveDrawer();
	wallDrawer();
	shapeTransforms(pencilArray);

	var i;
	blueprint(customShapeArray, i);
	blueprint(circleArray, i);
	blueprint(squareArray, i);
	blueprint(triangleArray, i);
	blueprint(pencilArray, i);
	blueprint(curveArray, i);
	blueprint(wallArray, i);

	context.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height);

}

function calcAngle(x1, y1, x2, y2){
	theta = 0;
	/** 3rd Quadrant **/
	if(x2 < 0 && y2 >= 0){
		theta = Math.PI - angleFinder(x1, y1, x2, y2);
		return Math.PI + theta;
	}
	/** 4th Quadrant **/
	if(x2 < 0 && y2 < 0){
		theta = 2*Math.PI - angleFinder(x1, y1, x2, y2);
		return theta;
	}
	return angleFinder(x1, y1, x2, y2);
}

function shadow(Array, i){
	Array[i].makeBoundingRect(); // Rewrite using the MVC pattern: currently the view is talking directly to the model
	bufferCtx.fillStyle = Array[i].colour;
	bufferCtx.strokeStyle = Array[i].lineColour;
	bufferCtx.beginPath();
	if(Array[i].selected){
		bufferCtx.lineWidth = 1.4;
		bufferCtx.shadowColor = 'rgba( 9, 9, 9, 0.3)';
		bufferCtx.shadowOffsetX = 10;
		bufferCtx.shadowOffsetY = 10;
		bufferCtx.shadowBlur = 10;
	}else{
		bufferCtx.shadowColor = "transparent";
		bufferCtx.lineWidth = Array[i].lineWidth;
	}

	if(dragging && Array[i].selected){
		Array[i].X = mousePos.x + offcenter[0];
		Array[i].Y = mousePos.y + offcenter[1];
		if(!select){
			bufferCtx.lineWidth = 1.4;
			bufferCtx.shadowColor = 'rgba( 9, 9, 9, 0.3)';
			bufferCtx.shadowOffsetX = 10;
			bufferCtx.shadowOffsetY = 10;
			bufferCtx.shadowBlur = 10;
		}
	}
}

/* Call resize() method when changing size */
function changeSize(Array, i){

		if(reSize && (Array[i].expand || Array[i].v_expand || Array[i].h_expand)){
			Array[i].resize();
		}

		/* Draws the re-size box */
		if(reSize && Array[i].expandBox){
			bufferCtx.save();
			//bufferCtx.globalCompositeOperation = "source-over";
			//bufferCtx.globalCompositeOperation = "destination-over"
			bufferCtx.fillStyle = 'white';
			bufferCtx.strokeStyle = 'black';
			bufferCtx.lineWidth = 0.5;
			var antLength = 7;
			var gap = 14;
			var ants = 0;
			//bufferCtx.globalAlpha = 0.3;

			bufferCtx.lineWidth = 0.7;

			/**(ants+1)*antLength + ants*(gap - antLength) = (antLength + ants*gap)**/

			/** top-left to top-right **/
			var center = applyZoom([zoomCenter[0], zoomCenter[1]], [Array[i].X + shift[0], Array[i].Y + shift[1]], zoom);

			while((antLength + ants*gap) < zoom * 2 * (Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + gap*ants, center.y - zoom * Array[i].stretchRadius - zoom * selectSize);
				bufferCtx.lineTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + antLength + gap*ants, center.y - zoom * Array[i].stretchRadius - zoom * selectSize);
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** bottom-left to bottom-right **/
			while((antLength + ants*gap) < zoom * 2 * (Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + gap*ants,center.y + zoom * Array[i].stretchRadius + zoom * selectSize);
				bufferCtx.lineTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + antLength + gap*ants, center.y + zoom * (Array[i].stretchRadius + selectSize));
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** top-left to top-right **/
			while((antLength + ants*gap) < zoom * 2 * (Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + gap*ants);
				bufferCtx.lineTo(center.x - zoom * Array[i].stretchRadius - zoom * selectSize, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + antLength + gap*ants);
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** bottom-right to bottom-right **/
			while((antLength + ants*gap) < zoom * 2 * (Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(center.x + zoom * Array[i].stretchRadius + zoom * selectSize, center.y - zoom *  Array[i].stretchRadius - zoom * selectSize + gap*ants);
				bufferCtx.lineTo(center.x + zoom * Array[i].stretchRadius + zoom * selectSize, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + antLength + gap*ants);
				bufferCtx.stroke();
				ants++;
			}
			bufferCtx.lineWidth = 1.4;
			bufferCtx.globalAlpha = 1

																				// this section draws the small white squares at the corners

			/** top-left **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);

			/** bottom-left **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			/** bottom-right **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			/** top-right **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);


																				// this section draws the small white squares at the sides

			/** top **/
			bufferCtx.strokeRect(center.x - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, smallBox, smallBox);
			/** right **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, center.y - smallBox/2, smallBox, smallBox);
			/** bottom **/
			bufferCtx.strokeRect(center.x - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - smallBox/2, center.y - zoom * Array[i].stretchRadius - zoom * selectSize + 2*(zoom * Array[i].stretchRadius + zoom * selectSize) - smallBox/2, smallBox, smallBox);
			/** left **/
			bufferCtx.strokeRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(center.x - zoom * Array[i].stretchRadius - zoom * selectSize - smallBox/2, center.y - smallBox/2, smallBox, smallBox);
			bufferCtx.restore();
		}
	}

/* Call pickColour() method when changing colour */
function changeColour(Array, i){
	if(colourChange && Array[i].onObject){
		Array[i].pickColour();
	}
}

/* Animating the slider */
function rotateShape(Array, i){
	if(rotate && Array[i].rotationLine){

		var center = applyZoom([zoomCenter[0], zoomCenter[1]], [Array[i].X + shift[0], Array[i].Y + shift[1]], zoom);
		var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + zoom * shift[0], mousePos.y + zoom * shift[1]], zoom);

		var startPoint = center.x - sliderButtonWidth/2;
		var endPoint = center.x + sliderButtonWidth/2;
		var yCoordinates = center.y + Array[i].radius + 45;
		var radius = 20;

		bufferCtx.save();
		//bufferCtx.globalAlpha = 0.3;
		bufferCtx.globalAlpha = 0.7;

		bufferCtx.shadowColor = 'rgba( 9, 9, 9, 0.4)';
		bufferCtx.shadowOffsetX = 10;
		bufferCtx.shadowOffsetY = 10;
		bufferCtx.shadowBlur = 10;

		bufferCtx.fillStyle = 'lightblue';
		bufferCtx.lineWidth = 1;
		bufferCtx.beginPath();
		bufferCtx.moveTo(startPoint, yCoordinates - radius);
		bufferCtx.arc(endPoint, yCoordinates, radius, -Math.PI/2, Math.PI/2);
		bufferCtx.lineTo(startPoint, yCoordinates + radius);
		bufferCtx.arc(startPoint, yCoordinates, radius, Math.PI/2, -Math.PI/2);
		bufferCtx.stroke();
		bufferCtx.fill();
		bufferCtx.restore();

		/** Horizontal slider line **/
		bufferCtx.save();

		bufferCtx.lineWidth = 1;
		bufferCtx.shadowColor = 'rgba( 9, 9, 9, 0.4)';
		bufferCtx.shadowOffsetX = 10;
		bufferCtx.shadowOffsetY = 10;
		bufferCtx.shadowBlur = 10;

		bufferCtx.beginPath();
		bufferCtx.moveTo(startPoint, yCoordinates);
		bufferCtx.lineTo(endPoint, yCoordinates);
		bufferCtx.stroke();

		/** Slider **/
		Array[i].slider[0] = startPoint + sliderPosition;
		Array[i].slider[1] = yCoordinates;

		/** Slider follows the cursor along the line **/
		if(rotate && onSlider && projMouse.x >= startPoint && projMouse.x <= endPoint){
			Array[i].slider[0] = projMouse.x;
			sliderPosition = projMouse.x - startPoint;
			Array[i].sliderPosition = projMouse.x - startPoint;
			Array[i].rotate();
		}

		/** draws the actual slider **/
		bufferCtx.fillStyle = 'red';
		bufferCtx.beginPath();
		bufferCtx.moveTo(Array[i].slider[0] - 4, Array[i].slider[1] - 8);
		bufferCtx.lineTo(Array[i].slider[0] + 4, Array[i].slider[1] - 8);
		bufferCtx.lineTo(Array[i].slider[0], Array[i].slider[1]);
		bufferCtx.closePath();
		bufferCtx.fill();
		bufferCtx.restore();
	}
}

function rotateShape2(Array, i){
	if(rotate && Array[i].rotationLine){

		var center = applyZoom([zoomCenter[0], zoomCenter[1]], [Array[i].X + shift[0], Array[i].Y + shift[1]], zoom);
		var projMouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + zoom * shift[0], mousePos.y + zoom * shift[1]], zoom);

		var innerRadiusX = 100;
		var outerRadiusX = 200;
		var outerRadiusMinX = 190;
		var mousePosDistance = distance(mousePos.x - Array[i].X, mousePos.y - Array[i].Y);
		var outerRingRatio = outerRadiusX / mousePosDistance;
		var innerRingRatio = innerRadiusX / mousePosDistance;
		var outerRingRatioMinX = outerRadiusMinX / mousePosDistance;;
		var outerDialPositionX = Array[i].X + (mousePos.x - Array[i].X) * outerRingRatio;
		var outerDialPositionY = Array[i].Y + (mousePos.y - Array[i].Y) * outerRingRatio;
		var innerDialPositionX = Array[i].X + (mousePos.x - Array[i].X) * innerRingRatio;
		var innerDialPositionY = Array[i].Y + (mousePos.y - Array[i].Y) * innerRingRatio;
		var outerDialPositionMinX = Array[i].X + (mousePos.x - Array[i].X) * outerRingRatioMinX;
		var outerDialPositionMinY = Array[i].Y + (mousePos.y - Array[i].Y) * outerRingRatioMinX;

		bufferCtx.save();


		bufferCtx.setLineDash([6, 8]);
		bufferCtx.lineWidth = 1;
		bufferCtx.beginPath();
		bufferCtx.arc(Array[i].X, Array[i].Y, innerRadiusX, 0, 2*Math.PI);
		bufferCtx.closePath();
		bufferCtx.stroke();
		bufferCtx.restore();

		bufferCtx.lineWidth = 1;
		bufferCtx.beginPath();
		bufferCtx.arc(Array[i].X, Array[i].Y, 200, 0, 2*Math.PI);
		bufferCtx.closePath();
		bufferCtx.stroke();
		bufferCtx.restore();

		if(onRotateDial){
				bufferCtx.fillStyle = 'red';
		} else {
				bufferCtx.fillStyle = 'blue';
		}
		bufferCtx.beginPath();
		if(onRotateDial){
					bufferCtx.arc(outerDialPositionX, outerDialPositionY, 10, 0, 2*Math.PI);
		} else {
					bufferCtx.arc(Array[i].X, Array[i].Y - outerRadiusMinX - 10, 10, 0, 2*Math.PI);
		}
		bufferCtx.closePath();
		bufferCtx.stroke();
		bufferCtx.fill();
		bufferCtx.restore();
		bufferCtx.beginPath();
		if(onRotateDial){
					bufferCtx.moveTo(innerDialPositionX, innerDialPositionY);
					bufferCtx.lineTo(outerDialPositionMinX, outerDialPositionMinY);
		} else {
					bufferCtx.moveTo(Array[i].X, Array[i].Y - innerRadiusX);
					bufferCtx.lineTo(Array[i].X, Array[i].Y - outerRadiusX + 10);
		}
		bufferCtx.stroke();




	}
}




function wallDrawer(){
	bufferCtx.lineWidth = 0.5;
	bufferCtx.strokeStyle = 'black';
	bufferCtx.globalAlpha = 1
	shapeTransforms(wallArray);
}



function circleDrawer(){
	bufferCtx.globalAlpha = 1;
	bufferCtx.lineWidth = 0.5;
	var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);
	if(!dragging && shapeSelection.shapes.circle[0] && proj.x <= canvas.width - 25 && proj.y <= canvas.height - 25 && !onObject){
		bufferCtx.beginPath();
		bufferCtx.globalAlpha = 0.1;
		bufferCtx.fillStyle = 'blue';
		bufferCtx.arc(proj.x, proj.y, 30, 0, 2*Math.PI);
		bufferCtx.stroke();
		bufferCtx.fill();
		}
	bufferCtx.lineWidth = 0.5;
	bufferCtx.strokeStyle = 'black';
	bufferCtx.globalAlpha = 1
	shapeTransforms(circleArray);
}


function squareDrawer(){
		bufferCtx.globalAlpha = 1;
		/* Drawing the shape cursor */
		var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);
		if(!dragging && shapeSelection.shapes.square[0] && proj.x <= canvas.width - 25 && proj.y <= canvas.height - 25 && !onObject){
			bufferCtx.globalAlpha = 0.1;
			bufferCtx.fillStyle = 'blue';
			//bufferCtx.arc(mousePos.x, mousePos.y, 30, 0, 2*Math.PI);
			bufferCtx.beginPath();
			bufferCtx.moveTo(proj.x - 27.5, proj.y + 27.5);
			bufferCtx.lineTo(proj.x + 27.5, proj.y + 27.5);
			bufferCtx.lineTo(proj.x + 27.5, proj.y - 27.5);
			bufferCtx.lineTo(proj.x - 27.5, proj.y - 27.5);
			bufferCtx.closePath();
			bufferCtx.stroke();
			bufferCtx.fill();
		}
		bufferCtx.globalAlpha = 1;
		shapeTransforms(squareArray);
}

function triangleDrawer(){
		bufferCtx.globalAlpha = 1;
		var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);
		if(!dragging && shapeSelection.shapes.triangle[0] && proj.x <= canvas.width - 25 && proj.y <= canvas.height - 25 && !onObject){
			bufferCtx.globalAlpha = 0.1;
			bufferCtx.fillStyle = 'blue';
			bufferCtx.arc(proj.x, proj.y, 30, 0, 2*Math.PI);
			bufferCtx.beginPath();
			bufferCtx.moveTo(proj.x - 30, proj.y + Math.sqrt(3)/6 * 60);
			bufferCtx.lineTo(proj.x + 30, proj.y + Math.sqrt(3)/6 * 60);
			bufferCtx.lineTo(proj.x, proj.y - 2 * Math.sqrt(3)/6 * 60);
			bufferCtx.closePath();
			bufferCtx.stroke();
			bufferCtx.fill();
		}

		bufferCtx.strokeStyle = 'black';
		bufferCtx.globalAlpha = 1;
		bufferCtx.lineWidth = 0.5;
		shapeTransforms(triangleArray);
}


function customShapeDrawer(){
									/** this section draws the initial shape before any changes and transformations are applied to it **/
	if(shapes){
		var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x + shift[0], mousePos.y + shift[1]], zoom);

		bufferCtx.fillStyle = 'blue';
		bufferCtx.beginPath();
		bufferCtx.arc(proj.x, proj.y, 2, 0, 2*Math.PI);
		bufferCtx.fill();

		if(pointsArray[0]){
			var projPoint = applyZoom([zoomCenter[0], zoomCenter[1]], [pointsArray[0][0] + shift[0], pointsArray[0][1] + shift[1]], zoom);
		}

		if(startDraw){bufferCtx.moveTo(projPoint.x, projPoint.y);} // first point of the custom shape is drawn here

		closedPath = false;
		for(var i = 0; i < pointsArray.length; i++){
			if(i != 0){
				var projPoints = applyZoom([zoomCenter[0], zoomCenter[1]], [pointsArray[i][0] + shift[0], pointsArray[i][1] + shift[1]], zoom);
				bufferCtx.lineTo(projPoints.x, projPoints.y); // all the other points are drawn here
			}
		}

		if(startDraw){ // closes path if startDraw is false: this happens when mousedowns runs whilst closedPath = true
			bufferCtx.lineTo(proj.x, proj.y);
			}else if(pointsArray[0]) {
				bufferCtx.closePath();
				customShapeGen();
				pointsArray = []; // pointArray is emptied out to get it ready for the next shape
			}

		bufferCtx.stroke();
		if(pointsArray[0]){
			if(distance(pointsArray[0][0] - mousePos.x, pointsArray[0][1] - mousePos.y) < closePathRadius/zoom){ // sets closedPath = true if the cursor is hovering over the first set of points and also creates the lightgreen highlight
				bufferCtx.save();
				bufferCtx.fillStyle = 'lightgreen';
				bufferCtx.beginPath();
				bufferCtx.arc(projPoint.x, projPoint.y, closePathRadius, 0, 2*Math.PI);
				bufferCtx.fill();
				bufferCtx.restore();
				closedPath = true;
			}
		}
	}										/** this section applies all of the changes and transformations that have been made to the shape **/
	shapeTransforms(customShapeArray);
}


function curveDrawer(){
									/** this section draws the initial shape before any changes and transformations are applied to it **/
	if(line){
		bufferCtx.strokeStyle = 'red';
		bufferCtx.fillStyle = 'blue';
		bufferCtx.beginPath();
		bufferCtx.arc(mousePos.x, mousePos.y, 2, 0, 2*Math.PI);
		bufferCtx.fill();

		if(startDraw){bufferCtx.moveTo(pointsArray[0][0], pointsArray[0][1]);} // first point of the custom shape is drawn here

		closedPath = false;
		for(var i = 0; i < pointsArray.length; i++){
			if(i != 0){
				bufferCtx.lineTo(pointsArray[i][0], pointsArray[i][1]); // all the other points are drawn here
			}
		}

		if(startDraw){ // closes path if startDraw is false: this happens when mousedowns runs whilst closedPath = true
			bufferCtx.lineTo(mousePos.x, mousePos.y);
			}else if(pointsArray[0]) {
				bufferCtx.closePath();
				curveGen();
				pointsArray = []; // pointArray is emptied out to get it ready for the next shape
			}

		var lastpoint = pointsArray[pointsArray.length - 1];



		if(clickCount == 2 && pointsArray[0] && distance(mousePos.x - lastpoint[0], mousePos.y - lastpoint[1]) < closePathRadius){
			//bufferCtx.lineTo(mousePos.x, mousePos.y);
			//}else if(pointsArray[0]) {
				//bufferCtx.closePath();
				if(pointsArray.length > 2){
					curveGen();
					pointsArray = [];
					startDraw = false;
				}// pointArray is emptied out to get it ready for the next shape
			}

		bufferCtx.stroke();
		if(pointsArray[0]){
			pointStroking = true;
			if(distance(pointsArray[0][0] - mousePos.x, pointsArray[0][1] - mousePos.y) < closePathRadius){ // sets closedPath = true if the cursor is hovering over the first set of points and also creates the lightgreen highlight
				bufferCtx.save();
				bufferCtx.fillStyle = 'lightgreen';
				bufferCtx.beginPath();
				bufferCtx.arc(pointsArray[0][0], pointsArray[0][1], closePathRadius, 0, 2*Math.PI);
				bufferCtx.fill();
				bufferCtx.restore();
				closedPath = true;
				if(pointsArray.length > 1){
					pointStroking = false;
				}
			}
		}
	}										/** this section applies all of the changes and transformations that have been made to the shape **/
	shapeTransforms(curveArray);
}


function pencilDrawer(){

	if(pencilPointsArray[0] && pencils && !select){

		var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [pencilPointsArray[0][0] + shift[0], pencilPointsArray[0][1] + shift[1]], zoom);

		bufferCtx.beginPath();
		bufferCtx.moveTo(proj.x, proj.y);
			for(var j = 0; j < pencilPointsArray.length; j++){
				var projPoints = applyZoom([zoomCenter[0], zoomCenter[1]], [pencilPointsArray[j][0] + shift[0], pencilPointsArray[j][1] + shift[1]], zoom);
				bufferCtx.lineTo(projPoints.x, projPoints.y);
			}
		bufferCtx.stroke();

		}

	for(var j = 0; j < pencilArray.length; j++){

	if(pencilPointsArray[0]){
		bufferCtx.beginPath();
		var x = pencilArray[j].X + pencilArray[j].vertices[0][0];
		var y = pencilArray[j].Y + pencilArray[j].vertices[0][1];
		var projPencilPoint = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);
		bufferCtx.moveTo(projPencilPoint.x, projPencilPoint.y);

		for(var k = 0; k < pencilArray[j].vertices.length; k++){
			if(pencilArray[j].vertices[k])
			  var x = pencilArray[j].X + pencilArray[j].vertices[0][0];
			  var y = pencilArray[j].Y + pencilArray[j].vertices[0][1];
				var projPencilPoints = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);
				bufferCtx.lineTo(projPencilPoints.x, projPencilPoints.y);
			}
		}
	}
}

window.addEventListener('keydown', zoomer , false);
//window.addEventListener('keyup', function(){}, false);
// IE9, Chrome, Safari, Opera
window.addEventListener("mousewheel", zoomer, false);
// Firefox
window.addEventListener("DOMMouseScroll", zoomer, false);

function zoomer(e){
	if(zoomerizer){
		clearTimeout(zoomDisplay);
		var zoomFactor = 1.05;
		if(e.which === 107 || e.which === 109 || e.wheelDelta === 120 || e.wheelDelta === -120){
			isZooming = true;
			resolution = 1/zoom;
			centerShift = [mousePos.xPhysical - mousePos.x, mousePos.yPhysical - mousePos.y];

			shift[0] = centerShift[0];
			shift[1] = centerShift[1];

			zoomCenter = [mousePos.x + centerShift[0], mousePos.y + centerShift[1]];

			if(e.which === 107 || e.wheelDelta === 120){
					$('canvas').css('cursor', 'url(https://s3.amazonaws.com/simuL8rBucket/images/icons/zoom-in.png) 8 15, auto');
					zoom *= zoomFactor;
			}
			if(e.which === 109 || e.wheelDelta === -120){
					$('canvas').css('cursor', 'url(https://s3.amazonaws.com/simuL8rBucket/images/icons/zoom-out.png) 8 15, auto');
					zoom /= zoomFactor;
			}
		}
	}
	if(e.which === 39){ //left
		shift[0] += 10/zoom;
	}
	if(e.which === 37){ //right
		shift[0] += -10/zoom;
	}
  if(e.which === 40){ //up
		shift[1] += 10/zoom;
	}
	if(e.which === 38){ //down
		shift[1] += -10/zoom;
	}

	var shiftedX = mousePos.xPhysical - zoom * shift[0];
	var shiftedY = mousePos.yPhysical - zoom * shift[1];
	var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [shiftedX, shiftedY], 1/zoom);

	var zoomedX = proj.x;
	var zoomedY = proj.y;

	if(isShifting(e)){
		mousePos = getMousePos(e, canvas);
	}

	zoomDisplay = setTimeout(function(){
		isZooming = false;
		if(pencils) {
			$('canvas').css('cursor', 'url(images/pencil_cursor.png) 0 15, auto');
		}else{
			$('canvas').css('cursor', 'url(https://s3.amazonaws.com/simuL8rBucket/images/icons/zoom-cursor.png) 8 15, auto');
		}
	}, 1500);
}

function logger(text){
	console.log('%c' + text, 'font-size:30px; color: blue');
}

function isShifting(e){
	return e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40;
}

function screenWriter(text, position, context, fontSize, fontFamily, colour){
	context.fillStyle = colour;
	context.font = fontSize +'px ' + fontFamily;
	context.fillText(text, position[0],position[1]);
}

function applyZoom(center, point, zoom){
	var Xpoint = point[0];
	var Ypoint = point[1];
	if(zoom !== 1){
		var x = point[0];
		var y = point[1];
		var centerX = center[0];
		var centerY = center[1];
		Xpoint = x - (x - centerX) * (1 - zoom);
		Ypoint = y - (y - centerY) * (1 - zoom);
	}
	return {
			x: Xpoint,
			y: Ypoint
	};
}

function shapeTransforms(Array){
	if(Array[0]){
		var length = Array.length;
		var proj = {};
		for(var i = 0; i < length; i++){
			//bufferCtx.fillStyle = Array[i].colour;
			shadow(Array, i);
			changeColour(Array, i);
			bufferCtx.save();
			var x = Array[i].vertices[0][0] + Array[i].X + shift[0];
			var y = Array[i].vertices[0][1] + Array[i].Y + shift[1];

			proj = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);

			bufferCtx.beginPath();
			bufferCtx.moveTo(proj.x, proj.y); // first point of the custom shape is drawn here

			for(var j = 0; j < Array[i].vertices.length; j++){

					var x = Array[i].vertices[j][0] + Array[i].X + shift[0];
					var y = Array[i].vertices[j][1] + Array[i].Y + shift[1];

					proj = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);

				if(Array[i].vertices[j][2]){ // checks if a vertex has been clicked
					Array[i].vertices[j][0] = mousePos.x - Array[i].X;
					Array[i].vertices[j][1] = mousePos.y - Array[i].Y;
				}
				bufferCtx.lineTo(proj.x, proj.y);
		}

		if(Array == pencilArray && !Array[i].stroking){bufferCtx.closePath();} //closes the path for the pencil shapes
			bufferCtx.restore();
			bufferCtx.stroke();
		if(Array == pencilArray && !Array[i].stroking){
			bufferCtx.fill();
		}else if(Array != pencilArray){
			if(!Array[i].stroking)bufferCtx.fill();
		}

		if(Array == circleArray){
			var projCenter = applyZoom([zoomCenter[0], zoomCenter[1]], [Array[i].X, Array[i].Y], zoom);
			var projEdge = applyZoom([zoomCenter[0], zoomCenter[1]], [Array[i].X + Array[i].vertices[0][0], Array[i].Y + Array[i].vertices[0][1]], zoom);
			bufferCtx.beginPath();
			bufferCtx.lineTo(projEdge.x + zoom*shift[0], projEdge.y + zoom*shift[1]);
			bufferCtx.lineTo(projCenter.x + zoom*shift[0], projCenter.y + zoom*shift[1]);
			bufferCtx.stroke();
		}

	if(reShape){
		onReshape = false;
		for(var j = 0; j < Array[i].vertices.length; j++){
				var x = Array[i].vertices[j][0] + Array[i].X;
				var y = Array[i].vertices[j][1] + Array[i].Y;

				var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);

				var Xpoint = proj.x;
				var Ypoint = proj.y;

				var mouse = applyZoom([zoomCenter[0], zoomCenter[1]], [mousePos.x, mousePos.y], zoom);

				if(distance(mouse.x - Xpoint, mouse.y - Ypoint) < 5){ // detects when the cursor is hovering over a vertex and highlights it in darkblue
					onReshape = true;
					bufferCtx.fillStyle = 'darkblue';
					for(var k = 0; k < Array[i].vertices.length; k++){ //draws the small blue dots for each vertex
						var x = Array[i].vertices[k][0] + Array[i].X + shift[0];
						var y = Array[i].vertices[k][1] + Array[i].Y + shift[1];

						var proj = applyZoom([zoomCenter[0], zoomCenter[1]], [x, y], zoom);

						var Xpoint = proj.x;
						var Ypoint = proj.y;

						bufferCtx.beginPath();
						bufferCtx.arc(Xpoint, Ypoint, 3, 0, 2*Math.PI);
						bufferCtx.fill();
						}
					}
				}
			}

if(isZooming){
 	screenWriter('x ' + Math.round(zoom * 10)/10, [mousePos.xPhysical + 48, mousePos.yPhysical + 5], bufferCtx, '30', 'Arial', 'black');
}
	if(physics && Array != wallArray){
		if(Array[i].gravity){
			Array[i].velocity[1] += gravity/20;
		}
	}
				changeSize(Array, i);
				rotateShape(Array, i);
				rotateShape2(Array, i);
			}
		}
}

function backgroundGradient(icon){
	$(icon).css({'background-image': '-webkit-linear-gradient(bottom, black , #404040)'});
	$(icon).css({'background-image': '-o-linear-gradient(bottom, black , #404040)'});
	$(icon).css({'background-image': '-moz-linear-gradient(bottom, black , #404040)'});
	$(icon).css({'background-image': 'linear-gradient(to bottom, #404040 ,black)'});
}

function shapeSelector(id){
	if(id==='navigation-bar'){
		colourChange = false;
		backgroundGradient('#ChangeColour');
		return;
	}

	if(id && id === 'ChangeColour'){
		colourChange = true;
	}else if(id !== 'ChangeColour'){
		colourChange = false;
	}

	if(id && id === 'physics'){
		if(physics === true){
			physics = false;
		}else if(physics === false){
			physics = true;
		}
	}


	shapeSelection.shapes.circle[0] = false;
	shapeSelection.shapes.square[0] = false;
	shapeSelection.shapes.triangle[0] = false;
	deletion = false;
	reSize = false;
	reShape = false;
	rotate = false;
	shapes = false;
	pencils = false;
	copy = false;
	zoomerizer = false;
	//physics = false;

	circles = false;
	triangles = false;
	squares = false;
	line = false;

	saving = false;
	options();

	backgroundGradient('#circle');
	backgroundGradient('#square');
	backgroundGradient('#triangle');
	backgroundGradient('#customShape');
	backgroundGradient('#Re-Size');
	backgroundGradient('#Rotate');
	backgroundGradient('#ChangeColour');
	backgroundGradient('#erase');
	backgroundGradient('#save');
	backgroundGradient('#pencil_id');
	backgroundGradient('#Re-Shape');
	backgroundGradient('#copy');
	backgroundGradient('#physics');
	backgroundGradient('#zoom');

	image.style.visibility = 'hidden';
	//PickColor.style.visibility = 'hidden';
	$('#pencilList').css('display', 'none');
	$('#rotateList').css('display', 'none');
	pencilCursor();
	zoomCursor();
}


function gradient(shape){
	shape.style.background = '-webkit-linear-gradient(top, black , #404040)';
	shape.style.background = '-o-linear-gradient(top, black , #404040)';
	shape.style.background = '-moz-linear-gradient(top, black , #404040)';
	shape.style.background = 'linear-gradient(to top, #404040 ,black)';
}


function hover(shape){
	shape.style.background = '-webkit-linear-gradient(top, black , #404040)';
	shape.style.background = '-o-linear-gradient(top, black , #404040)';
	shape.style.background = '-moz-linear-gradient(top, black , #404040)';
	shape.style.background = 'linear-gradient(to top, #404040 ,black)';
}

function leave(shapes, shape){
	if(!shapes){
		shape.style.background = '-webkit-linear-gradient(bottom, black , #404040)';
		shape.style.background = '-o-linear-gradient(bottom, black , #404040)';
		shape.style.background = '-moz-linear-gradient(bottom, black , #404040)';
		shape.style.background = 'linear-gradient(to bottom, #404040 ,black)';
	}
}

function shapeSelect(){
	for(key in shapeSelection.shapes){
		if(key != 'userID' && key != 'isPublic' && key != 'name'){
			if(shapeSelection.shapes[key][0]){
				return [shapeSelection.shapes[key][1](), shapeSelection.shapes[key][2]];
			}
		}
	}
}

function colourPicker(){
	colours['transparent'][1] = false;
	colours['blue'][1] = false;
	colours['red'][1] = false;
	colours['yellow'][1] = false;
	colours['green'][1] = false;
	colours['white'][1] = false;
	colours['black'][1] = false;
	colours['lightblue'][1] = false;
	colours['lightgreen'][1] = false;
	colours['orange'][1] = false;
	colours['purple'][1] = false;
	colours['violet'][1] = false;
	colours['beige'][1] = false;
	colours['aqua'][1] = false;
	colours['grey'][1] = false;
	colours['pink'][1] = false;
}

function chooseColour(){
	return selectedColour;
}

wallConfig = {clearWall: false};

function clearAll(obj){
	for(e in shapeSelection.shapes){ //if(unit != 'userID' && unit != 'isPublic'){
		if(e != 'wall' || e == 'wall' && obj.clearWall){
			var arrayOfShapes = shapeSelection.shapes[e][2];
			arrayOfShapes.splice(0, arrayOfShapes.length);
		}
	}
}

/** this function saves simulations to the Mongodb database **/
function loadShapes(sim){
	for(key in sim.shapes){
		for(var i = 0; i < sim.shapes[key][2].length; i++){ //populate sim with shapes from e.g circleArray

			shapeSelection.shapes[key][2][i] = {};

			if(key == 'circle'){
				var circle = new Circle();
				shapeSelection.shapes[key][2][i] = circle;
			}
			if(key == 'square'){
				var square = new Square();
				shapeSelection.shapes[key][2][i] = square;
			}
			if(key == 'triangle'){
				var triangle = new Triangle();
				shapeSelection.shapes[key][2][i] = triangle;
			}
			if(key == 'customShape'){
				var customShape = new CustomShape();
				shapeSelection.shapes[key][2][i] = customShape;
			}
			if(key == 'pencil'){
				var pointsArray = sim.shapes[key][2][i].pointsArray;
				var pencil = new Pencil(pointsArray);
				shapeSelection.shapes[key][2][i] = pencil;
			}

			if(key == 'wall'){
				var wall = new Walls();
				shapeSelection.shapes[key][2][i] = wall;
			}

			for(prop in sim.shapes[key][2][i]){ //populate the ith shape (js object) with properties
				shapeSelection.shapes[key][2][i][prop] = sim.shapes[key][2][i][prop];
			}

			if(key == 'wall' || shapeSelection.shapes[key][2][i].isFixed){ // this part was added because mongodb couldn't store the very high(infinity) values
				shapeSelection.shapes[key][2][i].mass = Infinity;
				shapeSelection.shapes[key][2][i].momentOfInertia = Infinity;
			}
		}
	}
}

function loadShapes_idb(sim){
	for(key in sim.shapes){
		for(var i = 0; i < sim.shapes[key].length; i++){ //populate sim with shapes from e.g circleArray
			shapeSelection.shapes[key][2][i] = {};

			if(key == 'circle'){
				var circle = new Circle();
				shapeSelection.shapes[key][2][i] = circle;
			}
			if(key == 'square'){
				var square = new Square();
				shapeSelection.shapes[key][2][i] = square;
			}
			if(key == 'triangle'){
				var triangle = new Triangle();
				shapeSelection.shapes[key][2][i] = triangle;
			}
			if(key == 'customShape'){
				var customShape = new CustomShape();
				shapeSelection.shapes[key][2][i] = customShape;
			}
			if(key == 'pencil'){
				var pointsArray = sim.shapes[key][2][i].pointsArray;
				var pencil = new Pencil(pointsArray);
				shapeSelection.shapes[key][2][i] = pencil;
			}

			if(key == 'wall'){
				var wall = new Walls();
				shapeSelection.shapes[key][2][i] = wall;
			}

			for(prop in sim.shapes[key][i]){ //populate the ith shape (js object) with properties
				shapeSelection.shapes[key][2][i][prop] = sim.shapes[key][i][prop];
			}

			if(key == 'wall' || shapeSelection.shapes[key][2][i].isFixed){ // this part was added because mongodb couldn't store the very high(infinity) values
				shapeSelection.shapes[key][2][i].mass = Infinity;
				shapeSelection.shapes[key][2][i].momentOfInertia = Infinity;
			}
		}
	}
	shapeSelection.name = sim.name;
	shapeSelection.imgURL = sim.imgURL;
	return shapeSelection;
}
