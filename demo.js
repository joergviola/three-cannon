var world, timestep = 1/60;
var scene, camera, renderer, control, raycaster, mouse, lights=[];
var objAry = [];

initWorld();
initScene();
render();

var material = new THREE.MeshPhongMaterial({
	color: 0x156289,
	emissive: 0x072534,
	side: THREE.DoubleSide,
	shading: THREE.FlatShading
});

var floor = new Floor({
	material:material
});

var boxMaterial = new THREE.MeshPhongMaterial({
	color: 0xff5252
});

let boxHeight = 10
let boxWidth = 60
let boxLength = 100


var box = new THREE.Object3D();
box.name = 'box';
var front = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth, y:boxHeight, z: 2},
	position: {x:1, y:2, z:boxLength/2},
	material: boxMaterial
});
var back = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth, y:boxHeight, z: 2},
	position: {x:-1, y:2, z:-boxLength/2},
	material: boxMaterial
});
var left = new Box({
	parent: box,
	mass: 0,
	size: {x:2, y:boxHeight, z: boxLength},
	position: {x:-boxWidth/2, y:2, z:1},
	material: boxMaterial
});
var right = new Box({
	parent: box,
	mass: 0,
	size: {x:2, y:boxHeight, z: boxLength},
	position: {x:boxWidth/2, y:2, z:-1},
	material: boxMaterial
});
var bottom = new Box({
	parent: box,
	mass: 0,
	size: {x:boxWidth+2, y:2, z:boxLength+2},
	position: {x:0, y:1, z:0},
	material: boxMaterial
});

lights[1].position.set(0, 200, 0);
camera.position.set(5, 50, 10);

var balls = new THREE.Object3D();
var cubes = new THREE.Object3D();
scene.add(balls, cubes, box);

let ballRadius = 0.5

var ball = new Sphere({
	parent:balls,
	mass:1,
	radius:ballRadius,
	position:{x:0, y:2 + ballRadius/2, z:0},
	material:material
});
var player1 = new Sphere({
	parent:balls,
	mass:100,
	radius:1,
	position:{x:0, y:3, z:-boxLength/2+10},
	material:material
});
player1.body.linearDamping = 0.95

var player2 = new Sphere({
	parent:balls,
	mass:100,
	radius:1,
	position:{x:0, y:3, z:boxLength/2-10},
	material:material
});

window.addEventListener('keydown', function (e) {
	if(e.key=="ArrowUp") {
		player1.body.velocity.z = 30
	}
	if(e.key=="ArrowDown") {
		player1.body.velocity.z = -30
	}
	if(e.key=="ArrowLeft") {
		player1.body.velocity.x = 30
	}
	if(e.key=="ArrowRight") {
		player1.body.velocity.x = -30
	}
})

window.addEventListener('keyup', function (e) {
	if(e.key=="ArrowUp") {
		player1.body.velocity.z = 0
	}
	if(e.key=="ArrowDown") {
		player1.body.velocity.z = 0
	}
	if(e.key=="ArrowLeft") {
		player1.body.velocity.x = 0
	}
	if(e.key=="ArrowRight") {
		player1.body.velocity.x = 0
	}
})

