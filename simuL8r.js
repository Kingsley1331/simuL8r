/** simuL8r - v1.0.0 - 2016-08-30 **/ 
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
var dragging = false;var cursor_grab = "-webkit-grabbing" || "-moz-grabbing" || "grabbing" || 'move';
var cursor_drag = "-webkit-grab" || "-moz-grab" || "grab" || 'move';
var mousePos;
var selectedShape = [];
var frame_Rate = 100;
var playScenes;
var selectedColour = '';

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
			}
var rotate = false;
var physics = false;
var pencils = true;
var copy = false;
var onSlider = false;
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

function circleMaker(){
	var points = 50;
	var radius = 30;
	for(var i = 0; i < points; i++){
		x = radius * Math.cos(i*2*Math.PI/points);
		y = radius * Math.sin(i*2*Math.PI/points);
		circularArray.push([x, y]);
	}
}
/*
$(document).ready(function(){
  $("#tipsRemove").click(function(){
    $("#tips").fadeOut("slow");
	$("#tipsSee").fadeIn("slow");
  });
})

$(document).ready(function(){
  $("#tipsSee").click(function(){
    $("#tipsSee").fadeOut("slow");
	$("#tips").fadeIn("slow");
  });
})*/

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

	circleMaker();
	selectPencilStroke();

	pencilCursor();
	//if(tipping){tips.style.visibility = 'visible';}

	mousePos = 0;
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	//alert(window.innerWidth - 230 + 'px');
	
	
	
	setCanvasSize(canvas, window.innerWidth -230, window.innerHeight - 100);
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
			if(!pencils){
				canvas.style.cursor = cursor_drag;
				}
			}
		}
		}if(onObject == false){
			if(!pencils){
				canvas.style.cursor = "auto";
			}
		}
	}
}

function mouseMove(){
	canvas.addEventListener('mousemove', function(evt){
	mousePos = getMousePos(canvas, evt);
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
	reSizer();
	drag();
	pointStart();
	reShaper();
	physTest();
	var points = [1,1];
	var arrays = [[1,2], [2,2], [3,3]];
	if(pencils){startPencil = true;}	
	}, false)
}


