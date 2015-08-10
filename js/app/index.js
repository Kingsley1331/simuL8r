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
var shapeSelection = {
						userID: null,
						isPublic: null, //userID && isPublic
						circle:[false, circleGen, circleArray, 0],
						square:[false, squareGen, squareArray, 1],
						triangle:[false, triangleGen, triangleArray, 2],
						customShape:[false, customShapeGen, customShapeArray, 3],
						pencil:[true, pencilGen, pencilArray, 4],
						curve:[false, curveGen, curveArray, 5],
						wall:[false, wallGen, wallArray, 6]
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
var physicsObject = {throwArray:[]};
var collisionCounter = 0;
var circularArray = [];
//var gravity = 0.1;
var gravity = 0.1;
var restitution = 0.5;
var minBounceVelocity = 5;
var numberOfShapes = 0;
var resolution = 1;
var currentlyReshaping = null; //there must be a better way to this
var massToPixelRatio = 0.01;
var scale = 0.1;

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
}

function circleMaker(){
	var points = 50;
	var radius = 30;
	for(var i = 0; i < points; i++){
		x = radius * Math.cos(i*2*Math.PI/points);
		y = radius * Math.sin(i*2*Math.PI/points);
		circularArray.push([x, y]);
	}
}

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
})

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
})

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



function init(){
	//displayData();
	checkParameters();
	var arrow_keys_handler = function(e) {
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
	window.addEventListener("keydown", arrow_keys_handler, false);

	circleMaker();
	selectPencilStroke();

	pencilCursor();
	if(tipping){tips.style.visibility = 'visible';}

	mousePos = 0;
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	
	
	function setCanvasSize(){
		$(canvas).prop('width', window.innerWidth)
		$(canvas).prop('height', window.innerHeight)
	}
	
	setCanvasSize();
	window.onresize = function(event) {
		/*canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');*/
		//setCanvasSize();
    };
	
	body = document.getElementById('body');
	
	bar = document.getElementById('bar');
	bar.style.width = window.innerWidth + 'px';;
	
	tips = document.getElementById('tips');
	
	bufferCanvas = document.createElement('canvas');
    bufferCtx = bufferCanvas.getContext("2d");
    bufferCtx.canvas.width = context.canvas.width;
    bufferCtx.canvas.height = context.canvas.height;
	
	options();
	locate();
	mouseMove()
	mouseDown();
	mouseUp();
	eraser();
	animate();
	setInterval(animator, 10);
	var wallCollisionRadius = 0;

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
			wallArray[i].Y = 40 - 1000;
			wallArray[i].colour = 'red';
			wallArray[i].setOuterRadius = function(){
												return wallCollisionRadius;
			};
		}
	}
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
	PickColor = document.getElementById('PickColor');
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
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
			if(shapeSelection[key][2][i].selected){
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
	if(shapeSelection.curve.curveArray){ console.log(shapeSelection.curve.curveArray.length);}
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
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic') {
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(shapeSelection[key][2][i].selected && !dragging && !onReshape && !onSlider && !shapeSelection[key][2][i].expand && !shapeSelection[key][2][i].v_expand && !shapeSelection[key][2][i].h_expand){ // remove the expand conditions when the expand box is resized around the shape
					offcenter[0] = shapeSelection[key][2][i].X - mousePos.x;
					offcenter[1] = shapeSelection[key][2][i].Y - mousePos.y;
					dragging = true;
					shapeSelection[key][2][i].dragging = true;
					shapeSelection[key][2][i].onObject = true;
					shapeSelection[key][2][i].locateTouchPoint();
					shapeSelection[key][2][i].velocity = [0, 0];
					if(!pencils) {canvas.style.cursor = cursor_grab;}
				}
			}
		}
	}
}

function selected(){
	select = false;
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				shapeSelection[key][2][i].selected = false; 
				
				bufferCtx.beginPath();
				bufferCtx.moveTo(shapeSelection[key][2][i].vertices[0][0] + shapeSelection[key][2][i].X, shapeSelection[key][2][i].vertices[0][1] + shapeSelection[key][2][i].Y);
				
				for(var j = 0; j < shapeSelection[key][2][i].vertices.length; j++){
					bufferCtx.lineTo(shapeSelection[key][2][i].vertices[j][0] + shapeSelection[key][2][i].X, shapeSelection[key][2][i].vertices[j][1] + shapeSelection[key][2][i].Y);
				}
				if(bufferCtx.isPointInPath(mousePos.x, mousePos.y) && !select){
					if(distance(shapeSelection[key][2][i].slider[0] - mousePos.x, shapeSelection[key][2][i].slider[1] - mousePos.y) >= 10){
						shapeSelection[key][2][i].selected = true;
						select = true;
					}
				}
			}
		}
	}
}

function drop(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic') {
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				dragging = false;
				shapeSelection[key][2][i].dragging = false;
				shapeSelection[key][2][i].onObject = false; 
				if(!pencils) canvas.style.cursor = cursor_drag; 
			}
		}
	}
}


function eraser(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(shapeSelection[key][2][i].selected && deletion){
					shapeSelection[key][2].splice(i,1);
					//canvas.style.cursor = cursor_grab;
				}
			}
		}
	}
}


