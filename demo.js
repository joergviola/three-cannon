var world, timestep = 1/60;
var scene, camera1, renderer1, control, raycaster, mouse, lights=[], ball, player1, player2;
var objAry = [];

var textureLoader = new THREE.TextureLoader();

var ballTexture = textureLoader.load('img/Football.jpg');
var p1Texture = textureLoader.load('img/p1.jpeg');


initWorld();
initScene();

var playerMaterial = new THREE.MeshPhongMaterial({
	color: 0xFFFFFF,
	//emissive: 0x072534,
	side: THREE.DoubleSide,
	shading: THREE.FlatShading,
	friction: 1000,
	map: p1Texture,
});

var groundMaterial = new THREE.MeshPhongMaterial({
	color: 0x226655,
	//emissive: 0x072534,
	side: THREE.DoubleSide,
	shading: THREE.FlatShading,
	friction: 1000,
});

var ballMaterial = new THREE.MeshPhongMaterial({
	color: 0xFFFFFF,
//	emissive: 0xAAAAAA,
	side: THREE.DoubleSide,
	map: ballTexture,
	restitution: 10,
});


// var ground_ground_cm = new CANNON.ContactMaterial(material, groundMaterial, {
// 	friction: 0.6,
// 	restitution: 0,
// 	contactEquationStiffness: 1e8,
// 	contactEquationRelaxation: 3,
// 	frictionEquationStiffness: 1e8,
// 	frictionEquationRegularizationTime: 3,
// });
// world.addContactMaterial(ground_ground_cm);

var floor = new Floor({
	material:groundMaterial
});

var boxMaterial = new THREE.MeshPhongMaterial({
	color: 0xff5252,
});


var ball_ground_cm = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
	friction: 0.01,
	restitution: 0.9,
	contactEquationStiffness: 1e13,
	contactEquationRelaxation: 3,
	frictionEquationStiffness: 1e12,
	frictionEquationRegularizationTime: 3,
});
world.addContactMaterial(ball_ground_cm);

var ball_box_cm = new CANNON.ContactMaterial(ballMaterial, boxMaterial, {
	friction: 0.01,
	restitution: 0.9,
	contactEquationStiffness: 1e13,
	contactEquationRelaxation: 3,
	frictionEquationStiffness: 1e12,
	frictionEquationRegularizationTime: 3,
});
world.addContactMaterial(ball_box_cm);

var player_box_cm = new CANNON.ContactMaterial(playerMaterial, boxMaterial, {
	friction: 0.9,
	restitution: 0.1,
	contactEquationStiffness: 1e13,
	contactEquationRelaxation: 3,
	frictionEquationStiffness: 1e12,
	frictionEquationRegularizationTime: 3,
});
world.addContactMaterial(player_box_cm);



let boxHeight = 10
let boxWidth = 60
let boxLength = 100
let goalWidth = 10

var box = new THREE.Object3D();
box.name = 'box';
var frontL = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth/2-goalWidth/2, y:boxHeight, z: 2},
	position: {x:boxWidth/4+3.5, y:boxHeight/2, z:boxLength/2},
	material: boxMaterial
});
var frontR = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth/2-goalWidth/2, y:boxHeight, z: 2},
	position: {x:-boxWidth/4-3.5, y:boxHeight/2, z:boxLength/2},
	material: boxMaterial
});
var backL = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth/2-goalWidth/2, y:boxHeight, z: 2},
	position: {x:boxWidth/4+3.5, y:boxHeight/2, z:-boxLength/2},
	material: boxMaterial
});
var backR = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth/2-goalWidth/2, y:boxHeight, z: 2},
	position: {x:-boxWidth/4-3.5, y:boxHeight/2, z:-boxLength/2},
	material: boxMaterial
});
var left = new Box({
	parent: box,
	mass: 0,
	size: {x:2, y:boxHeight, z: boxLength},
	position: {x:-boxWidth/2, y:boxHeight/2, z:1},
	material: boxMaterial
});
var right = new Box({
	parent: box,
	mass: 0,
	size: {x:2, y:boxHeight, z: boxLength},
	position: {x:boxWidth/2, y:boxHeight/2, z:-1},
	material: boxMaterial
});
var bottom = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth-2, y:2, z:boxLength-2},
	position: {x:0, y:1, z:0},
	material: groundMaterial
});
bottom.body.material = groundMaterial

lights[1].position.set(0, 200, 0);

