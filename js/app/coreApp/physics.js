/**
	isPointInShape: takes a point and uses the in-built canvas function isPointInPath to
	check if that point is within a shape
**/

function isPointInShape(point, shape, x, y){
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
	sortRange: takes an a array of 2 number and returns a numerically sorted version
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
	xyRange: takes a 2 dimensional array which represents 2 lines and returns another
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
	defineLine: takes a line and finds the formular of the equation that desrcribe the line
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
	Examples: findIntersectionPoint([[1, 6], [3, 1]], [[1, 2], [3, 4]]) => [2.14, 3.14, true]	
			  findIntersectionPoint([[1, 6], [2, 5]], [[1, 2], [3, 4]]) => [3, 4, false]
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
	intersectingLines: takes a 2 2-dimensional arrays which represents 2 lines and a boolean and returns
	an object with the following format { intersecting: true, intersectionPoint: [x, y] }
	the "intersecting" property tells us whether or not the point of intersection is on the line segment
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

/** Horizontal line crossing vertica line **/
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
			if(physics && dragging && shapeSelection.shapes[key][2][i].selected){
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