function reSizer(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic') {
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(shapeSelection[key][2][i].selected && reSize){
				/** make sure that only one object at time can be resized **/
				shapeSelection[key][2][i].expandBox = true;
				for(keys in shapeSelection){
					if(keys != 'userID' && keys != 'isPublic'){
						for(var j = 0; j < shapeSelection[keys][2].length; j++){
							if(key != keys){
								shapeSelection[keys][2][j].expandBox = false;}
							else {
								if(j != i){
									shapeSelection[keys][2][j].expandBox = false;
								}
							}
						}
					}
				}
			} 
					// detects if cursor is over any of the small expansion boxes at the corners
								/** top-left **/
					if((distance(shapeSelection[key][2][i].X - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection[key][2][i].Y - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
								/** bottom-right **/
						distance(shapeSelection[key][2][i].X + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection[key][2][i].Y + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2 ||
								/** top-right **/
						distance(shapeSelection[key][2][i].X + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection[key][2][i].Y - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
								/** bottom-left **/
						distance(shapeSelection[key][2][i].X - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection[key][2][i].Y + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2
					
					)&& shapeSelection[key][2][i].expandBox){
						shapeSelection[key][2][i].expand = true;
						if(!pencils) canvas.style.cursor = cursor_grab;
					}
					
					
					// detects if cursor is over any of the small expansion boxes at the right and left handsides
								/** left **/
					if((distance(shapeSelection[key][2][i].X - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.x, shapeSelection[key][2][i].Y - mousePos.y) <= smallBox/2 ||
								/** right **/
						distance(shapeSelection[key][2][i].X + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.x, shapeSelection[key][2][i].Y - mousePos.y) <= smallBox/2
					
					) && shapeSelection[key][2][i].expandBox){
					if(key == 'customShape' || 'Square' || 'Triangle'/* temporary condition*/){
						shapeSelection[key][2][i].h_expand = true;
						}
						if(!pencils) canvas.style.cursor = cursor_grab;
					}
					
					
					// detects if cursor is over any of the small expansion boxes at the top and bottom sides
								/** top **/
					if((distance(shapeSelection[key][2][i].X - mousePos.x, shapeSelection[key][2][i].Y - shapeSelection[key][2][i].stretchRadius - selectSize - mousePos.y) <= smallBox/2 ||
								/** bottom **/
						distance(shapeSelection[key][2][i].X - mousePos.x, shapeSelection[key][2][i].Y + shapeSelection[key][2][i].stretchRadius + selectSize - mousePos.y) <= smallBox/2
			
					)&& shapeSelection[key][2][i].expandBox){
					if(key == 'customShape' || 'Square' || 'Triangle'/* temporary condition*/){
						shapeSelection[key][2][i].v_expand = true;
						}
						if(!pencils) canvas.style.cursor = cursor_grab;
					}
				}
			}
		}	
	}

function stopResize(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic') {
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				expand = false;
				//if(shapeSelection[key][2][i].v_expand || shapeSelection[key][2][i].h_expand){shapeSelection[key][2][i].stretchRadius = shapeSelection[key][2][i].radius;}
				if(shapeSelection[key][2][i].expand || shapeSelection[key][2][i].v_expand || shapeSelection[key][2][i].h_expand){
					shapeSelection[key][2][i].stretchRadius = shapeSelection[key][2][i].radius;
					shapeSelection[key][2][i].calculateMass(shapeSelection[key][2][i].vertices, shapeSelection[key][2][i].boundingRectangle.width, shapeSelection[key][2][i].boundingRectangle.height, resolution);
				}
				shapeSelection[key][2][i].expand = false;
				shapeSelection[key][2][i].v_expand = false; 
				shapeSelection[key][2][i].h_expand = false; 
				}
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
			shapeSelection[key][2][i].reverseX(vertices)
		break;
		case reversingY:
			shapeSelection[key][2][i].reverseY(vertices)
		break;
		case rotating90:
			shapeSelection[key][2][i].rotate90(vertices)
		break;
		case rotating180:
			shapeSelection[key][2][i].rotate180(vertices)
		break;
	}
}

function rotater(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(shapeSelection[key][2][i].selected && rotate){
					shapeSelection[key][2][i].referencer();
					var vertices = shapeSelection[key][2][i].vertices;
					rotateListSwitch(key, vertices, i);
					if(!shapeSelection[key][2][i].rotationLine){  										//sets the global sliderPosition equal to the objects sliderPosition
						sliderPosition = shapeSelection[key][2][i].sliderPosition; 
					}
				
				shapeSelection[key][2][i].rotationLine = true;
				
				// makes sure that only one object at time can be rotated 
				for(keys in shapeSelection){
					if(keys != 'userID' && keys != 'isPublic'){
						for(var j = 0; j < shapeSelection[keys][2].length; j++){
							if(key != keys){
								shapeSelection[keys][2][j].rotationLine = false;
							}
							else{
								if(j != i){
									shapeSelection[keys][2][j].rotationLine = false;
								}
							}
						}
					}
				}
					} // detects if cursor is hovering over slider
					if(distance(shapeSelection[key][2][i].slider[0] - mousePos.x, shapeSelection[key][2][i].slider[1] - mousePos.y) <= 10){
						onSlider = true;
					}
				}
			}
		}
	}

	
	
