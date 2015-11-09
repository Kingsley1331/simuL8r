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
			shapeSelection.shapes[key][2][i].preCollision = false;
			//shapeSelection.shapes[key][2][i].collision = false;
			for(unit in shapeSelection.shapes){
				for(var j = 0; j < shapeSelection.shapes[unit][2].length; j++){
					if(!(i == j && key == unit)){
						if(distance(shapeSelection.shapes[key][2][i].X - shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[key][2][i].Y - shapeSelection.shapes[unit][2][j].Y) < shapeSelection.shapes[key][2][i].setOuterRadius() + shapeSelection.shapes[unit][2][j].setOuterRadius() ||
							unit == 'wall' && j == 0 && shapeSelection.shapes[key][2][i].X < shapeSelection.shapes[key][2][i].setOuterRadius() ||
							unit == 'wall' && j == 1 && shapeSelection.shapes[key][2][i].X + shapeSelection.shapes[key][2][i].setOuterRadius() > canvas.width ||
							unit == 'wall' && j == 2 && shapeSelection.shapes[key][2][i].Y + shapeSelection.shapes[key][2][i].setOuterRadius() > canvas.height ||
							unit == 'wall' && j == 3 && shapeSelection.shapes[key][2][i].Y < shapeSelection.shapes[key][2][i].setOuterRadius() + 50){
							
							shapeSelection.shapes[key][2][i].preCollision = true;

								for(var k = 0; k < shapeSelection.shapes[key][2][i].vertices.length; k++){ // check each vertex of shape A to see if it's in shape B
									bufferCtx.beginPath();
									bufferCtx.moveTo(shapeSelection.shapes[unit][2][j].vertices[0][0] + shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].vertices[0][1] + shapeSelection.shapes[unit][2][j].Y);
									for(var m = 0; m < shapeSelection.shapes[unit][2][j].vertices.length; m++){ // check shape B
										bufferCtx.lineTo(shapeSelection.shapes[unit][2][j].vertices[m][0] + shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].vertices[m][1] + shapeSelection.shapes[unit][2][j].Y);
									}
									if(bufferCtx.isPointInPath(shapeSelection.shapes[key][2][i].vertices[k][0] + shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].vertices[k][1] + shapeSelection.shapes[key][2][i].Y)){
										
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

										collision_Data = collisionData([collisionPointA_x + shapeSelection.shapes[key][2][i].X, collisionPointA_y + shapeSelection.shapes[key][2][i].Y], [colVelocityAB_x, colVelocityAB_y], shapeSelection.shapes[key][2][i].vertices, [shapeSelection.shapes[key][2][i].X, shapeSelection.shapes[key][2][i].Y], shapeSelection.shapes[unit][2][j].vertices, [shapeSelection.shapes[unit][2][j].X, shapeSelection.shapes[unit][2][j].Y], [rot_x, rot_y]);
										
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

											shapeSelection.shapes[key][2][i].velocity[0] += velocityChangeA_x;
											shapeSelection.shapes[key][2][i].velocity[1] += velocityChangeA_y;
											
											shapeSelection.shapes[unit][2][j].velocity[0] += velocityChangeB_x;
											shapeSelection.shapes[unit][2][j].velocity[1] += velocityChangeB_y;
											
											shapeSelection.shapes[key][2][i].angularVelocity += angularVelocityChangeA;
											shapeSelection.shapes[unit][2][j].angularVelocity += angularVelocityChangeB;
											
										//Friction: subtract a percentage of the velocity
										shapeSelection.shapes[key][2][i].velocity[0] -= velocityAB_x/20;
										shapeSelection.shapes[key][2][i].velocity[1] -= velocityAB_y/20;
										
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

							}
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
										
										if(penDepth <= 0.01 && key != 'wall'){
											shapeSelection.shapes[key][2][i].velocity[0] = 0; //Ideally relative velocity should be used here instead of absolute velocity
											shapeSelection.shapes[key][2][i].velocity[1] = 0;
										}else{
											shapeSelection.shapes[key][2][i].gravity = true;
										}
										
										var perpPointX = collisionPointA_x + shapeSelection.shapes[key][2][i].X;
										var perpPointY = collisionPointA_y + shapeSelection.shapes[key][2][i].Y;
										
										/***  Colliding Side ***/
										var gradient = collision_Data.collision_Data.gradient;
										sidePointX = collision_Data.collision_Data.x;
										sidePointY = collision_Data.collision_Data.y;
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

										
										if(key != 'wall'){ // this condition is probably redundant
											if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y/normalVector_x) > 1){ // this line of code works but needs to be improved
												shapeSelection.shapes[key][2][i].X += repulsion[0] * penDepth;
											}
											shapeSelection.shapes[key][2][i].Y += repulsion[1] * penDepth;
										}
										
										
										if(penDepth <= 0.01 && unit != 'wall'){
											shapeSelection.shapes[unit][2][j].velocity[0] = 0; // Ideally relative velocity should be used here instead of absolute velocity
											shapeSelection.shapes[unit][2][j].velocity[1] = 0;
										}else{
											shapeSelection.shapes[unit][2][j].gravity = true;
										}
										
										if(unit != 'wall'){
											if(penDepth >= maxDepth * 4 && Math.abs(normalVector_y/normalVector_x) > 1){ // this line of code works but needs to be improved
												shapeSelection.shapes[unit][2][j].X -= repulsion[0] * penDepth;
											}
											shapeSelection.shapes[unit][2][j].Y -= repulsion[1] * penDepth;
										}
										
										/** repulsiveF is just for blueprint**/
										repulsiveF[0] = -repulsion[0] * penDepth;
										repulsiveF[1] = -repulsion[1] * penDepth;	

										
									}
									
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