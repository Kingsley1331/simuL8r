var velocity_x = document.getElementById('vx');
var velocity_y = document.getElementById('vy');
var v_angular = document.getElementById('v_angular');
var frame_rate = document.getElementById('frame_rate');
var applySettings = document.getElementById('applySettings');
var fix = document.getElementById('fix');

var displaySettings = function(){
	var f_rate = Number(frame_rate.value) || 100;
	var x = Number(velocity_x.value);
	var y = Number(velocity_y.value);
	var ang_v = Number(v_angular.value);
	var isFixed = fix.checked;
	console.log('isFixed: ', isFixed);
	
	if(selectedShape[0]){
		selectedShape[0].velocity = [x, y];	
		selectedShape[0].angularVelocity = ang_v;
		selectedShape[0].gravity = !isFixed;
		clearFrames();
		startFrames(f_rate);
	}
	if(selectedShape[0] && isFixed){
		selectedShape[0].isFixed = true;
		selectedShape[0].mass = Infinity;
		selectedShape[0].momentOfInertia = Infinity;
		selectedShape[0].velocity = [0, 0];
	}
}

function clearFrames(){
	intervalRunning = false;
	clearInterval(playScenes);
}

function startFrames(frame__rate){
	if(intervalRunning === false){
		intervalRunning = true;
		playScenes = setInterval(animator, 1000 / frame__rate);
	}
}

applySettings.addEventListener('click', displaySettings);