function referencer(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(distance(shapeSelection[key][2][i].slider[0] - mousePos.x, shapeSelection[key][2][i].slider[1] - mousePos.y) <= 100000){
					shapeSelection[key][2][i].referencer();
				}
			}
		}
	}
}

/** this function detects whether or not a user has clicked on a vertex **/
function reShaper(){
	if(reShape){
		for(key in shapeSelection){
			if(key != 'userID' && key != 'isPublic'){
				for(var i = 0; i < shapeSelection[key][2].length; i++){
					for(var j = 0; j < shapeSelection[key][2][i].vertices.length; j++){
						shapeSelection[key][2][i].vertices[j][2] = false;
						var Xpoint = shapeSelection[key][2][i].vertices[j][0] + shapeSelection[key][2][i].X;
						var Ypoint = shapeSelection[key][2][i].vertices[j][1] + shapeSelection[key][2][i].Y;
						if(distance(Xpoint - mousePos.x, Ypoint - mousePos.y)< 5){
							shapeSelection[key][2][i].vertices[j][2] = true;
							currentlyReshaping = key;
						}
					}
				}
			}
		}
	}
}


function offReshaper(){
	for(key in shapeSelection){ //Very inefficient! this part of the code gets called 7 times on mouseup
		if(key != 'userID' && key != 'isPublic'){
				var centralDifference = [0,0];
				for(var i = 0; i < shapeSelection[key][2].length; i++){
				/** this section calculates the coordinates of the centroid **/
				shapeSelection[key][2][i].centroid = [0,0]; 
				for(var k = 0; k < shapeSelection[key][2][i].pointsArray.length - 1; k++){
					//if(k == 0){continue;}else{
					shapeSelection[key][2][i].centroid[0] += shapeSelection[key][2][i].X + shapeSelection[key][2][i].vertices[k][0];
					shapeSelection[key][2][i].centroid[1] += shapeSelection[key][2][i].Y + shapeSelection[key][2][i].vertices[k][1];
					//}
				}
				shapeSelection[key][2][i].centroid[0] /= (shapeSelection[key][2][i].pointsArray.length - 1);
				shapeSelection[key][2][i].centroid[1] /= (shapeSelection[key][2][i].pointsArray.length - 1);
			
				// the code below calculates the difference between the centroid and the current position of the center (X,Y)
				centralDifference[0] = shapeSelection[key][2][i].centroid[0] - shapeSelection[key][2][i].X;
				centralDifference[1] = shapeSelection[key][2][i].centroid[1] - shapeSelection[key][2][i].Y;
			
				var rotDifference_x = 0;
				var rotDifference_y = 0;
				
				var Difference_x = centralDifference[0];
				var Difference_y = centralDifference[1];
					
				// this difference is subtracted from the vertices so that they do not move when the X,Y values are eventually updated (by setting them equal to the centroid)
				for(var m = 0; m < shapeSelection[key][2][i].pointsArray.length; m++){
					shapeSelection[key][2][i].vertices[m][0] -= Difference_x;
					shapeSelection[key][2][i].vertices[m][1] -= Difference_y;
				}
				
				/** the shape's X and Y properties are set equal to the centroid **/ 
				//the vertices remain in the same position because the difference has been subtracted from them
				shapeSelection[key][2][i].X = shapeSelection[key][2][i].centroid[0];
				shapeSelection[key][2][i].Y = shapeSelection[key][2][i].centroid[1];
			
				for(var j = 0; j < shapeSelection[key][2][i].vertices.length; j++){
					shapeSelection[key][2][i].vertices[j][2] = false;
					}
					shapeSelection[key][2][i].referencer();
					shapeSelection[key][2][i].findOuterRadius();
					if(currentlyReshaping == key){
						shapeSelection[key][2][i].calculateMass(shapeSelection[key][2][i].vertices, shapeSelection[key][2][i].boundingRectangle.width, shapeSelection[key][2][i].boundingRectangle.height, resolution);
					}
				}
			//}
		}
	}
}