var balls = new THREE.Object3D();
var cubes = new THREE.Object3D();
scene.add(balls, cubes, box);

let ballRadius = 0.5

ball = new Sphere({
	parent:balls,
	mass:1,
	radius:ballRadius,
	position:{x:0, y:8, z:0},
	material:ballMaterial
});
ball.body.material = ballMaterial

player1 = new Sphere({
	parent:balls,
	mass:1000,
	radius:1,
	position:{x:0, y:3, z:-boxLength/2+10},
	material:playerMaterial,
});
player1.body.material = playerMaterial
player1.body.updateMassProperties()
var axis = new CANNON.Vec3(0,1,0);
var angle = -Math.PI / 2;
player1.body.quaternion.setFromAxisAngle(axis, angle);
player1.body.fixedRotation = true

player2 = new Sphere({
	parent:balls,
	mass:1000,
	radius:1,
	position:{x:0, y:3, z:boxLength/2-10},
	material:playerMaterial,
	state: { velocity: {} }
});
player2.body.material = playerMaterial
player2.body.updateMassProperties()
var axis = new CANNON.Vec3(0,1,0);
var angle = Math.PI / 2;
player2.body.quaternion.setFromAxisAngle(axis, angle);
player2.body.fixedRotation = true

var state1 = { velocity: {}, force: { up: 0 } }
var state2 = { velocity: {}, force: { up: 0 } }

var velocity = 25
var force = 400000

window.addEventListener('keydown', function (e) {
	if(e.key=="ArrowUp") {
		state1.velocity.forward = velocity
	}
	if(e.key=="ArrowDown") {
		state1.velocity.forward = -velocity
	}
	if(e.key=="ArrowLeft") {
		state1.velocity.left = velocity
	}
	if(e.key=="ArrowRight") {
		state1.velocity.left = -velocity
	}
	if(e.key=="p") {
		state1.force.up = force
	}

	if(e.key=="w") {
		state2.velocity.forward = -velocity
	}
	if(e.key=="s") {
		state2.velocity.forward = velocity
	}
	if(e.key=="a") {
		state2.velocity.left = -velocity
	}
	if(e.key=="d") {
		state2.velocity.left = velocity
	}
	if(e.key==" ") {
		state2.force.up = force
	}
})

window.addEventListener('keyup', function (e) {
	if(e.key=="ArrowUp") {
		state1.velocity.forward = 0
	}
	if(e.key=="ArrowDown") {
		state1.velocity.forward = 0
	}
	if(e.key=="ArrowLeft") {
		state1.velocity.left = 0
	}
	if(e.key=="ArrowRight") {
		state1.velocity.left = 0
	}

	if(e.key=="w") {
		state2.velocity.forward = 0
	}
	if(e.key=="s") {
		state2.velocity.forward = 0
	}
	if(e.key=="a") {
		state2.velocity.left = 0
	}
	if(e.key=="d") {
		state2.velocity.left = 0
	}
})

function render () {
	requestAnimationFrame(render);

	world.step(timestep);

	for (var i = objAry.length - 1; i >= 0; i--) {
		objAry[i].update();
	}

	control.update();

	let behind = 15
	let above = 8

	var dir1 = ball.mesh.position.clone().sub(player1.mesh.position)
	var dir2 = ball.mesh.position.clone().sub(player2.mesh.position)

	var forward1 = dir1.clone().setLength(state1.velocity.forward)
	var left1 = dir1.clone().setLength(state1.velocity.left)

	var forward2 = dir2.clone().setLength(state2.velocity.forward)
	var left2 = dir2.clone().setLength(state2.velocity.left)
	

	player1.body.velocity.x = forward1.x+left1.z
	player1.body.velocity.z = forward1.z-left1.x

	player2.body.velocity.x = -forward2.x-left2.z
	player2.body.velocity.z = -forward2.z+left2.x

	player1.body.force.y = state1.force.up
	state1.force.up = 0

	player2.body.force.y = state2.force.up
	state2.force.up = 0
	
	let cam1 = dir1.setLength(-behind).add(player1.mesh.position);
	let cam2 = dir2.setLength(-behind).add(player2.mesh.position);
	camera1.position.set(cam1.x, above, cam1.z);
	camera2.position.set(cam2.x, above, cam2.z);

	camera1.lookAt(player1.mesh.position)
	camera2.lookAt(player2.mesh.position)

	renderer1.render(scene, camera1);
	renderer2.render(scene, camera2);
}

render();


