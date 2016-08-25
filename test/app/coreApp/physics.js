var expect = require('chai').expect;

function sortRange(arr) {
	if(arr[0] > arr[1]) {
		return [arr[1], arr[0]];
	} else if(arr[0] < arr[1]) {
		return [arr[0], arr[1]];
	} else {
		return arr;
	}
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


describe('takes an a array of 2 numbers and returns a numerically sorted version', function(){
  it('should be sorted', function(){
    expect(sortRange([5, 3])).to.deep.equal([3, 5]);
  });
});

describe('takes 2 numerically sorted arrays and checks to see if their values overlap', function(){
  it('should return false', function(){
    expect(overlap([1, 3], [4, 7])).to.equal(false);
  });

  it('should return true', function(){
    expect(overlap([1, 3], [2, 7])).to.equal(true);
  });

});