function copyShape(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(copy && copying && shapeSelection[key][2][i].selected){
					copying = false;
					var newShape = {}; // newshape is initialised and all its properties are copied to it from the original shape
					for(var e in shapeSelection[key][2][i]){
						newShape[e] = shapeSelection[key][2][i][e];
					}
					newShape.rotationLine = false;
					newShape.expandBox = false;
					
					//if(key !== 'circle'){
						newShape.vertices = [];
						newShape.referenceVertices = [];
						for(var j = 0; j < shapeSelection[key][2][i].vertices.length; j++){ // this loops ensures that referenceVertices and vertices arrays of the new shape are not simply referencing the original 
							newShape.vertices[j] = shapeSelection[key][2][i].vertices[j];
							newShape.referenceVertices[j] = shapeSelection[key][2][i].referenceVertices[j];
						}
						
						for(var n = 0; n < shapeSelection[key][2][i].pointsArray.length; n++){ //pointsArray must be reset for each copy otherwise it would be fixed for all the descendants of a copied shape
							newShape.pointsArray[n] = [[],[]];
							newShape.pointsArray[n][0] = shapeSelection[key][2][i].X + shapeSelection[key][2][i].vertices[n][0];
							newShape.pointsArray[n][1] = shapeSelection[key][2][i].Y + shapeSelection[key][2][i].vertices[n][1];
						}
						
						newShape.X = 0; // newShape's X and Y coordinates are set to zero so that the centralize function can work properly
						newShape.Y = 0;
						
						var k;
						centralize(newShape, newShape.pointsArray, k);
					//}
						newShape.X = mousePos.x + 5; //places the new copy near where the cursor is
						newShape.Y = mousePos.y + 5;
						if(!copying){shapeSelection[key][2].push(newShape);}
				}
			}
		}
	}
}

function physTest(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(physics && dragging && shapeSelection[key][2][i].selected){
					shapeSelection[key][2][i].angularVelocity = 0;
				}
			}
		}
	}
}

function physMove(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(physics && dragging && shapeSelection[key][2][i].selected){
					physicsObject.throwArray.push([mousePos.x, mousePos.y]);
					var arrayLength = physicsObject.throwArray.length - 1;
					
					if(physicsObject.throwArray.length > 3){
						var velocity_x = (physicsObject.throwArray[arrayLength][0] - physicsObject.throwArray[arrayLength - 1][0]
						+ physicsObject.throwArray[arrayLength - 1][0] - physicsObject.throwArray[arrayLength - 2][0]
						+ physicsObject.throwArray[arrayLength - 2][0] - physicsObject.throwArray[arrayLength - 3][0])/3;
						
						var velocity_y = (physicsObject.throwArray[arrayLength][1] - physicsObject.throwArray[arrayLength - 1][1]
						+ physicsObject.throwArray[arrayLength - 1][1] - physicsObject.throwArray[arrayLength - 2][1]
						+ physicsObject.throwArray[arrayLength - 2][1] - physicsObject.throwArray[arrayLength - 3][1])/3;
						
						shapeSelection[key][2][i].velocity[0] = velocity_x;
						shapeSelection[key][2][i].velocity[1] = velocity_y;

						var TouchDistance_x = shapeSelection[key][2][i].touchPoints[0] - shapeSelection[key][2][i].X;
						var TouchDistance_y = shapeSelection[key][2][i].touchPoints[1] - shapeSelection[key][2][i].Y;
						
						var TouchDistance = [TouchDistance_x, TouchDistance_y]; 
						var gradient = TouchDistance_y/TouchDistance_x;
						var perpendicularVector = [-TouchDistance_x/gradient, -TouchDistance_y/gradient];
						var forceMagnitude = distance(velocity_x, velocity_y);
						
						var angle = angleCalc(perpendicularVector[0], perpendicularVector[1], velocity_x, velocity_y);
						angularVelocity = forceMagnitude * Math.cos(angle);				
						//shapeSelection[key][2][i].angularVelocity = angularVelocity/150;
					}
				}
			}
		}
	}
}


function clearPhysMove(){
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(physics && shapeSelection[key][2][i].selected){
					physicsObject.throwArray = [];
					//shapeSelection[key][2][i].angularVelocity = 0;
				}
			}
		}
	}
}


