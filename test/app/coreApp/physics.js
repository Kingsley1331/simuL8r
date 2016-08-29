var expect = require('chai').expect;
var sinon = require("sinon");

function sortRange(arr) {
	if(arr[0] > arr[1]) {
		return [arr[1], arr[0]];
	} else if(arr[0] < arr[1]) {
		return [arr[0], arr[1]];
	} else {
		return arr;
	}
}

var obj = {
	sortRange: sortRange
};

function xyRange(arr){
	var xRange_a = sortRange([arr[0][0], arr[1][0]]);
	var yRange_a = sortRange([arr[0][1], arr[1][1]]);
	return [xRange_a, yRange_a];
}

function overlap(arr1, arr2){ //arr1 and arr2 are sorted arrays
	if(arr1[0] > arr2[1]) {
		return false;
	}else if(arr1[1] < arr2[0]){
		return false;
	}else{
		return true;
	}
}

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

function intersectingLines(arr1, arr2, bool){
	if(bool === true){
		return findIntersectionPoint(arr1, arr2);
	}else if(bool === false){
		return intersect(arr1, arr2);
	}
}

function distanceFromLine(point, line){
	var lineGradient = defineLine(line).gradient;
	var perpLineGradient = ( -1 / lineGradient );
	var newPoint = [point[0] + 1, point[1] + perpLineGradient];
	var newLine = [point, newPoint];
	var intersectionPoint = findIntersectionPoint(line, newLine).intersectionPoint;
	var pointDistance = distance(intersectionPoint[0] - point[0], intersectionPoint[1] - point[1]);
	return pointDistance;
}

function distance(x,y){
	return Math.sqrt(x*x + y*y);
}

describe('sortRange: takes an a array of 2 numbers and returns a numerically sorted version', function(){
  it('should be sorted', function(){
    expect(sortRange([5, 3])).to.deep.equal([3, 5]);
  });

	it('should be called with [5, 3]', function(){
		sinon.spy(sortRange);
		function tester2(){
			  expect(sortRange.withArgs[5, 3]).to.be.true;
				sortRange([5, 3]);
				sortRange.restore();
				};
		});

		it('should be called once', function(){
			sinon.spy(sortRange);
			function tester2(){
				  expect(sortRange.calledOnce.to.be.true);
					sortRange([5, 3]);
					sortRange.restore();
			}
  	});

		it('should be sorted as [4, 5]', function(){
			sinon.stub(obj, 'sortRange').returns([4, 5]);
	  	expect(obj.sortRange([5, 3])).to.deep.equal([4, 5]); // obj.sortRange returns [4, 5] instead of [3, 5] because its been stubbed with [4, 5]
			obj.sortRange.restore();
	  });

});

describe('xyRange: takes a 2 dimensional array which represents a line and returns another 2 dimensional array with the x and y coordinates sorted numerically and grouped together', function(){
  it('', function(){
    expect(xyRange([[1, 2], [3, 4]])).to.deep.equal([[1, 3], [2, 4]]);
  });
});


describe('overlap: takes 2 numerically sorted arrays and checks to see if their values overlap', function(){
  it('should return false', function(){
    expect(overlap([1, 3], [4, 7])).to.equal(false);
  });

  it('should return true', function(){
    expect(overlap([1, 3], [2, 7])).to.equal(true);
  });

});

describe('defineLine: takes a line and finds the formula of the equation that desrcribe the line by calculating its gradient and y-intercept.', function(){
  it('should return equation description', function(){
    expect(defineLine([[0, 0], [4, 8]])).to.deep.equal({gradient: 2, yIntercept: 0});
  });
});


describe('findIntersectionPoint: takes 2 2-dimensional arrays which represent 2 line segments, it finds the equation of the lines in terms of y = mx + c', function(){
  it('should return the point of intersection and intersecting => true', function(){
		expect(findIntersectionPoint([[1, 6], [3, 1]], [[1, 2], [3, 4]])).to.deep.equal({intersecting: true, intersectionPoint:[ 2.142857142857143, 3.1428571428571432]});
  });
	it('should return the point of intersection and intersecting => false', function(){
		expect(findIntersectionPoint([[1, 6], [2, 5]], [[1, 2], [3, 4]])).to.deep.equal({intersecting: false, intersectionPoint:[ 3, 4]});
  });
});

describe('intersect: takes 2 2-dimensional arrays which represent 2 line segments, it finds the equation of the lines in terms of y = mx + c', function(){
  it('should return the point of intersection and intersecting => true', function(){
		expect(intersect([[1, 6], [3, 1]], [[1, 2], [3, 4]])).to.deep.equal({intersecting: true, intersectionPoint:[ 2.142857142857143, 3.1428571428571432]});
  });
	it('should return the point of intersection and intersecting => false', function(){
		expect(intersect([[1, 6], [2, 5]], [[1, 2], [3, 4]])).to.deep.equal({intersecting: false, intersectionPoint:[ null, null]});
  });
});


describe('intersectingLines takes 2 2-dimensional arrays (which represents 2 lines) and a boolean, it returns an object with the following format { intersecting: true, intersectionPoint: [x, y] }', function(){
  it('should return the point of intersection and intersecting => true', function(){
		expect(intersectingLines([[1, 6], [2, 5]], [[1, 2], [3, 4]], false)).to.deep.equal({intersecting: false, intersectionPoint:[ null, null]});
  });
	it('should return the point of intersection and intersecting => false', function(){
		expect(intersectingLines([[1, 6], [2, 5]], [[1, 2], [3, 4]], true)).to.deep.equal({intersecting: false, intersectionPoint: [3, 4]});
  });
});

describe('distanceFromLine: takes a line and finds the formula of the equation that desrcribe the line by calculating its gradient and y-intercept.', function(){
  it('should return equation description', function(){
    expect(distanceFromLine([0, 2], [[0, 0], [2, 2]]) ).to.equal(1.4142135623730951);
  });
});
