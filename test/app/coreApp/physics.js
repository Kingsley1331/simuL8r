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

var obj = {
	sortRange: sortRange
};

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