function collisionDetector(){
if(physics)
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				shapeSelection[key][2][i].preCollision = false;
				//shapeSelection[key][2][i].collision = false;
				for(unit in shapeSelection){
					if(unit != 'userID' && unit != 'isPublic'){
						for(var j = 0; j < shapeSelection[unit][2].length; j++){
							if(!(i == j && key == unit)){
								if(distance(shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X, shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y) < shapeSelection[key][2][i].setOuterRadius() + shapeSelection[unit][2][j].setOuterRadius() ||
									unit == 'wall' && j == 0 && shapeSelection[key][2][i].X < shapeSelection[key][2][i].setOuterRadius() ||
									unit == 'wall' && j == 1 && shapeSelection[key][2][i].X + shapeSelection[key][2][i].setOuterRadius() > canvas.width ||
									unit == 'wall' && j == 2 && shapeSelection[key][2][i].Y + shapeSelection[key][2][i].setOuterRadius() > canvas.height ||
									unit == 'wall' && j == 3 && shapeSelection[key][2][i].Y < shapeSelection[key][2][i].setOuterRadius() + 50){
									
									shapeSelection[key][2][i].preCollision = true;

										for(var k = 0; k < shapeSelection[key][2][i].vertices.length; k++){ // check each vertex of shape A to see if it's in shape B
											bufferCtx.beginPath();
											bufferCtx.moveTo(shapeSelection[unit][2][j].vertices[0][0] + shapeSelection[unit][2][j].X, shapeSelection[unit][2][j].vertices[0][1] + shapeSelection[unit][2][j].Y);
											for(var m = 0; m < shapeSelection[unit][2][j].vertices.length; m++){ // check shape B
												bufferCtx.lineTo(shapeSelection[unit][2][j].vertices[m][0] + shapeSelection[unit][2][j].X, shapeSelection[unit][2][j].vertices[m][1] + shapeSelection[unit][2][j].Y);
											}
											if(bufferCtx.isPointInPath(shapeSelection[key][2][i].vertices[k][0] + shapeSelection[key][2][i].X, shapeSelection[key][2][i].vertices[k][1] + shapeSelection[key][2][i].Y)){
												
												shapeSelection[key][2][i].contactList[0] = shapeSelection[unit][2][j].id;
												//shapeSelection[unit][2][j].contactList[0] = shapeSelection[key][2][i].id;
												
												if(shapeSelection[key][2][i].vertices[k][3].collision === false){
												/*****************************************Body A ***************************************************/
												//finding collision points on A
												var massA = shapeSelection[key][2][i].mass;
												var momentOfInertiaA = shapeSelection[key][2][i].momentOfInertia;
												
												shapeSelection[key][2][i].collisionPoint.x = shapeSelection[key][2][i].vertices[k][0];
												shapeSelection[key][2][i].collisionPoint.y = shapeSelection[key][2][i].vertices[k][1];
												
												collisionPointA_x = shapeSelection[key][2][i].collisionPoint.x;
												collisionPointA_y = shapeSelection[key][2][i].collisionPoint.y;
												
												//calculate the velocity vector of the collision point for shape A relative to the center of mass
												var rotA = rotater2(0, 0, shapeSelection[key][2][i].collisionPoint.x, shapeSelection[key][2][i].collisionPoint.y, shapeSelection[key][2][i].angularVelocity);
												
												//calculate the actual velocity vector of the collision point for shape shapeSelection[key][2][i]
												shapeSelection[key][2][i].collisionPoint.velocity[0] = shapeSelection[key][2][i].velocity[0] + rotA[0];
												shapeSelection[key][2][i].collisionPoint.velocity[1] = shapeSelection[key][2][i].velocity[1] + rotA[1];
												
												var colPointVelA_x = shapeSelection[key][2][i].collisionPoint.velocity[0];
												var colPointVelA_y = shapeSelection[key][2][i].collisionPoint.velocity[1];
												
												
												/***************************************** Body B ***************************************************/
												
												//finding collision points on B
												
												var massB = shapeSelection[unit][2][j].mass;
												var momentOfInertiaB = shapeSelection[unit][2][j].momentOfInertia;
																							  
												shapeSelection[unit][2][j].collisionPoint.x = collisionPointA_x + shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X;
												shapeSelection[unit][2][j].collisionPoint.y = collisionPointA_y + shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y;
												
												var collisionPointB_x = shapeSelection[unit][2][j].collisionPoint.x;
												var collisionPointB_y = shapeSelection[unit][2][j].collisionPoint.y;
												
												//calculate the velocity vector of the collision point for shape B relative to the center of mass
												var rotB = rotater2(0, 0, shapeSelection[unit][2][j].collisionPoint.x, shapeSelection[unit][2][j].collisionPoint.y, shapeSelection[unit][2][j].angularVelocity);
												
												//calculate the actual velocity vector of the collision point for shape shapeSelection[unit][2][j]
												shapeSelection[unit][2][j].collisionPoint.velocity[0] = shapeSelection[unit][2][j].velocity[0] + rotB[0];
												shapeSelection[unit][2][j].collisionPoint.velocity[1] = shapeSelection[unit][2][j].velocity[1] + rotB[1];
												
												var colPointVelB_x = shapeSelection[unit][2][j].collisionPoint.velocity[0];
												var colPointVelB_y = shapeSelection[unit][2][j].collisionPoint.velocity[1];
												
												/******************************************* calculating the impulse *******************************************/
												
												//the difference in the velocities of the collision points
												var colVelocityAB_x = colPointVelA_x - colPointVelB_x;
												var colVelocityAB_y = colPointVelA_y - colPointVelB_y;
												
												var velocityAB_x = shapeSelection[key][2][i].velocity[0] - shapeSelection[unit][2][j].velocity[0];
												var velocityAB_y = shapeSelection[key][2][i].velocity[1] - shapeSelection[unit][2][j].velocity[1] ;
												
												var rot_x = rotA[0];
												var rot_y = rotA[1];

												collision_Data = collisionData([collisionPointA_x + shapeSelection[key][2][i].X, collisionPointA_y + shapeSelection[key][2][i].Y], [colVelocityAB_x, colVelocityAB_y], shapeSelection[key][2][i].vertices, [shapeSelection[key][2][i].X, shapeSelection[key][2][i].Y], shapeSelection[unit][2][j].vertices, [shapeSelection[unit][2][j].X, shapeSelection[unit][2][j].Y], [rot_x, rot_y]);
												
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
												
												velocityChangeA_x = impulse * normalVector_x/massA;
												velocityChangeA_y = impulse * normalVector_y/massA;
												
												velocityChangeB_x = -impulse * normalVector_x/massB;
												velocityChangeB_y = -impulse * normalVector_y/massB;
												
												angularVelocityChangeA = impulse * crossVelocityANormal/momentOfInertiaA;
												angularVelocityChangeB = -impulse * crossVelocityBNormal/momentOfInertiaB;

													shapeSelection[key][2][i].velocity[0] += velocityChangeA_x;
													shapeSelection[key][2][i].velocity[1] += velocityChangeA_y;
													
													shapeSelection[unit][2][j].velocity[0] += velocityChangeB_x;
													shapeSelection[unit][2][j].velocity[1] += velocityChangeB_y;
													
													shapeSelection[key][2][i].angularVelocity += angularVelocityChangeA;
													shapeSelection[unit][2][j].angularVelocity += angularVelocityChangeB;
													
												//Friction: subtract a percentage of the velocity
												shapeSelection[key][2][i].velocity[0] -= velocityAB_x/20;
												shapeSelection[key][2][i].velocity[1] -= velocityAB_y/20;
												
												//Freeze object if its been slowed below a certain velocity due to friction
												var MagVelocityAB = distance(velocityAB_x, velocityAB_y);
												
												//minFrictionVelocity
												if(MagVelocityAB < 0.05){
													shapeSelection[key][2][i].velocity[0] = 0;
													shapeSelection[key][2][i].velocity[1] = 0;
												}

												//move shapes apart immediately after collision to prevent them from sticking
												var factor = 2;
												shapeSelection[key][2][i].X += velocityChangeA_x * factor;
												shapeSelection[key][2][i].Y += velocityChangeA_y * factor;
												
												shapeSelection[unit][2][j].X += velocityChangeB_x * factor;
												shapeSelection[unit][2][j].Y += velocityChangeB_y * factor;

												collisionCounter++;
												shapeSelection[key][2][i].vertices[k][3] = {collision: true};
												
												shapeSelection[unit][2][j].X
												startPoint = collision_Data.collision_Data.sideOnB.first;
												endPoint = collision_Data.collision_Data.sideOnB.second;

									}
											if(key != 'wall'){

												var repulsiveFactor = MagColVelocityAB * 100;
												
												/*if((MagColVelocityAB < 0.01 || MagVelocityA < 0.01 || MagVelocityB < 0.01) && unit != 'wall'){
													repulsiveFactor = 1;
												}*/
												if(MagColVelocityAB < 0.01 && unit != 'wall'){
													repulsiveFactor = 1;
												}
												//var ABdistance = distance(shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X, shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y) * repulsiveFactor*1;
												var ABdistance = distance(shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X, shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y);
												
												/*if(ABdistance < 1){
													ABdistance = 10;
												}*/
												
												var ABdistanceVector = [shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X, shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y];
												//var magABdistanceVector = distance(shapeSelection[key][2][i].X - shapeSelection[unit][2][j].X, shapeSelection[key][2][i].Y - shapeSelection[unit][2][j].Y) * repulsiveFactor;
												//var magABdistanceVector = ABdistance * repulsiveFactor;
												
												var penDepth = distance(collisionPointA_x + shapeSelection[key][2][i].X - collision_Data.collision_Data.x, collisionPointA_y + shapeSelection[key][2][i].Y - collision_Data.collision_Data.y);

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
													console.log('############################################################################################################  velocity of A', shapeSelection[key][2][i].velocity);
													console.log('############################################################################################################  collision_Data.x', collision_Data.collision_Data.x);*/
												//}

												
												/***************************** Getting the objects to rest on each other ****************************/
												
												if(penDepth <= 0.01 && key != 'wall'){
													shapeSelection[key][2][i].velocity[0] = 0; //Ideally relative velocity should be used here instead of absolute velocity
													shapeSelection[key][2][i].velocity[1] = 0;
												}else{
													shapeSelection[key][2][i].gravity = true;
												}
												
												var perpPointX = collisionPointA_x + shapeSelection[key][2][i].X;
												var perpPointY = collisionPointA_y + shapeSelection[key][2][i].Y;
												
												/***  Colliding Side ***/
												var gradient = collision_Data.collision_Data.gradient;
												sidePointX = collision_Data.collision_Data.x;
												sidePointY = collision_Data.collision_Data.y;
												colVelocity = collision_Data.collision_Data.velocity
												
												shapeA = [];
												shapeB = [];
												
													for(var s = 0; s < shapeSelection[key][2][i].vertices.length; s++){
														shapeA[s] = [];
														shapeA[s][0] = shapeSelection[key][2][i].vertices[s][0]; 
														shapeA[s][1] = shapeSelection[key][2][i].vertices[s][1]; 
													}
													for(var s = 0; s < shapeSelection[unit][2][j].vertices.length; s++){	
														shapeB[s] = [];
														shapeB[s][0] = shapeSelection[unit][2][j].vertices[s][0]; 
														shapeB[s][1] = shapeSelection[unit][2][j].vertices[s][1]; 
													}
													
												shapeACenter = collision_Data.collision_Data.shapeACenter;
												shapeBCenter = collision_Data.collision_Data.shapeBCenter;
												
												var sideC = sidePointY - gradient * sidePointX;
												
												/*** The perpendicular line that connects the colliding side and the colliding vertex ***/
												var perpGradient = collision_Data.unitNormal[1]/collision_Data.unitNormal[0];
												var perpC = perpPointY - perpGradient * perpPointX;
												
												var intersectionPointX = (perpC - sideC)/(gradient - perpGradient);
												var intersectionPointY = gradient * intersectionPointX + sideC;

												if(Math.abs(gradient) >= 100){ // if the gradient is very steep use swap the roles of x and y axis in the calculation to get more accurate values for x and y at the point of intersection
													
													/***  Colliding Side ***/
													var swappedGradient = 1 / gradient;
													var swappedSideC = sidePointX - swappedGradient * sidePointY;
													
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
												bufferCtx.moveTo(shapeSelection[unit][2][j].vertices[0][0] + shapeSelection[unit][2][j].X, shapeSelection[unit][2][j].vertices[0][1] + shapeSelection[unit][2][j].Y);
												for(var m = 0; m < shapeSelection[unit][2][j].vertices.length; m++){ // check shape B
													bufferCtx.lineTo(shapeSelection[unit][2][j].vertices[m][0] + shapeSelection[unit][2][j].X, shapeSelection[unit][2][j].vertices[m][1] + shapeSelection[unit][2][j].Y);
												}
												if(bufferCtx.isPointInPath(checkPoint[0], checkPoint[1])){
													onPath = true;
												}
												
		//console.log('##########################################################################################edgeDistance', edgeDistance, checkPointDistance, pointOnB);
												if(onPath == true && checkPointDistance > edgeDistance){
													//penDepth *= -1;
												}

												
												if(key != 'wall'){ // this condition is probably redundant
													if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y/normalVector_x) > 1){ // this line of code works but needs to be improved
														shapeSelection[key][2][i].X += repulsion[0] * penDepth;
													}
													shapeSelection[key][2][i].Y += repulsion[1] * penDepth;
												}
												
												
												if(penDepth <= 0.01 && unit != 'wall'){
													shapeSelection[unit][2][j].velocity[0] = 0; // Ideally relative velocity should be used here instead of absolute velocity
													shapeSelection[unit][2][j].velocity[1] = 0;
												}else{
													shapeSelection[unit][2][j].gravity = true;
												}
												
												if(unit != 'wall'){
													if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y/normalVector_x) > 1){ // this line of code works but needs to be improved
														shapeSelection[unit][2][j].X -= repulsion[0] * penDepth;
													}
													shapeSelection[unit][2][j].Y -= repulsion[1] * penDepth;
												}
												
												/** repulsiveF is just for blueprint**/
												repulsiveF[0] = -repulsion[0] * penDepth;
												repulsiveF[1] = -repulsion[1] * penDepth;	

												
											}
											
										}else{
											shapeSelection[key][2][i].vertices[k][3] = {collision: false};
											shapeSelection[key][2][i].contactList = [];
											}
									}
										
									//check to see if any of the vertices are colliding before setting the collision of the shape
									shapeSelection[key][2][i].collision = false;
									shapeSelection[unit][2][j].collision = false;
									for(var m = 0; m < shapeSelection[key][2][i].vertices.length; m++){
										if(shapeSelection[key][2][i].vertices[m][3].collision){
											shapeSelection[key][2][i].collision = true;
											shapeSelection[unit][2][j].collision = true;
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
	}	
}

function rotateObject(shape, angle){
	for(var i = 0; i < shape.length; i++){
		var rotation = rotater2(0, 0, shape[i][0], shape[i][1], angle);
		shape[i][0] += rotation[0];
		shape[i][1] += rotation[1];
	}
} 

function collisionData(collidingVertex, velocity, shapeA, shapeA_Offset, shapeB, shapeB_Offset, rotationVelocity){
	/*if(distance(velocity[0], velocity[1]) < 0.01){ //this is to help repulsion when the collision velocity is zero or there is no collision
		velocity[0] = (collidingVertex[0] - shapeA_Offset[0])/10;
		velocity[1] = (collidingVertex[1] - shapeA_Offset[1])/10;
	}*/
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
			
			
			var diffA_x = shapeB[i][0] + shapeB_Offset[0] - x; 
			var diffB_x = shapeB[j][0] + shapeB_Offset[0] - x; 
			
			var diffA_y = shapeB[i][1] + shapeB_Offset[1] - y; 
			var diffB_y = shapeB[j][1] + shapeB_Offset[1] - y; 
			
			//console.log('x: ' + x, 'y: ' + y);
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
			
			var normal = normalVector(intersection[k].gradient, velocity, rotationVelocity);
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

function sameDirection(vector1, vector2){
	if(distance(vector1[0] + vector2[0], vector1[1] + vector2[1]) > distance(vector1[0] - vector2[0], vector1[1] - vector2[1])){
		return true;
	}else if(distance(vector1[0] + vector2[0], vector1[1] + vector2[1]) < distance(vector1[0] - vector2[0], vector1[1] - vector2[1])){
		return false;
	}
}


function normalVector(gradient, translationalVelocity, rotationVelocity){
	var isColInternal = false;
	var normalGradient = -1/gradient;
	var theta = Math.atan(normalGradient);
	var _normalVector = [Math.cos(theta), Math.sin(theta)];
												//make sure that the normal vector is pointing outward										
	
	if(sameDirection(translationalVelocity, _normalVector)/* && sameDirection(translationalVelocity, rotationVelocity)*/){
		_normalVector[0] *= -1;
		_normalVector[1] *= -1;
		isColInternal = true;
	}

	return [_normalVector[0], _normalVector[1], isColInternal];
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
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			for(var i = 0; i < shapeSelection[key][2].length; i++){
				if(physics){
					shapeSelection[key][2][i].X += shapeSelection[key][2][i].velocity[0];
					shapeSelection[key][2][i].Y += shapeSelection[key][2][i].velocity[1];
					for(var n = 0; n < shapeSelection[key][2][i].vertices.length; n++){
						var rot = rotater2(0, 0, shapeSelection[key][2][i].vertices[n][0], shapeSelection[key][2][i].vertices[n][1], shapeSelection[key][2][i].angularVelocity);
						shapeSelection[key][2][i].vertices[n][0] += rot[0];
						shapeSelection[key][2][i].vertices[n][1] += rot[1];
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
	this.isAsleep = false;
	this.id = 1;
	this.contactList = [];
	this.gravity = true;
	this.pointsArray = pointsArray;
	this.centroid = [0,0];
	this.vertices = [];
	this.referenceVertices = [];
	this.X = 0;
	this.Y = 0;
	this.mass = 1;
	this.momentOfInertia = this.mass*(side*side + side*side)/12
	this.rotationalKineticEnergy = 0;
	this.translationalKineticEnergy = 0;
	this.velocity = [0,0];
	this.angularVelocity = 0;
	this.radius = 50;
	this.distances = [];
	this.findOuterRadius = function(){
		this.distances = this.vertices.map(function(vertex){
			return distance(vertex[0] + 50, vertex[1] + 50);
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
	this.colour = 'lightblue';
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
	this.mass = 1.7976931348623157E+10308; //infinity
	this.momentOfInertia = 1.7976931348623157E+10308;
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
	
	if(saving){
		image.style.visibility = 'visible';
		
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		// set canvasImg image src to dataURL
		// so it can be saved as an image
		//document.getElementById('canvasImg').src = dataURL;
		image.src = dataURL;
	}
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
	if(!dragging && shapeSelection.circle[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
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
		if(!dragging && shapeSelection.square[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
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
		if(!dragging && shapeSelection.triangle[0] && mousePos.x <= canvas.width - 25 && mousePos.y <= canvas.height - 25 && !onObject){
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

function shapeSelector(){
	shapeSelection.circle[0] = false;
	shapeSelection.square[0] = false;
	shapeSelection.triangle[0] = false;
	deletion = false;
	reSize = false;
	reShape = false; 
	colourChange = false;
	rotate = false;
	shapes = false;
	pencils = false;
	copy = false;
	physics = false;
	
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
	PickColor.style.visibility = 'hidden';
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
	for(key in shapeSelection){
		if(key != 'userID' && key != 'isPublic'){
			if(shapeSelection[key][0]){
				return [shapeSelection[key][1](), shapeSelection[key][2]];
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
	for(colour in colours){
		if(colours[colour][1]){
			return colours[colour][0];
		}
	}
}

wallConfig = {clearWall: false};
	
function clearAll(obj){
	for(e in shapeSelection){ //if(unit != 'userID' && unit != 'isPublic'){
		if(e != 'wall' || e == 'wall' && obj.clearWall && e != 'userID' && e != 'isPublic'){
			var arrayOfShapes = shapeSelection[e][2];
			arrayOfShapes.splice(0, arrayOfShapes.length);
		}
	}
}

/** this function saves simulations to the Mongodb database **/
function loadShapes(sim){
	for(key in sim){
		for(var i = 0; i < sim[key][2].length; i++){ //populate sim with shapes from e.g circleArray
			
			shapeSelection[key][2][i] = {};
			
			if(key == 'circle'){
				var circle = new Circle();
				shapeSelection[key][2][i] = circle;
			}
			if(key == 'square'){
				var square = new Square();
				shapeSelection[key][2][i] = square;
			}
			if(key == 'triangle'){
				var triangle = new Triangle();
				shapeSelection[key][2][i] = triangle;
			}
			if(key == 'customShape'){
				var customShape = new CustomShape();
				shapeSelection[key][2][i] = customShape;
			}
			if(key == 'pencil'){
				var pointsArray = sim[key][2][i].pointsArray;
				var pencil = new Pencil(pointsArray);
				shapeSelection[key][2][i] = pencil;
			}
			
			if(key == 'wall'){
				var wall = new Walls();
				shapeSelection[key][2][i] = wall;
			}
			
			for(prop in sim[key][2][i]){ //populate the ith shape (js object) with properties
				shapeSelection[key][2][i][prop] = sim[key][2][i][prop];
			}
			
			if(key == 'wall'){ // this part was added because mongodb couldn't store the very high(infinity) values
				shapeSelection[key][2][i].mass = 1.7976931348623157E+10308; //infinity
				shapeSelection[key][2][i].momentOfInertia = 1.7976931348623157E+10308;
			}
		}
	}
}