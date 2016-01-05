var velocity_x = document.getElementById('vx');
var velocity_y = document.getElementById('vy');
var v_angular = document.getElementById('v_angular');
var frame_rate = document.getElementById('frame_rate');
var applySettings = document.getElementById('applySettings');


var displaySettings = function(){
	var f_rate = Number(frame_rate.value) || 100;
	var x = Number(velocity_x.value);
	var y = Number(velocity_y.value);
	var ang_v = Number(v_angular.value);
	
	if(selectedShape[0]){
		selectedShape[0].velocity = [x, y];	
		selectedShape[0].angularVelocity = ang_v;
		clearInterval(playScenes);
		setInterval(animator, 1000 / f_rate);
		//frame_Rate = f_rate;
		//alert(frame_Rate);
	}
}

applySettings.addEventListener('click', displaySettings);