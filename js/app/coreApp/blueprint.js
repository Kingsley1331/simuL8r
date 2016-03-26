var startPoint = [];
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