function mouseUp(){
	canvas.addEventListener('mouseup', function(evt){
	mouse_down = false;
	onSlider = false;
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
		$('canvas').css('cursor', 'pointer');
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
			if(shapeSelection.shapes[key][2][i].selected && !dragging && !onReshape && !onSlider && !shapeSelection.shapes[key][2][i].expand && !shapeSelection.shapes[key][2][i].v_expand && !shapeSelection.shapes[key][2][i].h_expand){ // remove the expand conditions when the expand box is resized around the shape
				offcenter[0] = shapeSelection.shapes[key][2][i].X - mousePos.x;
				offcenter[1] = shapeSelection.shapes[key][2][i].Y - mousePos.y;
				dragging = true;
				shapeSelection.shapes[key][2][i].dragging = true;
				shapeSelection.shapes[key][2][i].onObject = true;
				shapeSelection.shapes[key][2][i].locateTouchPoint();
				shapeSelection.shapes[key][2][i].velocity = [0, 0];
				if(!pencils) {canvas.style.cursor = cursor_grab;}
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
			if(!pencils) canvas.style.cursor = cursor_drag; 
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
				if(!shapeSelection.shapes[key][2][i].rotationLine){  										//sets the global sliderPosition equal to the objects sliderPosition
					sliderPosition = shapeSelection.shapes[key][2][i].sliderPosition; 
				}
			
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
				if(distance(shapeSelection.shapes[key][2][i].slider[0] - mousePos.x, shapeSelection.shapes[key][2][i].slider[1] - mousePos.y) <= 10){
					onSlider = true;
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


function getMousePos(canvas, evt) {       //canvas.addEventListener uses this function to calculate mouse position
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
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
	this.slider = [0,0];
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
	this.side = 55;
	this.defaultSide = 55;
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
	this.side = 55;
	this.defaultSide = 55;
	this.velocity = [0,0];
	this.pointsArray = [];
	var points = circularArray.length;
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
	this.side = 60;
	this.defaultSide = 60;
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
	
	/*if(saving){
		image.style.visibility = 'visible';
		
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		// set canvasImg image src to dataURL
		// so it can be saved as an image
		//document.getElementById('canvasImg').src = dataURL;
		image.src = dataURL;
		console.log(dataURL);
		//window.location.replace(dataURL);
	}*/
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

	//if(dragging && Array[i].selected && !onSlider){
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
			while((antLength + ants*gap) < 2*(Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(Array[i].X - Array[i].stretchRadius - selectSize + gap*ants, Array[i].Y - Array[i].stretchRadius - selectSize);
				bufferCtx.lineTo(Array[i].X - Array[i].stretchRadius - selectSize + antLength + gap*ants, Array[i].Y - Array[i].stretchRadius - selectSize);
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** bottom-left to bottom-right **/
			while((antLength + ants*gap) < 2*(Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(Array[i].X - Array[i].stretchRadius - selectSize + gap*ants, Array[i].Y + Array[i].stretchRadius + selectSize);
				bufferCtx.lineTo(Array[i].X - Array[i].stretchRadius - selectSize + antLength + gap*ants, Array[i].Y + Array[i].stretchRadius + selectSize);
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** top-left to top-right **/
			while((antLength + ants*gap) < 2*(Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(Array[i].X - Array[i].stretchRadius - selectSize, Array[i].Y - Array[i].stretchRadius - selectSize + gap*ants);
				bufferCtx.lineTo(Array[i].X - Array[i].stretchRadius - selectSize, Array[i].Y - Array[i].stretchRadius - selectSize + antLength + gap*ants);
				bufferCtx.stroke();
				ants++;
			}
			ants = 0; /** bottom-right to bottom-right **/
			while((antLength + ants*gap) < 2*(Array[i].stretchRadius + selectSize)){
				bufferCtx.beginPath();
				bufferCtx.moveTo(Array[i].X + Array[i].stretchRadius + selectSize, Array[i].Y - Array[i].stretchRadius - selectSize + gap*ants);
				bufferCtx.lineTo(Array[i].X + Array[i].stretchRadius + selectSize, Array[i].Y - Array[i].stretchRadius - selectSize + antLength + gap*ants);
				bufferCtx.stroke();
				ants++;
			}
			bufferCtx.lineWidth = 1.4;
			bufferCtx.globalAlpha = 1
			
																				// this section draws the small white squares at the corners
			
			/** top-left **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			
			/** bottom-left **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			/** bottom-right **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			/** top-right **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			
			
																				// this section draws the small white squares at the sides
			
			/** top **/
			bufferCtx.strokeRect(Array[i].X - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize - smallBox/2, smallBox, smallBox);
			/** right **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, Array[i].Y - smallBox/2, smallBox, smallBox);
			/** bottom **/
			bufferCtx.strokeRect(Array[i].X - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - smallBox/2, Array[i].Y - Array[i].stretchRadius - selectSize + 2*(Array[i].stretchRadius + selectSize) - smallBox/2, smallBox, smallBox);
			/** left **/
			bufferCtx.strokeRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - smallBox/2, smallBox, smallBox);
			bufferCtx.fillRect(Array[i].X - Array[i].stretchRadius - selectSize - smallBox/2, Array[i].Y - smallBox/2, smallBox, smallBox);
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
		
		var startPoint = Array[i].X - sliderButtonWidth/2;
		var endPoint = Array[i].X + sliderButtonWidth/2;
		var yCoordinates = Array[i].Y + Array[i].radius + 45;
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
		if(rotate && onSlider && mousePos.x >= startPoint && mousePos.x <= endPoint){
			Array[i].slider[0] = mousePos.x;
			sliderPosition = mousePos.x - startPoint;
			Array[i].sliderPosition = mousePos.x - startPoint;
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

function wallDrawer(){
	bufferCtx.lineWidth = 0.5;
	bufferCtx.strokeStyle = 'black';
	bufferCtx.globalAlpha = 1
	shapeTransforms(wallArray);
}



function circleDrawer(){
	bufferCtx.globalAlpha = 1;
	bufferCtx.lineWidth = 0.5;
	if(!dragging && shapeSelection.shapes.circle[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
		bufferCtx.beginPath();
		bufferCtx.globalAlpha = 0.1;
		bufferCtx.fillStyle = 'blue';
		bufferCtx.arc(mousePos.x, mousePos.y, 30, 0, 2*Math.PI);
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
		if(!dragging && shapeSelection.shapes.square[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
			bufferCtx.globalAlpha = 0.1;
			bufferCtx.fillStyle = 'blue';
			bufferCtx.arc(mousePos.x, mousePos.y, 30, 0, 2*Math.PI);
			
			bufferCtx.beginPath();
			bufferCtx.moveTo(mousePos.x - 27.5, mousePos.y + 27.5);
			bufferCtx.lineTo(mousePos.x + 27.5, mousePos.y + 27.5);
			bufferCtx.lineTo(mousePos.x + 27.5, mousePos.y - 27.5);
			bufferCtx.lineTo(mousePos.x - 27.5, mousePos.y - 27.5);
			bufferCtx.closePath();
			
			bufferCtx.stroke();
			bufferCtx.fill();
		}
		bufferCtx.globalAlpha = 1;
		shapeTransforms(squareArray);
}

function triangleDrawer(){
		bufferCtx.globalAlpha = 1;
		if(!dragging && shapeSelection.shapes.triangle[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
			bufferCtx.globalAlpha = 0.1;
			bufferCtx.fillStyle = 'blue';
			bufferCtx.arc(mousePos.x, mousePos.y, 30, 0, 2*Math.PI);
			
			bufferCtx.beginPath();
			bufferCtx.moveTo(mousePos.x - 30, mousePos.y + Math.sqrt(3)/6 * 60);
			bufferCtx.lineTo(mousePos.x + 30, mousePos.y + Math.sqrt(3)/6 * 60);
			bufferCtx.lineTo(mousePos.x, mousePos.y - 2 * Math.sqrt(3)/6 * 60);
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
				customShapeGen();
				pointsArray = []; // pointArray is emptied out to get it ready for the next shape
			}

		bufferCtx.stroke();
		if(pointsArray[0]){
			if(distance(pointsArray[0][0] - mousePos.x, pointsArray[0][1] - mousePos.y) < closePathRadius){ // sets closedPath = true if the cursor is hovering over the first set of points and also creates the lightgreen highlight
				bufferCtx.save();
				bufferCtx.fillStyle = 'lightgreen';
				bufferCtx.beginPath();
				bufferCtx.arc(pointsArray[0][0], pointsArray[0][1], closePathRadius, 0, 2*Math.PI);
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
				//shapeSelection[key][2][i].mergeCurves.openCurve = true;
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
		bufferCtx.beginPath();
		bufferCtx.moveTo(pencilPointsArray[0][0], pencilPointsArray[0][1]);
			for(var j = 0; j < pencilPointsArray.length; j++){
				bufferCtx.lineTo(pencilPointsArray[j][0], pencilPointsArray[j][1]);
			}
		bufferCtx.stroke();
		
		}

	for(var j = 0; j < pencilArray.length; j++){
	
	if(pencilPointsArray[0]){
		bufferCtx.beginPath();
		//bufferCtx.lineJoin='round';
		bufferCtx.moveTo(pencilArray[j].X + pencilArray[j].vertices[0][0], pencilArray[j].Y + pencilArray[j].vertices[0][1]);
		
		for(var k = 0; k < pencilArray[j].vertices.length; k++){
			if(pencilArray[j].vertices[k])
				bufferCtx.lineTo(pencilArray[j].X + pencilArray[j].vertices[k][0], pencilArray[j].Y + pencilArray[j].vertices[k][1]);
			}
		}
	}
}


function shapeTransforms(Array){
	if(Array[0]){
		for(var i = 0; i < Array.length; i++){
			//bufferCtx.fillStyle = Array[i].colour;
			shadow(Array, i);
			changeColour(Array, i);
			
			bufferCtx.save();
			//bufferCtx.fillStyle = Array[i].colour;
			
			var Xpoint_0 = Array[i].vertices[0][0] + Array[i].X;
			var Ypoint_0 = Array[i].vertices[0][1] + Array[i].Y;

			bufferCtx.beginPath();
			bufferCtx.moveTo(Xpoint_0, Ypoint_0); // first point of the custom shape is drawn here

			for(var j = 0; j < Array[i].vertices.length; j++){
					var Xpoint = Array[i].vertices[j][0] + Array[i].X;
					var Ypoint = Array[i].vertices[j][1] + Array[i].Y;
				
				if(Array[i].vertices[j][2]){ // checks if a vertex has been clicked
					Array[i].vertices[j][0] = mousePos.x - Array[i].X;
					Array[i].vertices[j][1] = mousePos.y - Array[i].Y;
					
				}
				bufferCtx.lineTo(Xpoint, Ypoint); 
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
			bufferCtx.beginPath();
			bufferCtx.moveTo(Array[i].X + Array[i].vertices[0][0], Array[i].Y + Array[i].vertices[0][1]);
			bufferCtx.lineTo(Array[i].X, Array[i].Y);
			bufferCtx.stroke();
		}
		
	if(reShape){
		onReshape = false;
		for(var j = 0; j < Array[i].vertices.length; j++){
				var Xpoint = Array[i].vertices[j][0] + Array[i].X;
				var Ypoint = Array[i].vertices[j][1] + Array[i].Y;
					if(distance(mousePos.x - Xpoint, mousePos.y - Ypoint)< 5){ // detects when the cursor is hovering over a vertex and highlights it in darkblue
						onReshape = true;
						bufferCtx.fillStyle = 'darkblue';
						for(var k = 0; k < Array[i].vertices.length; k++){ //draws the small blue dots for each vertex
							var Xpoint = Array[i].vertices[k][0] + Array[i].X;
							var Ypoint = Array[i].vertices[k][1] + Array[i].Y;
							bufferCtx.beginPath();
							bufferCtx.arc(Xpoint, Ypoint, 3, 0, 2*Math.PI);
							bufferCtx.fill();
							}
						}
					}
				} 
				
				
	if(physics && Array != wallArray){
		if(Array[i].gravity){
			Array[i].velocity[1] += gravity/20;
		}
	}  
				changeSize(Array, i);
				rotateShape(Array, i);
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

	image.style.visibility = 'hidden';
	//PickColor.style.visibility = 'hidden';
	$('#pencilList').css('display', 'none');
	$('#rotateList').css('display', 'none');
	pencilCursor();

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
/*
function chooseColour(){
	for(colour in colours){
		if(colours[colour][1]){
			return colours[colour][0];
		}
	}
}*/

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
}/***** New File *****/var startPoint = [];
var endPoint = [];
var normalVector_x = [];
var normalVector_y = [];
var calculatedCollisionPointX = 0;
var calculatedCollisionPointY = 0;
var repulsiveF = [];
var shapeBCenter = [];
var shapeACenter = [];
var colVelocity = [];
var collidingShapes = [];
var index = 0;
var shapeA = [];
var shapeB = [];
var shapeB = [];
var reset = false;
var selectAll = false;
var showBlueprint = {
		on: false, 
		all: false, 
		physics: true, 
		collidingSide: false, 
		boundingRect: false, 
		preCollision: false,
		collisionPoint: false,
		collisionShadow: false,
		centroid: false,
		shadowCentroid: false,
		frameRate: false,
		arrow: {
			normal: false,
			repulsionA: false,
			repulsionB: false,
			relativeCollisionPointVelocity: false,
			collisionPointVelocity: false,
		}
	};
		//Draw shape's collision outline
function collisionShadow(){
	if(showBlueprint.collisionShadow && showBlueprint.on){
		if(collidingShapes[0][0]){
		bufferCtx.save();										
		bufferCtx.strokeStyle = 'black';
		bufferCtx.lineWidth = 0.3;
		bufferCtx.globalAlpha = 0.03;

		for(var a = 0; a < collidingShapes.length; a++){
			if(a == 0){
				bufferCtx.fillStyle = 'green';
			}
			if(a == 1){
				bufferCtx.fillStyle = 'blue';
			}
			bufferCtx.beginPath();
			bufferCtx.moveTo(collidingShapes[a][0][0], collidingShapes[a][0][1]); // first point of the shape is drawn here
			for(var b = 0; b < collidingShapes[a].length; b++){
				bufferCtx.lineTo(collidingShapes[a][b][0], collidingShapes[a][b][1]); // all the other points are drawn here
			}
			bufferCtx.stroke();
			bufferCtx.fill();
		}
		bufferCtx.restore();
		}
	}
}

function checkbox(box){
	if(selectAll){
		box.checked = true;
		return true;
	}else if(reset){
		box.checked = false;
		return false;
	}
	
	if(box.checked){
		return true;
	}else if(!box.checked){
		return false;
	}
}

function displayData(){
	var normal = document.getElementById("normal");
	var repulsionA = document.getElementById("repulsionA");
	var repulsionB = document.getElementById("repulsionB");
	var colPointRelVel = document.getElementById("colPointRelVel");
	var collisionPoint = document.getElementById("collisionPoint");
	var collidingSide = document.getElementById("collidingSide");
	var collisionShadow = document.getElementById("collisionShadow");
	var boundingRect = document.getElementById("boundingRect");
	var preCollision = document.getElementById("preCollision");
	var centroid = document.getElementById("centroid");
	var shadowCentroid = document.getElementById("shadowCentroid");
	var frameRate = document.getElementById("frameRate");	
	if(checkbox(normal)){
		showBlueprint.arrow.normal = true;
	}else{
		showBlueprint.arrow.normal = false;
	}
	
	if(checkbox(repulsionA)){
		showBlueprint.arrow.repulsionA = true;
	}else{
		showBlueprint.arrow.repulsionA = false;
	}
	
	if(checkbox(repulsionB)){
		showBlueprint.arrow.repulsionB = true;
	}else{
		showBlueprint.arrow.repulsionB = false;
	}
	if(checkbox(colPointRelVel)){
		showBlueprint.arrow.relativeCollisionPointVelocity = true;
	}else{
		showBlueprint.arrow.relativeCollisionPointVelocity = false;
	}
	
	if(checkbox(collisionPoint)){
		showBlueprint.collisionPoint = true;
	}else{
		showBlueprint.collisionPoint = false;
	}
	
	if(checkbox(collidingSide)){
		showBlueprint.collidingSide = true;
	}else{
		showBlueprint.collidingSide = false;
	}
	
	if(checkbox(collisionShadow)){
		showBlueprint.collisionShadow = true;
	}else{
		showBlueprint.collisionShadow = false;
	}
	
	if(checkbox(boundingRect)){
		showBlueprint.boundingRect = true;
	}else{
		showBlueprint.boundingRect = false;
	}
	
	if(checkbox(preCollision)){
		showBlueprint.preCollision = true;
	}else{
		showBlueprint.preCollision = false;
	}
	
	if(checkbox(centroid)){
		showBlueprint.centroid = true;
	}else{
		showBlueprint.centroid = false;
	}
	
	if(checkbox(shadowCentroid)){
		showBlueprint.shadowCentroid = true;
	}else{
		showBlueprint.shadowCentroid = false;
	}
	
	if(checkbox(frameRate)){
		showBlueprint.frameRate = true;
		$('#fps').css({display: 'block'});
	}else{
		showBlueprint.frameRate = false;
		$('#fps').css({display: 'none'});
	}	
}

function arrow(firstPoint, secondPoint, type){
	if(showBlueprint.arrow[type]){
		var firstPointRef = [firstPoint[0], firstPoint[1]];
		var secondPointRef = [firstPoint[0], firstPoint[1] - 1];
		var referenceVector = [secondPointRef[0] - firstPointRef[0], secondPointRef[1] - firstPointRef[1]];
		
		var arrowVector = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
		var arrowVectorMag = distance([firstPoint[0] - secondPoint[0]], [firstPoint[1] - secondPoint[1]]);
		
		secondPointRef = [firstPoint[0], firstPoint[1] - arrowVectorMag];
		
		var arrowAngle = calcAngle(referenceVector[0], referenceVector[1], arrowVector[0], arrowVector[1]);

		if(showBlueprint.on){
							/** The Shaft of the Arrow **/
			bufferCtx.save();
			bufferCtx.translate(firstPoint[0], firstPoint[1]);
			bufferCtx.rotate(arrowAngle);
			bufferCtx.translate(-firstPoint[0], -firstPoint[1]);
			if(type === 'normal'){
				bufferCtx.strokeStyle = '#484848  ';
			}else if(type === 'repulsionA'){
				bufferCtx.strokeStyle = 'green';
			}else if(type === 'repulsionB'){
				bufferCtx.strokeStyle = 'blue';
			}else if(type === 'relativeCollisionPointVelocity'){
				bufferCtx.strokeStyle = 'black';
			}else{
				bufferCtx.strokeStyle = 'black';
			}
			
			bufferCtx.lineWidth = 1;
			bufferCtx.beginPath();
			bufferCtx.moveTo(firstPoint[0], firstPoint[1]);
			bufferCtx.lineTo(secondPointRef[0], secondPointRef[1]);
			bufferCtx.stroke();
							/** The Head of the Arrow **/
			if(type === 'normal'){
				bufferCtx.fillStyle = '#484848  ';
			}else if(type === 'repulsionA'){
				bufferCtx.fillStyle = 'green';
			}else if(type === 'repulsionB'){
				bufferCtx.fillStyle = 'blue';
			}else if(type === 'relativeCollisionPointVelocity'){
				bufferCtx.fillStyle = 'black';
			}else{
				bufferCtx.fillStyle = 'black';
			}
			bufferCtx.beginPath();
			bufferCtx.moveTo(secondPointRef[0], secondPointRef[1] -6);
			bufferCtx.lineTo(secondPointRef[0] -4, secondPointRef[1]);
			bufferCtx.lineTo(secondPointRef[0] +4, secondPointRef[1]);
			bufferCtx.fill();
			bufferCtx.restore();
			}
		}
	}


var obj = {a:6, b:3, c:5}; //Temporary
var arr = [1, 2, 3]; //Temporary

function blueprint(array, i){
	//if(physics){
	
	if(showBlueprint.on && showBlueprint.collidingSide){
			bufferCtx.save();
			bufferCtx.strokeStyle = 'red';
			bufferCtx.lineWidth = 1;
			bufferCtx.beginPath();
			bufferCtx.moveTo(startPoint[0], startPoint[1]);
			bufferCtx.lineTo(endPoint[0], endPoint[1]);
			bufferCtx.stroke();
			bufferCtx.restore();
	}

		collidingShapes[0] = [];
		// Define shapeA's collision outline
		for(var s = 0; s < shapeA.length; s++){
			collidingShapes[0][s] = [];
			collidingShapes[0][s][0] = shapeACenter[0] + shapeA[s][0]; 
			collidingShapes[0][s][1] = shapeACenter[1] + shapeA[s][1]; 
		}

		// Define shapeB's collision outline
		collidingShapes[1] = [];
		for(var s = 0; s < shapeB.length; s++){
			collidingShapes[1][s] = [];
			collidingShapes[1][s][0] = shapeBCenter[0] + shapeB[s][0]; 
			collidingShapes[1][s][1] = shapeBCenter[1] + shapeB[s][1]; 
		}

							/** The Shadow Centroid **/
		if(showBlueprint.shadowCentroid){
							//Shape A
			bufferCtx.save();
			bufferCtx.fillStyle = 'green';
			bufferCtx.globalAlpha = 0.2;
			bufferCtx.beginPath();
			bufferCtx.arc(shapeACenter[0], shapeACenter[1], 3, 0, 2*Math.PI);
			bufferCtx.fill();
			bufferCtx.restore();
							//Shape B
			bufferCtx.save();
			bufferCtx.fillStyle = 'blue';
			bufferCtx.globalAlpha = 0.2;
			bufferCtx.beginPath();
			bufferCtx.arc(shapeBCenter[0], shapeBCenter[1], 3, 0, 2*Math.PI);
			bufferCtx.fill();
			bufferCtx.restore();
		}
				//}
	
	arrow([calculatedCollisionPointX, calculatedCollisionPointY], [calculatedCollisionPointX + normalVector_x * 20, calculatedCollisionPointY + normalVector_y * 20], 'normal');// normal vector
	arrow([shapeACenter[0], shapeACenter[1]], [shapeACenter[0] - repulsiveF[0] * 200, shapeACenter[1] - repulsiveF[1] * 200], 'repulsionA'); // repulsion vector Shape A
	arrow([shapeBCenter[0], shapeBCenter[1]], [shapeBCenter[0] + repulsiveF[0] * 200, shapeBCenter[1] + repulsiveF[1] * 200], 'repulsionB'); // repulsion vector Shape B
	arrow([calculatedCollisionPointX, calculatedCollisionPointY], [calculatedCollisionPointX + 20 * colVelocity[0], calculatedCollisionPointY + 20 * colVelocity[1]], 'relativeCollisionPointVelocity'); // collision velocity vector
	collisionShadow();
	
	if(showBlueprint.collisionPoint && showBlueprint.on){// Draw collision point
						/** Outer Circle **/
		bufferCtx.save();
		bufferCtx.fillStyle = 'black';
		bufferCtx.beginPath();
		bufferCtx.arc(calculatedCollisionPointX, calculatedCollisionPointY, 2, 0, 2*Math.PI);
		bufferCtx.fill();
						/** Inner Circle **/
		bufferCtx.fillStyle = 'yellow';
		bufferCtx.beginPath();
		bufferCtx.arc(calculatedCollisionPointX, calculatedCollisionPointY, 1, 0, 2*Math.PI);
		bufferCtx.fill();
		bufferCtx.restore();
	}
	

						
	if(showBlueprint.on){
		bufferCtx.fillStyle = '#505050';
		bufferCtx.font = "13px sans-serif";
		bufferCtx.fillText("(" + mousePos.x + ", " + mousePos.y + ")", mousePos.x, mousePos.y - 30);
		
		for(var i = 0; i < array.length; i++){
			if(showBlueprint.centroid){
								/** The Centroid **/
				bufferCtx.fillStyle = 'black';
				bufferCtx.beginPath();
				bufferCtx.arc(array[i].X, array[i].Y, 3, 0, 2*Math.PI);
				bufferCtx.fill();
			}
		if(showBlueprint.all){
			bufferCtx.save();
			for(var n = 0; n < array[i].vertices.length; n++){
				if(array[i].vertices[n][3] && array[i].vertices[n][3].collision){
					bufferCtx.fillStyle = 'red';
					bufferCtx.beginPath();
					bufferCtx.arc(array[i].X + array[i].vertices[n][0], array[i].Y  + array[i].vertices[n][1], 5, 0, 2*Math.PI);
					bufferCtx.fill();
				}
			}
		bufferCtx.restore();
			//bufferCtx.fillStyle = 'black';
			bufferCtx.beginPath();
			bufferCtx.arc(array[i].X, array[i].Y, 4, 0, 2*Math.PI);
			bufferCtx.fill();
			
			bufferCtx.beginPath();
			bufferCtx.arc(array[i].X, array[i].Y, array[i].radius, 0, 2*Math.PI);
			bufferCtx.stroke();
			
			bufferCtx.strokeStyle = 'red';
			bufferCtx.beginPath();
			bufferCtx.arc(array[i].X, array[i].Y, array[i].stretchRadius, 0, 2*Math.PI);
			bufferCtx.stroke();

			bufferCtx.strokeStyle = 'black';
			bufferCtx.fillStyle = 'white';
			bufferCtx.beginPath();
			bufferCtx.arc(array[i].centroid[0], array[i].centroid[1], 3, 0, 2*Math.PI);
			bufferCtx.fill();
			bufferCtx.stroke();
			}
			if(array[i].preCollision && showBlueprint.preCollision){
				bufferCtx.save();
				bufferCtx.strokeStyle = 'green';
				bufferCtx.lineWidth = 0.7;
				bufferCtx.beginPath();
				bufferCtx.arc(array[i].X, array[i].Y, array[i].setOuterRadius(), 0, 2*Math.PI);
				bufferCtx.stroke();
				if(array[i].collision){
					bufferCtx.fillStyle = 'black';
					bufferCtx.strokeStyle = 'black';
					var collisionPoint_x = array[i].X + array[i].collisionPoint.x;
					var collisionPoint_y = array[i].Y + array[i].collisionPoint.y;
					
					array[i].lineColour = 'blue';
					array[i].lineWidth = 4;
					
					bufferCtx.beginPath();
					bufferCtx.moveTo(collisionPoint_x, collisionPoint_y);
					bufferCtx.lineTo(collisionPoint_x + 100 * array[i].collisionPoint.velocity[0], collisionPoint_y + 100 * array[i].collisionPoint.velocity[1]);
					bufferCtx.stroke();
					
					bufferCtx.beginPath();
					bufferCtx.arc(collisionPoint_x, collisionPoint_y, 3, 0, 2*Math.PI);
					bufferCtx.fill();
					bufferCtx.restore();
				}else{
					array[i].lineColour = 'black';
					array[i].lineWidth = 0.7;
					bufferCtx.restore();
				}
				
			}
			if(showBlueprint.boundingRect){
				bufferCtx.save();
				bufferCtx.rect(array[i].boundingRectangle.minX + array[i].X, array[i].boundingRectangle.minY + array[i].Y, array[i].boundingRectangle.width, array[i].boundingRectangle.height);
				bufferCtx.stroke();
				bufferCtx.restore();
			}
		}
	}

	//}//if physics

}
/***** New File *****/function isPointInShape(point, shape, x, y){
	/*console.log('[x, y]: ', [x, y]);
	console.log('point: ', point);*/
	bufferCtx.beginPath();
	bufferCtx.moveTo(shape[0][0] + x, shape[0][1] + y);
	for(var m = 0; m < shape.length; m++){ // check the shape
		bufferCtx.lineTo(shape[m][0] + x, shape[m][1] + y);
	}
	if(bufferCtx.isPointInPath(point[0], point[1])){
		return true;
	} else {
		return false;
	}
}

// shape = shapeSelection.shapes[unit][2][j].vertices
// point = [shapeSelection.shapes[key][2][i].vertices[k][0] + shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].vertices[k][1] + shapeSelection.shapes[key][2][i].Y]
// x = shapeSelection.shapes[unit][2][j].X
// y = shapeSelection.shapes[unit][2][j].Y


function sameDirection(vector1, vector2){
	if(distance(vector1[0] + vector2[0], vector1[1] + vector2[1]) > distance(vector1[0] - vector2[0], vector1[1] - vector2[1])){
		return true;
	}else if(distance(vector1[0] + vector2[0], vector1[1] + vector2[1]) < distance(vector1[0] - vector2[0], vector1[1] - vector2[1])){
		return false;
	}
}

function normalVector(gradient, translationalVelocity, point, shape, x, y){
	var isColInternal = false;
	var normalGradient = -1/gradient;
	var theta = Math.atan(normalGradient);
	var _normalVector = [Math.cos(theta), Math.sin(theta)];
												//make sure that the normal vector is pointing outward

	point[0] -= _normalVector[0] * 1;
	point[1] -= _normalVector[1] * 1;

	//if(sameDirection(translationalVelocity, _normalVector)){
	if(!isPointInShape(point, shape, x, y)){
		_normalVector[0] *= -1;
		_normalVector[1] *= -1;
		isColInternal = true;
	}


	var pointInShape = isPointInShape(point, shape, x, y);
	//console.log('point#################################################################################', point);
	//console.log('isPointInShape#################################################################################', pointInShape);

	return [_normalVector[0], _normalVector[1], isColInternal];
}

/***
	sortRange: takes an a array of 2 numbers and returns a numerically sorted version
	Example: sortRange([5, 3]) => [3, 5]
***/
function sortRange(arr) {
	if(arr[0] > arr[1]) {
		return [arr[1], arr[0]];
	} else if(arr[0] < arr[1]) {
		return [arr[0], arr[1]];
	} else {
		return arr;
	}
}

/***
	xyRange: takes a 2 dimensional array which represents a line and returns another
	2 dimensional array with the x and y coordinates sorted numerically and grouped together
	Examples: xyRange([[1, 2], [3, 4]]) => [[1, 3], [2, 4]]
			  xyRange([[3, 4], [1, 2])) => [[1, 3], [2, 4]]
***/
function xyRange(arr){
	var xRange_a = sortRange([arr[0][0], arr[1][0]]);
	var yRange_a = sortRange([arr[0][1], arr[1][1]]);
	return [xRange_a, yRange_a];
}

/***
	overlap: takes 2 numerically sorted arrays and checks to see if their values overlap
	Examples: overlap([1, 3], [4, 7]) => false
			  overlap([1, 3], [2, 7]) => true
***/
function overlap(arr1, arr2){ //arr1 and arr2 are sorted arrays
	if(arr1[0] > arr2[1]) {
		return false;
	}else if(arr1[1] < arr2[0]){
		return false;
	}else{
		return true;
	}
}

/***
	defineLine: takes a line and finds the formula of the equation that desrcribe the line
	by calculating its gradient and y-intercept.
	Example: overlap([[0, 0], [4, 8]]) => {gradient: 2, yIntercept: 0}
***/
//ToDO: this function needs to work for vertical and horizontal lines
function defineLine(arr){
	var width = arr[1][0] - arr[0][0];
	var height = arr[1][1] - arr[0][1];
	var gradient = height / width;
	var yIntercept = arr[1][1] - gradient * arr[1][0];
	var line = {
			gradient: gradient,
			yIntercept: yIntercept
		};
	return line;
}


/***
	findIntersectionPoint: takes 2 2-dimensional arrays which represent 2 line segments,
	it finds the equation of the lines in terms of y = mx + c and then it calculates
	their point of intersection, provided that they are not parallel.
	findIntersectionPoint returns an array, the first 2 elements are the x and y coordinates of the intersection point respectively,
	the 3rd element tells us if the intersection point lies on the line segments.
	Examples: findIntersectionPoint([[1, 6], [3, 1]], [[1, 2], [3, 4]]) => {intersecting: true, intersectionPoint:[ 2.142857142857143, 3.1428571428571432]}
			  findIntersectionPoint([[1, 6], [2, 5]], [[1, 2], [3, 4]]) => [3, 4, false]
			  findIntersectionPoint([[1, 6], [2, 5]], [[1, 2], [3, 4]]) => {intersecting: false, intersectionPoint:[3, 4]}
***/

function findIntersectionPoint(arr1, arr2){
	var lineA = defineLine(arr1);
	var lineB = defineLine(arr2);

	//line A
	var gradient_a = lineA.gradient;
	var yIntercept_a = lineA.yIntercept;

	//line B
	var gradient_b = lineB.gradient;
	var yIntercept_b = lineB.yIntercept;


	/**** Handling zero and infinite gradients ****/
	if(gradient_a !== gradient_b){
		if(!(gradient_b === 0 || Math.abs(gradient_b) === Infinity)){
			if(gradient_a === 0) {//if lineA is horizontal ie y = c where c is a constant
				var intersectionPointY = arr1[0][1];
				var intersectionPointX = (intersectionPointY - yIntercept_b) / gradient_b;
			} else if(Math.abs(gradient_a) === Infinity){//if lineA is vertical
				var intersectionPointX = arr1[0][0]; console.log
				var intersectionPointY = gradient_b * intersectionPointX + yIntercept_b;
			}
		}
		if(!(gradient_a === 0 || Math.abs(gradient_a) === Infinity)){
			if(gradient_b === 0) {
				var intersectionPointY = arr2[0][1];
				var intersectionPointX = (intersectionPointY - yIntercept_a) / gradient_a;
			} else if(Math.abs(gradient_b) === Infinity){
				var intersectionPointX = arr2[0][0];
				var intersectionPointY = gradient_a * intersectionPointX + yIntercept_a;
			}
		}

		if(!(gradient_b === 0 || Math.abs(gradient_b) === Infinity) && !(gradient_a === 0 || Math.abs(gradient_a) === Infinity)){
			var intersectionPointX = (yIntercept_b - yIntercept_a) / (gradient_a - gradient_b);
			var intersectionPointY = gradient_a * intersectionPointX + yIntercept_a;
		}

		if((gradient_a === 0 && Math.abs(gradient_b) === Infinity)){
			var intersectionPointX = arr2[0][0];
			var intersectionPointY = arr1[0][1];
		} else if((gradient_b === 0 && Math.abs(gradient_a) === Infinity)){
			var intersectionPointX = arr1[0][0];
			var intersectionPointY = arr2[0][1];
		}

		if(intersectionPointX >= xyRange(arr1)[0][0] && intersectionPointX <= xyRange(arr1)[0][1]){
			return { intersecting: true, intersectionPoint: [intersectionPointX, intersectionPointY] };
		}
		return { intersecting: false, intersectionPoint: [intersectionPointX, intersectionPointY] };
	} else if(gradient_a === gradient_b && yIntercept_a !== yIntercept_b){
		return { intersecting: false, intersectionPoint: [null, null] };
	} else if(gradient_a === gradient_b && yIntercept_a === yIntercept_b){
		/*** if the parallel line overlap return [null, null, true] if not return [null, null, false] ***/
		var xRange_a = xyRange(arr1)[0];
		var xRange_b = xyRange(arr2)[0];
		if(overlap(xRange_a, xRange_b)){
			return { intersecting: true, intersectionPoint: [null, null] };
		}
		return { intersecting: false, intersectionPoint: [null, null] };
	}
}

/**
	intersect: takes a 2 2-dimensional arrays which represents 2 lines and returns
	an object with the following format { intersecting: true, intersectionPoint: [x, y] }
	the "intersecting" property tells us whether or not the point of intersection is on the line segment
	and the "intersectionPoint" property contains the intersection of the lines (in the form of y = mx + c)
	that describe the 2 line segments
	Examples: intersect([[6, 6], [6, 4]], [[5, 5], [7, 5]]) => { intersecting: true, intersectionPoint: [2.14, 3.14] }
			  intersect([[1, 6], [2, 5]], [[1, 2], [3, 4]]) => { intersecting: false, intersectionPoint: [null, null] }
**/

function intersect(arr1, arr2){
	var ranges_a = xyRange(arr1);
	var ranges_b = xyRange(arr2);

	var xRange_a = ranges_a[0];
	var yRange_a = ranges_a[1];

	var xRange_b = ranges_b[0];
	var yRange_b = ranges_b[1];

	if(overlap(xRange_a, xRange_b) && overlap(yRange_a, yRange_b)){
		return findIntersectionPoint(arr1, arr2);
	} else {
		return { intersecting: false, intersectionPoint: [null, null] };
	}
}

/**
	intersectingLines: takes 2 2-dimensional arrays (which represents 2 lines) and a boolean, it returns
	an object with the following format { intersecting: true, intersectionPoint: [x, y] }
	the "intersecting" property tells us whether or not the point of intersection is on the line segments
	and the "intersectionPoint" property contains the intersection point of the lines (in the form of y = mx + c)
	that describe the 2 line segments.
	Boolean parameter: in situations where calculating the point of intersection
					   (this is the intersection point of the equations that describes the line segments)
					   is absolutely necessary the boolean should be set to TRUE and the findIntersectionPoint
					   function is used.
					   On the other hand if we simply need to know whether or not 2 line segments intersect
					   then we set the boolean to FALSE and the intersect function is used instead.

	Examples: intersectingLines([[1, 6], [2, 5]], [[1, 2], [3, 4]], false) => { intersecting: false, intersectionPoint: [null, null] }
			  intersectingLines([[1, 6], [2, 5]], [[1, 2], [3, 4]], true) => { intersecting: false, intersectionPoint: [3, 4] }
**/

function intersectingLines(arr1, arr2, bool){
	if(bool === true){
		return findIntersectionPoint(arr1, arr2);
	}else if(bool === false){
		return intersect(arr1, arr2);
	}
}
/***
	distanceFromLine: takes a point and a line and calculates the distance between the line and the point.
	Example: distanceFromLine([0, 2], [[0, 0], [2, 2]]) => 1.4142135623730951
***/
function distanceFromLine(point, line){
	var lineGradient = defineLine(line).gradient;
	var perpLineGradient = ( -1 / lineGradient );
	var newPoint = [point[0] + 1, point[1] + perpLineGradient];
	var newLine = [point, newPoint];
	var intersectionPoint = findIntersectionPoint(line, newLine).intersectionPoint;
	var pointDistance = distance(intersectionPoint[0] - point[0], intersectionPoint[1] - point[1]);
	return pointDistance;
}


//console.log('distanceFromLine: ', distanceFromLine([0, 2], [[0, 0], [2, 2]]));
//console.log('distanceFromLine: ', distanceFromLine([1, 5], [[0, 0], [2, 0]]));
//console.log('intersectingLines: ', intersectingLines([[1, 6], [3, 1]], [[1, 2], [3, 4]], false)); // true
//console.log('intersectingLines: ', intersectingLines([[1, 6], [2, 5]], [[1, 2], [3, 4]], false)); // false

/** Horizontal line crossing vertical line **/
//console.log('intersectingLines: ', intersectingLines([[6, 6], [6, 4]], [[5, 5], [7, 5]], false)); // true
//console.log('intersectingLines: ', intersectingLines([[5, 3], [6, 1]], [[7, 1], [8, 3]], false)); // false

/** Horizontal line crossing diagonal line **/
//console.log('intersectingLines: ', intersectingLines([[1, 3], [3, 3]], [[1, 2], [3, 4]], false)); // true

/** vertical line crossing diagonal line **/
//console.log('intersectingLines: ', intersectingLines([[5, 3], [6, 1]], [[5.5, 0], [5.5, 3]], false)); // true

/** 2 non-intersecting parallel line segments with equal y-intercepts **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [4, 4]], [[8, 8], [10, 10]], false));

/** 2 non-intersecting parallel line segments with different y-intercepts **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [8, 8]], [[3, 2], [9, 8]], false));

/** 2 intersecting parallel line segments **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [8, 8]], [[4, 4], [12, 12]], false));

/** 2 vertical parallel line segments with different x-values **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [2, 4]], [[3, 2], [3, 4]], false));

/** 2 non-overlapping vertical parallel line segments with same x-value **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [2, 4]], [[2, 6], [2, 8]], false));

/** 2 overlapping vertical parallel line segments with same x-value **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [2, 4]], [[2, 3], [2, 8]], false));



/** 2 horizontal parallel line segments with different y-values **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [4, 2]], [[2, 4], [4, 4]], false));

/** 2 non-overlapping horizontal parallel line segments with same y-value **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [4, 2]], [[6, 2], [8, 2]], false));

/** 2 overlapping horizontal parallel line segments with same y-value **/
//console.log('intersectingLines: ', intersectingLines([[2, 2], [4, 2]], [[3, 2], [8, 2]], false));


/*console.log('findIntersectionPoint: ', findIntersectionPoint([[1, 6], [3, 1]], [[1, 2], [3, 4]])); // true
console.log('findIntersectionPoint: ', findIntersectionPoint([[1, 6], [2, 5]], [[1, 2], [3, 4]])); // false
console.log('findIntersectionPoint: ', findIntersectionPoint([[6, 6], [6, 4]], [[5, 5], [7, 5]])); // true
console.log('findIntersectionPoint: ', findIntersectionPoint([[5, 3], [6, 1]], [[7, 1], [8, 3]])); // false
console.log('findIntersectionPoint: ', findIntersectionPoint([[1, 3], [3, 3]], [[1, 2], [3, 4]])); // true
console.log('findIntersectionPoint: ', findIntersectionPoint([[5, 3], [6, 1]], [[5.5, 0], [5.5, 3]])); // true*/

//console.log('intersect: ', intersect([[1, 6], [3, 1]], [[1, 2], [3, 4]])); // true
//console.log('intersect: ', intersect([[1, 6], [2, 5]], [[1, 2], [3, 4]])); // false

/** Horizontal line crossing vertica line **/
//console.log('intersect: ', intersect([[6, 6], [6, 4]], [[5, 5], [7, 5]])); // true
//console.log('intersect: ', intersect([[5, 3], [6, 1]], [[7, 1], [8, 3]])); // false

/** Horizontal line crossing diagonal line **/
//console.log('intersect: ', intersect([[1, 3], [3, 3]], [[1, 2], [3, 4]])); // true



/*
console.log('overlap: ', overlap([1, 3], [4, 7]));
console.log('overlap: ', overlap([1, 3], [2, 7]));
console.log('overlap: ', overlap([2, 7], [2, 7]));
console.log('overlap: ', overlap([1, 3], [3, 7]));*/

/*
console.log('xyRange ', xyRange([[1, 2], [3, 4]]));
console.log('xyRange ', xyRange([[3, 4], [1, 2]]));*/

/*
console.log('sortRange: ', sortRange([1, 2]));
console.log('sortRange: ', sortRange([2, 1]));
console.log('sortRange: ', sortRange([2, 10]));
console.log('sortRange: ', sortRange([30, 10]));
console.log('sortRange: ', sortRange([5, 5]));
console.log('sortRange: ', sortRange([21, 0]));
console.log('sortRange: ', sortRange([2, -10]));*/

var physicsObject = {throwArray:[]};
var gravity = 0.1;
var restitution = 0.5;
var minBounceVelocity = 5;
var massToPixelRatio = 0.01;
var scale = 0.1;
var resolution = 1;


function physTest(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(physics && dragging && shapeSelection.shapes[key][2][i].selected){
				shapeSelection.shapes[key][2][i].angularVelocity = 0;
			}
		}
	}
}


function physMove(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(physics && dragging && shapeSelection.shapes[key][2][i].selected && shapeSelection.shapes[key][2][i].mass !== Infinity){
				physicsObject.throwArray.push([mousePos.x, mousePos.y]);
				var arrayLength = physicsObject.throwArray.length - 1;

				if(physicsObject.throwArray.length > 3){
					var velocity_x = (physicsObject.throwArray[arrayLength][0] - physicsObject.throwArray[arrayLength - 1][0]
					+ physicsObject.throwArray[arrayLength - 1][0] - physicsObject.throwArray[arrayLength - 2][0]
					+ physicsObject.throwArray[arrayLength - 2][0] - physicsObject.throwArray[arrayLength - 3][0])/3;

					var velocity_y = (physicsObject.throwArray[arrayLength][1] - physicsObject.throwArray[arrayLength - 1][1]
					+ physicsObject.throwArray[arrayLength - 1][1] - physicsObject.throwArray[arrayLength - 2][1]
					+ physicsObject.throwArray[arrayLength - 2][1] - physicsObject.throwArray[arrayLength - 3][1])/3;

					shapeSelection.shapes[key][2][i].velocity[0] = velocity_x;
					shapeSelection.shapes[key][2][i].velocity[1] = velocity_y;

					var TouchDistance_x = shapeSelection.shapes[key][2][i].touchPoints[0] - shapeSelection.shapes[key][2][i].X;
					var TouchDistance_y = shapeSelection.shapes[key][2][i].touchPoints[1] - shapeSelection.shapes[key][2][i].Y;

					var TouchDistance = [TouchDistance_x, TouchDistance_y];
					var gradient = TouchDistance_y/TouchDistance_x;
					var perpendicularVector = [-TouchDistance_x/gradient, -TouchDistance_y/gradient];
					var forceMagnitude = distance(velocity_x, velocity_y);

					var angle = angleCalc(perpendicularVector[0], perpendicularVector[1], velocity_x, velocity_y);
					angularVelocity = forceMagnitude * Math.cos(angle);
					//shapeSelection.shapes[key][2][i].angularVelocity = angularVelocity/150;
				}
			}
		}
	}
}

function clearPhysMove(){
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			if(physics && shapeSelection.shapes[key][2][i].selected){
				physicsObject.throwArray = [];
				//shapeSelection.shapes[key][2][i].angularVelocity = 0;
			}
		}
	}
}

function collisionDetector(){
if(physics)
	for(key in shapeSelection.shapes){
		for(var i = 0; i < shapeSelection.shapes[key][2].length; i++){
			/*var boundingRectWidthA = shapeSelection.shapes[key][2][i].boundingRectangle.width;
			var boundingRectHeightA = shapeSelection.shapes[key][2][i].boundingRectangle.height;
			var boundingRectMinXA = shapeSelection.shapes[key][2][i].boundingRectangle.minX;
			var boundingRectMinYA = shapeSelection.shapes[key][2][i].boundingRectangle.minY;*/
			shapeSelection.shapes[key][2][i].preCollision = false;
			//shapeSelection.shapes[key][2][i].collision = false;
			for(unit in shapeSelection.shapes){
				for(var j = 0; j < shapeSelection.shapes[unit][2].length; j++){
					/*var boundingRectWidthB = shapeSelection.shapes[unit][2][j].boundingRectangle.width;
					var boundingRectHeightB = shapeSelection.shapes[unit][2][j].boundingRectangle.height;
					var boundingRectMinXB = shapeSelection.shapes[unit][2][j].boundingRectangle.minX;
					var boundingRectMinYB = shapeSelection.shapes[unit][2][j].boundingRectangle.minY;*/
					if(!(i === j && key === unit)){
						if(distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y) < shapeSelection.shapes[key][2][i].setOuterRadius() + shapeSelection.shapes[unit][2][j].setOuterRadius() ||
							unit == 'wall' && j == 0 && shapeSelection.shapes[key][2][i].X < shapeSelection.shapes[key][2][i].setOuterRadius() ||
							unit == 'wall' && j == 1 && shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].setOuterRadius() > canvas.width ||
							unit == 'wall' && j == 2 && shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].setOuterRadius() > canvas.height ||
							unit == 'wall' && j == 3 && shapeSelection.shapes[key][2][i].Y < shapeSelection.shapes[key][2][i].setOuterRadius() + 50){
							shapeSelection.shapes[key][2][i].preCollision = true;
						/*for(var k = 0; k < 4; k++){
							if(k === 0){// top left corner
								if(shapeSelection.shapes[unit][2][j].X + boundingRectMinXB >= shapeSelection.shapes[key][2][i].X + boundingRectMinXA &&
									shapeSelection.shapes[unit][2][j].X + boundingRectMinXB <= shapeSelection.shapes[key][2][i].X + boundingRectMinXA + boundingRectWidthA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB >= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB <= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA + boundingRectWidthA
								){
									shapeSelection.shapes[key][2][i].preCollision = true;
									break;
								}
							}

							if(k === 1){// top right corner
								if(shapeSelection.shapes[unit][2][j].X + boundingRectMinXB + boundingRectWidthB >= shapeSelection.shapes[key][2][i].X + boundingRectMinXA &&
									shapeSelection.shapes[unit][2][j].X + boundingRectMinXB + boundingRectWidthB <= shapeSelection.shapes[key][2][i].X + boundingRectMinXA + boundingRectWidthA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB >= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB <= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA + boundingRectWidthA
								){
									shapeSelection.shapes[key][2][i].preCollision = true;
									break;
								}
							}

							if(k === 2){// bottom right corner
								if(shapeSelection.shapes[unit][2][j].X + boundingRectMinXB + boundingRectWidthB >= shapeSelection.shapes[key][2][i].X + boundingRectMinXA &&
									shapeSelection.shapes[unit][2][j].X + boundingRectMinXB + boundingRectWidthB <= shapeSelection.shapes[key][2][i].X + boundingRectMinXA + boundingRectWidthA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB + boundingRectHeightB >= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB + boundingRectHeightB <= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA + boundingRectWidthA
								){
									shapeSelection.shapes[key][2][i].preCollision = true;
									break;
								}
							}

							if(k === 3){// bottom left corner
								if(shapeSelection.shapes[unit][2][j].X + boundingRectMinXB >= shapeSelection.shapes[key][2][i].X + boundingRectMinXA &&
									shapeSelection.shapes[unit][2][j].X + boundingRectMinXB <= shapeSelection.shapes[key][2][i].X + boundingRectMinXA + boundingRectWidthA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB + boundingRectHeightB >= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA &&
									shapeSelection.shapes[unit][2][j].Y + boundingRectMinYB + boundingRectHeightB <= shapeSelection.shapes[key][2][i].Y + boundingRectMinYA + boundingRectWidthA
								){
									shapeSelection.shapes[key][2][i].preCollision = true;
									break;
								}
							}
						}
							if(shapeSelection.shapes[key][2][i].preCollision === true){*/
								for(var k = 0; k < shapeSelection.shapes[key][2][i].vertices.length; k++){ // check each vertex of shape A to see if it's in shape B
									var collidingVertex = [shapeSelection.shapes[key][2][i].vertices[k][0] + shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].vertices[k][1] + shapeSelection.shapes[key][2][i].Y];
									if(isPointInShape([collidingVertex[0], collidingVertex[1]], shapeSelection.shapes[unit][2][j].vertices, shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].Y)){
										shapeSelection.shapes[key][2][i].contactList[0] = shapeSelection.shapes[unit][2][j].id;
										//shapeSelection.shapes[unit][2][j].contactList[0] = shapeSelection.shapes[key][2][i].id;
										if(shapeSelection.shapes[key][2][i].vertices[k][3].collision === false){
										/*****************************************Body A ***************************************************/
										//finding collision points on A
										var massA = shapeSelection.shapes[key][2][i].mass;
										var momentOfInertiaA = shapeSelection.shapes[key][2][i].momentOfInertia;

										shapeSelection.shapes[key][2][i].collisionPoint.x = shapeSelection.shapes[key][2][i].vertices[k][0];
										shapeSelection.shapes[key][2][i].collisionPoint.y = shapeSelection.shapes[key][2][i].vertices[k][1];

										collisionPointA_x = shapeSelection.shapes[key][2][i].collisionPoint.x;
										collisionPointA_y = shapeSelection.shapes[key][2][i].collisionPoint.y;

										//calculate the velocity vector of the collision point for shape A relative to the center of mass
										var rotA = rotater2(0, 0, shapeSelection.shapes[key][2][i].collisionPoint.x, shapeSelection.shapes[key][2][i].collisionPoint.y, shapeSelection.shapes[key][2][i].angularVelocity);

										//calculate the actual velocity vector of the collision point for shape shapeSelection.shapes[key][2][i]
										shapeSelection.shapes[key][2][i].collisionPoint.velocity[0] = shapeSelection.shapes[key][2][i].velocity[0] + rotA[0];
										shapeSelection.shapes[key][2][i].collisionPoint.velocity[1] = shapeSelection.shapes[key][2][i].velocity[1] + rotA[1];

										var colPointVelA_x = shapeSelection.shapes[key][2][i].collisionPoint.velocity[0];
										var colPointVelA_y = shapeSelection.shapes[key][2][i].collisionPoint.velocity[1];


										/***************************************** Body B ***************************************************/

										//finding collision points on B

										var massB = shapeSelection.shapes[unit][2][j].mass;
										var momentOfInertiaB = shapeSelection.shapes[unit][2][j].momentOfInertia;

										shapeSelection.shapes[unit][2][j].collisionPoint.x = collisionPointA_x + shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X;
										shapeSelection.shapes[unit][2][j].collisionPoint.y = collisionPointA_y + shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y;

										var collisionPointB_x = shapeSelection.shapes[unit][2][j].collisionPoint.x;
										var collisionPointB_y = shapeSelection.shapes[unit][2][j].collisionPoint.y;

										//calculate the velocity vector of the collision point for shape B relative to the center of mass
										var rotB = rotater2(0, 0, shapeSelection.shapes[unit][2][j].collisionPoint.x, shapeSelection.shapes[unit][2][j].collisionPoint.y, shapeSelection.shapes[unit][2][j].angularVelocity);

										//calculate the actual velocity vector of the collision point for shape shapeSelection.shapes[unit][2][j]
										shapeSelection.shapes[unit][2][j].collisionPoint.velocity[0] = shapeSelection.shapes[unit][2][j].velocity[0] + rotB[0];
										shapeSelection.shapes[unit][2][j].collisionPoint.velocity[1] = shapeSelection.shapes[unit][2][j].velocity[1] + rotB[1];

										var colPointVelB_x = shapeSelection.shapes[unit][2][j].collisionPoint.velocity[0];
										var colPointVelB_y = shapeSelection.shapes[unit][2][j].collisionPoint.velocity[1];

										/******************************************* calculating the impulse *******************************************/

										//the difference in the velocities of the collision points
										var colVelocityAB_x = colPointVelA_x - colPointVelB_x;
										var colVelocityAB_y = colPointVelA_y - colPointVelB_y;

										var velocityAB_x = shapeSelection.shapes[key][2][i].velocity[0] - shapeSelection.shapes[unit][2][j].velocity[0];
										var velocityAB_y = shapeSelection.shapes[key][2][i].velocity[1] - shapeSelection.shapes[unit][2][j].velocity[1] ;

										var rot_x = rotA[0];
										var rot_y = rotA[1];
										//collidingVertex
										//collision_Data = collisionData([collisionPointA_x + shapeSelection.shapes[key][2][i].X, collisionPointA_y + shapeSelection.shapes[key][2][i].Y], [colVelocityAB_x, colVelocityAB_y], shapeSelection.shapes[key][2][i].vertices, [shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].Y], shapeSelection.shapes[unit][2][j].vertices, [shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].Y]);
										collision_Data = collisionData(collidingVertex, [colVelocityAB_x, colVelocityAB_y], shapeSelection.shapes[key][2][i].vertices, [shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].Y], shapeSelection.shapes[unit][2][j].vertices, [shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].Y]);
										//magnitude of vector relVelocityAB
										MagColVelocityAB = distance(colVelocityAB_x, colVelocityAB_y);

										var MagVelocityA = distance(colPointVelA_x, colPointVelA_y);
										var MagVelocityB = distance(colPointVelB_x, colPointVelB_y);

										normalVector_x = collision_Data.unitNormal[0];
										normalVector_y = collision_Data.unitNormal[1];


										//angle between normal vector and relative velocities vector
										var phi = angleCalc(normalVector_x, normalVector_y, colVelocityAB_x, colVelocityAB_y);

										var dotColVelocityABNormal = colVelocityAB_x * normalVector_x + colVelocityAB_y * normalVector_y;

										//cross product of the collision point and normal vector
										crossVelocityANormal = collisionPointA_x * normalVector_y - collisionPointA_y * normalVector_x;
										crossVelocityBNormal = collisionPointB_x * normalVector_y - collisionPointB_y * normalVector_x;

										//finding the impulse

										var impulse = -(1 + restitution) * dotColVelocityABNormal/(1/massA + 1/massB + crossVelocityANormal * crossVelocityANormal/momentOfInertiaA + crossVelocityBNormal * crossVelocityBNormal/momentOfInertiaB);
										if(massA === Infinity && massB === Infinity && momentOfInertiaA === Infinity && momentOfInertiaB === Infinity ){
											impulse = 0;
										}
										//console.log('##########################################################################################################################impulse: ', impulse);
										velocityChangeA_x = impulse * normalVector_x/massA;
										velocityChangeA_y = impulse * normalVector_y/massA;

										//console.log('velocityChangeA: ', [velocityChangeA_x, velocityChangeA_y]);
										//console.log('velocityChangeA: ', shapeSelection.shapes[key][2][i].velocity);

										velocityChangeB_x = -impulse * normalVector_x/massB;
										velocityChangeB_y = -impulse * normalVector_y/massB;

										angularVelocityChangeA = impulse * crossVelocityANormal/momentOfInertiaA;
										angularVelocityChangeB = -impulse * crossVelocityBNormal/momentOfInertiaB;

											shapeSelection.shapes[key][2][i].velocity[0] += velocityChangeA_x;
											shapeSelection.shapes[key][2][i].velocity[1] += velocityChangeA_y;

											shapeSelection.shapes[unit][2][j].velocity[0] += velocityChangeB_x;
											shapeSelection.shapes[unit][2][j].velocity[1] += velocityChangeB_y;

											shapeSelection.shapes[key][2][i].angularVelocity += angularVelocityChangeA;
											shapeSelection.shapes[unit][2][j].angularVelocity += angularVelocityChangeB;

										//Friction: subtract a percentage of the velocity
										if(!shapeSelection.shapes[key][2][i].isFixed){
											shapeSelection.shapes[key][2][i].velocity[0] -= velocityAB_x/20;
											shapeSelection.shapes[key][2][i].velocity[1] -= velocityAB_y/20;
										}
										//Freeze object if its been slowed below a certain velocity due to friction
										var MagVelocityAB = distance(velocityAB_x, velocityAB_y);

										//minFrictionVelocity
										if(MagVelocityAB < 0.05){
											shapeSelection.shapes[key][2][i].velocity[0] = 0;
											shapeSelection.shapes[key][2][i].velocity[1] = 0;
										}

										//move shapes apart immediately after collision to prevent them from sticking
										var factor = 2;
										shapeSelection.shapes[key][2][i].X += velocityChangeA_x * factor;
										shapeSelection.shapes[key][2][i].Y += velocityChangeA_y * factor;

										shapeSelection.shapes[unit][2][j].X += velocityChangeB_x * factor;
										shapeSelection.shapes[unit][2][j].Y += velocityChangeB_y * factor;

										collisionCounter++;
										shapeSelection.shapes[key][2][i].vertices[k][3] = {collision: true};

										shapeSelection.shapes[unit][2][j].X
										startPoint = collision_Data.collision_Data.sideOnB.first;
										endPoint = collision_Data.collision_Data.sideOnB.second;

							//}
									if(key != 'wall'){

										var repulsiveFactor = MagColVelocityAB * 100;

										/*if((MagColVelocityAB < 0.01 || MagVelocityA < 0.01 || MagVelocityB < 0.01) && unit != 'wall'){
											repulsiveFactor = 1;
										}*/
										if(MagColVelocityAB < 0.01 && unit != 'wall'){
											repulsiveFactor = 1;
										}
										//var ABdistance = distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y) * repulsiveFactor*1;
										var ABdistance = distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y);

										/*if(ABdistance < 1){
											ABdistance = 10;
										}*/

										var ABdistanceVector = [shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y];
										//var magABdistanceVector = distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y) * repulsiveFactor;
										//var magABdistanceVector = ABdistance * repulsiveFactor;

										var penDepth = distance(collisionPointA_x + shapeSelection.shapes[key][2][i].X - collision_Data.collision_Data.x, collisionPointA_y + shapeSelection.shapes[key][2][i].Y - collision_Data.collision_Data.y);

										repulsion = [ABdistanceVector[0]/ABdistance, ABdistanceVector[1]/ABdistance];

										var maxDepth = 0.15;
										if(penDepth > maxDepth){
											penDepth = maxDepth;
										}

										//if(unit != 'wall'){
											/*console.log('############################################################################################################  repulsion', repulsion);
											console.log('############################################################################################################  repulsion Magnitude', distance(repulsion[0], repulsion[1]));
											console.log('############################################################################################################  repulsiveFactor', repulsiveFactor);
											console.log('############################################################################################################  ABdistance', ABdistance);
											console.log('############################################################################################################  MagColVelocityAB', MagColVelocityAB);
											console.log('############################################################################################################  penDepth', penDepth);
											console.log('############################################################################################################  velocity of A', shapeSelection.shapes[key][2][i].velocity);
											console.log('############################################################################################################  collision_Data.x', collision_Data.collision_Data.x);*/
										//}


										/***************************** Getting the objects to rest on each other ****************************/

										/*if(penDepth <= 0.01 && key != 'wall'){
											shapeSelection.shapes[key][2][i].velocity[0] = 0; //Ideally relative velocity should be used here instead of absolute velocity
											shapeSelection.shapes[key][2][i].velocity[1] = 0;
										}else{
											shapeSelection.shapes[key][2][i].gravity = true;
										}*/

										var perpPointX = collisionPointA_x + shapeSelection.shapes[key][2][i].X;
										var perpPointY = collisionPointA_y + shapeSelection.shapes[key][2][i].Y;

										/***  Colliding Side ***/
										var gradient = collision_Data.collision_Data.gradient;
										calculatedCollisionPointX = collision_Data.collision_Data.x;
										calculatedCollisionPointY = collision_Data.collision_Data.y;
										colVelocity = collision_Data.collision_Data.velocity

										shapeA = [];
										shapeB = [];

											for(var s = 0; s < shapeSelection.shapes[key][2][i].vertices.length; s++){
												shapeA[s] = [];
												shapeA[s][0] = shapeSelection.shapes[key][2][i].vertices[s][0];
												shapeA[s][1] = shapeSelection.shapes[key][2][i].vertices[s][1];
											}
											for(var s = 0; s < shapeSelection.shapes[unit][2][j].vertices.length; s++){
												shapeB[s] = [];
												shapeB[s][0] = shapeSelection.shapes[unit][2][j].vertices[s][0];
												shapeB[s][1] = shapeSelection.shapes[unit][2][j].vertices[s][1];
											}

										shapeACenter = collision_Data.collision_Data.shapeACenter;
										shapeBCenter = collision_Data.collision_Data.shapeBCenter;


/*********************************************** START -- Replusion Direction Check ******************************************************************/
										var sideC = calculatedCollisionPointY - gradient * calculatedCollisionPointX;

										/*** The perpendicular line that connects the colliding side and the colliding vertex ***/
										var perpGradient = collision_Data.unitNormal[1]/collision_Data.unitNormal[0];
										var perpC = perpPointY - perpGradient * perpPointX;

										var intersectionPointX = (perpC - sideC)/(gradient - perpGradient);
										var intersectionPointY = gradient * intersectionPointX + sideC;

										if(Math.abs(gradient) >= 100){ // if the gradient is very steep use swap the roles of x and y axis in the calculation to get more accurate values for x and y at the point of intersection

											/***  Colliding Side ***/
											var swappedGradient = 1 / gradient;
											var swappedSideC = calculatedCollisionPointX - swappedGradient * calculatedCollisionPointY;

											/*** The perpendicular line ***/
											var swappedPerpGradient = 1 / perpGradient;
											var swappedPerpC = perpPointX - swappedPerpGradient * perpPointY;

											intersectionPointY = (swappedPerpC - swappedSideC)/(swappedGradient - swappedPerpGradient);
											intersectionPointX = swappedGradient * intersectionPointY + swappedSideC;

										}
										/** edgeDistance: perpendicular distance between colliding vertex and the colliding side **/
										var edgeDistance = distance(perpPointX - intersectionPointX, perpPointY - intersectionPointY); //possibly replace perpPoint with colliding vertex


										/** check to see where repulsion would move the colliding vertex relative to shape B **/
										var onPath = false;
										var checkPoint = [];
										checkPoint[0] =  perpPointX + repulsion[0] * penDepth; //multiply repulsion by 2
										checkPoint[1] =  perpPointY + repulsion[1] * penDepth; //multiply repulsion by 2


										var checkPointDistance = distance(checkPoint[0] - intersectionPointX, checkPoint[1] - intersectionPointY);

													/**** Check to see if repulsion is moving shape A in the right direction ****/

										bufferCtx.beginPath();
										bufferCtx.moveTo(shapeSelection.shapes[unit][2][j].vertices[0][0] + shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].vertices[0][1] + shapeSelection.shapes[unit][2][j].Y);
										for(var m = 0; m < shapeSelection.shapes[unit][2][j].vertices.length; m++){ // check shape B
											bufferCtx.lineTo(shapeSelection.shapes[unit][2][j].vertices[m][0] + shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].vertices[m][1] + shapeSelection.shapes[unit][2][j].Y);
										}
										if(bufferCtx.isPointInPath(checkPoint[0], checkPoint[1])){
											onPath = true;
										}

										//console.log('##########################################################################################edgeDistance', edgeDistance, checkPointDistance, pointOnB);
										if(onPath == true && checkPointDistance > edgeDistance){
											//penDepth *= -1;
										}
/*********************************************** END -- Replusion Direction Check ***********************************************************************/




										/*if(penDepth <= 0.01 && unit != 'wall'){
											shapeSelection.shapes[unit][2][j].velocity[0] = 0; // Ideally relative velocity should be used here instead of absolute velocity
											shapeSelection.shapes[unit][2][j].velocity[1] = 0;
										}else{
											shapeSelection.shapes[unit][2][j].gravity = true;
										}*/

										//(penDepth >= maxDepth * 4) condition is always false and therefore pointless since (penDepth =< maxDepth)
										if(key != 'wall' && !shapeSelection.shapes[key][2][i].isFixed){ // this condition is probably redundant
											//if(Math.abs(normalVector_y / normalVector_x) > 1){
											/*if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y / normalVector_x) > 1){
												shapeSelection.shapes[key][2][i].X += repulsion[0] * penDepth;
											}*/
											/*
											if(penDepth <= 1){
												shapeSelection.shapes[key][2][i].X += 0;
											} else {
												if(penDepth > 1){penDepth = 0.10}
												shapeSelection.shapes[key][2][i].X += repulsion[0] * penDepth;
											}
											if(penDepth > 0.10){penDepth = 0.10}*/

											//shapeSelection.shapes[key][2][i].X -= repulsion[0] * penDepth;
											//shapeSelection.shapes[key][2][i].Y -= repulsion[1] * penDepth;
											//shapeSelection.shapes[key][2][i].X

											var reposition = [calculatedCollisionPointX - collidingVertex[0], calculatedCollisionPointY - collidingVertex[1]];

											shapeSelection.shapes[key][2][i].X += normalVector_x * penDepth;
											shapeSelection.shapes[key][2][i].Y += normalVector_y * penDepth;

										}


										if(unit != 'wall' && !shapeSelection.shapes[unit][2][j].isFixed){
											//if(Math.abs(normalVector_y / normalVector_x) > 1){
											/*if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y / normalVector_x) > 1){
												shapeSelection.shapes[unit][2][j].X -= repulsion[0] * penDepth;
											}*/
											/*
											 if( penDepth <= 1){
												shapeSelection.shapes[unit][2][j].X -= 0;
											} else {
												 if(penDepth > 1){penDepth = 0.10}
												 shapeSelection.shapes[unit][2][j].X -= repulsion[0] * penDepth;
											}

											if(penDepth > 0.10){penDepth = 0.10}*/
											//shapeSelection.shapes[unit][2][j].X -= repulsion[0] * penDepth;
											//shapeSelection.shapes[unit][2][j].Y -= repulsion[1] * penDepth;

											shapeSelection.shapes[unit][2][j].X -= normalVector_x * penDepth;;
											shapeSelection.shapes[unit][2][j].Y -= normalVector_y * penDepth;;

										}

										/*if(key != 'wall'){ // this condition is probably redundant
											if(penDepth >= maxDepth * 4){
												shapeSelection.shapes[key][2][i].X += normalVector_x * penDepth;
												shapeSelection.shapes[key][2][i].Y += normalVector_y * penDepth;
											}
										}

										if(unit != 'wall'){
											if(penDepth >= maxDepth * 4){
												shapeSelection.shapes[unit][2][j].X -= normalVector_x * penDepth;
												shapeSelection.shapes[unit][2][j].Y -= normalVector_y * penDepth;
											}
										}*/

										/** repulsiveF is just for blueprint**/
										//repulsiveF[0] = -repulsion[0] * penDepth;
										//repulsiveF[1] = -repulsion[1] * penDepth;

										/** repulsiveF is just for blueprint**/
										repulsiveF[0] = -normalVector_x * penDepth;
										repulsiveF[1] = -normalVector_y * penDepth;

									}
								}// 526
								}else{
									shapeSelection.shapes[key][2][i].vertices[k][3] = {collision: false};
									shapeSelection.shapes[key][2][i].contactList = [];
									}
							}

							//check to see if any of the vertices are colliding before setting the collision of the shape
							shapeSelection.shapes[key][2][i].collision = false;
							shapeSelection.shapes[unit][2][j].collision = false;
							for(var m = 0; m < shapeSelection.shapes[key][2][i].vertices.length; m++){
								if(shapeSelection.shapes[key][2][i].vertices[m][3].collision){
									shapeSelection.shapes[key][2][i].collision = true;
									shapeSelection.shapes[unit][2][j].collision = true;
									break;
								}
							}

							//}
						}
					}
				}
			}
		}
	}
}

function collisionData(collidingVertex, velocity, shapeA, shapeA_Offset, shapeB, shapeB_Offset){
	/*if(distance(velocity[0], velocity[1]) < 0.01){ //this is to help repulsion when the collision velocity is zero or there is no collision
		velocity[0] = (collidingVertex[0] - shapeA_Offset[0])/10;
		velocity[1] = (collidingVertex[1] - shapeA_Offset[1])/10;
	}*/
	//console.log('shapeB_Offset: ', shapeB_Offset)
	var unitNormal = [];
	var intersection = [];
	var _collisionData = {};
	var gradient = velocity[1]/velocity[0];
	if (velocity[0] === 0){ //if gradient equals infinity
		gradient = 1.7976931348623157E+10;
	}
	var c = collidingVertex[1] - gradient * collidingVertex[0];
	for(var i = 1; i < shapeB.length; i++){
		var j = i-1;

		var gradient_i = (shapeB[j][1] - shapeB[i][1])/(shapeB[j][0] - shapeB[i][0]); //the gradient of each side is calculated

		if ((shapeB[j][0] - shapeB[i][0]) === 0){ //if gradient equals infinity
			gradient_i = 1.7976931348623157E+10;
		}

		var c_i = shapeB[i][1] - gradient_i * (shapeB[i][0] + shapeB_Offset[0]) + shapeB_Offset[1];

		if(gradient_i != gradient){ // if lines are not parallel
			var x = (c_i - c)/(gradient - gradient_i);
			var y = gradient * x + c;

			if(Math.abs(gradient) >= 100){ // if the gradient is very steep use swap the roles of x and y axis in the calculation to get more accurate values for x and y at the point of intersection

				var gradient_1 = 1 / gradient;

				var gradient_i_1 = 1 / gradient_i;

				var c_1 = collidingVertex[0] - gradient_1 * collidingVertex[1];

				var c_i_1 = shapeB[i][0] - gradient_i_1 * (shapeB[i][1] + shapeB_Offset[1]) + shapeB_Offset[0];

				y = (c_i_1 - c_1)/(gradient_1 - gradient_i_1);

				x = gradient_1 * y + c_1;

			}

			//unecessary repition between these equations and the ones below
			var diffA_x = shapeB[i][0] + shapeB_Offset[0] - x;
			var diffB_x = shapeB[j][0] + shapeB_Offset[0] - x;
			var diffA_y = shapeB[i][1] + shapeB_Offset[1] - y;
			var diffB_y = shapeB[j][1] + shapeB_Offset[1] - y;

			//unecessary repition between these equations and the ones above
			shapeB_X1 = shapeB[j][0] + shapeB_Offset[0];
			shapeB_Y1 = shapeB[j][1] + shapeB_Offset[1];
			shapeB_X2 = shapeB[i][0] + shapeB_Offset[0];
			shapeB_Y2 = shapeB[i][1] + shapeB_Offset[1];

			/*console.log('gradient: ' + gradient, 'gradient_i: ' + gradient_i, 'shapeB_X1: ' + shapeB_X1, 'shapeB_X2: ' + shapeB_X2, 'diffA_x: ' + diffA_x, 'diffB_x: ' + diffB_x, 'diff_x: ' + diffA_x * diffB_x, 'diffA_y: ' + diffA_y, 'diffB_y: ' + diffB_y, 'diff_y: ' + diffA_y * diffB_y);
			console.log('shapeB_Y1: ' + shapeB_Y1, 'shapeB_Y2: ' + shapeB_Y2);
			console.log('c: ' + c, 'c_i: ' + c_i);*/

			if(Math.abs(gradient_i) > 0.00001 && Math.abs(gradient_i) < 10000000){ //general case with a moderate gradient
				if(diffA_x * diffB_x <= 0.00001 || diffA_y * diffB_y <= 0.00001){ //checks to see if the point of intersection lies on the side of the shape currently being checked
					intersection.push({
							intersection_x: x,
							intersection_y: y,
							gradient: gradient_i,
							sideOnB: {
								first:[shapeB_X1, shapeB_Y1],
								second:[shapeB_X2, shapeB_Y2]
							}
						});
					}
			}else if(Math.abs(gradient_i) < 0.00001){ //gradients that are almost parallel to the x-axis
				if(diffA_x * diffB_x <= 0.00001){ //checks to see if the point of intersection lies on the side of the shape currently being checked
					intersection.push({
							intersection_x: x,
							intersection_y: y,
							gradient: gradient_i,
							sideOnB: {
								first:[shapeB_X1, shapeB_Y1],
								second:[shapeB_X2, shapeB_Y2]
							}
						});
					}
			}else if(Math.abs(1/gradient_i) < 0.00001){ //gradients that are almost parallel to the y-axis
				if(diffA_y * diffB_y <= 0.00001){ //checks to see if the point of intersection lies on the side of the shape currently being checked
					intersection.push({
							intersection_x: x,
							intersection_y: y,
							gradient: gradient_i,
							sideOnB: {
								first:[shapeB_X1, shapeB_Y1],
								second:[shapeB_X2, shapeB_Y2]
							}
						});
					}
				}
			}
		}

	var closestPoint1 = [];
	var closestPoint0 = [];
	var closestIndex;

	for(var n = 0; n < intersection.length; n++){
		//console.log('intersection.length: ', intersection.length);
		var vertexDistanceVector = [intersection[n].intersection_x - collidingVertex[0], intersection[n].intersection_y - collidingVertex[1]]; //distance vector between the colliding vertex and the intersection point
		var _velocity = distance(velocity[0], velocity[1]); // magnitude of the velocity vector
		var _vertexDistance = distance(vertexDistanceVector[0], vertexDistanceVector[1]);
		closestPoint1.push(_vertexDistance);
		closestPoint0.push(_vertexDistance);
		}

		closestPoint0.sort(function(a, b){return a-b});

	for(var k = 0; k < intersection.length; k++){
		if(closestPoint0[0] === closestPoint1[k]){
			closestIndex = k;
			var sideOnBMidPoint = []; // mid-point of side B
			sideOnBMidPoint[0] = (intersection[k].sideOnB.first[0] + intersection[k].sideOnB.second[0]) / 2;
			sideOnBMidPoint[1] = (intersection[k].sideOnB.first[1] + intersection[k].sideOnB.second[1]) / 2;


			var normal = normalVector(intersection[k].gradient, velocity, sideOnBMidPoint, shapeB, shapeB_Offset[0], shapeB_Offset[1]);
			//var normal = normalVector(intersection[k].gradient, velocity, shapeB_Offset, shapeB, shapeB_Offset[0], shapeB_Offset[1]);
			unitNormal = [normal[0], normal[1]];
			_collisionData = {
				'unitNormal': unitNormal,
				'collision_Data': {
						'x': intersection[k].intersection_x,
						'y': intersection[k].intersection_y,
						'gradient': intersection[k].gradient,
						'sideOnB': intersection[k].sideOnB,
						'shapeA' : shapeA,
						'shapeB' : shapeB,
						'shapeACenter': shapeA_Offset,
						'shapeBCenter': shapeB_Offset,
						'velocity': velocity
					},
						'isColInternal': normal[2]
					};
					break;
				}
			}
	return _collisionData;
}
/***** New File *****//*function loadDatabase(scene){
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
		
		
		
		
		deleteButton.addEventListener('click', function(){
			deleteData(userID);
		}, false);
		
		updateButton.addEventListener('click', function(){
			editRecord(userID);
		}, false);
		
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
})();*/