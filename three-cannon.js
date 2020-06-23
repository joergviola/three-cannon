
function initWorld () {
	world = new CANNON.World();
	world.gravity.set(0, -10, 0);
}


function initScene () {
	scene = new THREE.Scene();
	camera1 = new THREE.PerspectiveCamera(75, window.innerWidth/2/window.innerHeight, 10, 1000);
	renderer1 = new THREE.WebGLRenderer({
		// alpha:true,
		antialias:true,
		gammaOutput: true,
		gammaFactor: 2.2
	});
	renderer1.setSize(window.innerWidth/2, window.innerHeight);
	document.body.appendChild(renderer1.domElement);
	camera1.position.set(0, 10, 10);
	renderer1.shadowMap.enabled = true;
	renderer1.shadowMapSoft = true;

	camera2 = new THREE.PerspectiveCamera(75, window.innerWidth/2/window.innerHeight, 10, 1000);
	renderer2 = new THREE.WebGLRenderer({
		// alpha:true,
		antialias:true,
		gammaOutput: true,
		gammaFactor: 2.2
	});
	renderer2.setSize(window.innerWidth/2, window.innerHeight);
	document.body.appendChild(renderer2.domElement);
	camera2.position.set(0, 10, 10);
	renderer2.shadowMap.enabled = true;
	renderer2.shadowMapSoft = true;


	control = new THREE.OrbitControls(camera1, renderer1.domElement);
	control.enablePan = false


	lights[0] = new THREE.AmbientLight(0xFFFFFF);
	lights[1] = new THREE.SpotLight(0xFFFFFF);
	lights[1].position.set(20, 30, 20);
	lights[1].target.position.set(0, 0, 0);
	lights[1].castShadow = true;
	lights[1].shadow.mapSize = new THREE.Vector2(1024, 1024);
	scene.add(lights[0], lights[1]);

	scene.fog = new THREE.FogExp2(0x000000, 0.01);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
}

function Obj3d (obj, shape, geometry) {
	this.shape = shape;
	this.geometry = geometry;
	this.body = new CANNON.Body({
		position:obj.position || {x:0, y:0, z:0},
		mass:obj.mass || 0,
		shape:this.shape
	});
	this.mesh = new THREE.Mesh(this.geometry, obj.material || new THREE.MeshNormalMaterial({side:THREE.DoubleSide}));
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	world.add(this.body);
	if (obj.parent) obj.parent.add(this.mesh);
	else scene.add(this.mesh);
	this.update = function () {
		this.mesh.position.copy(this.body.position);
		this.mesh.quaternion.copy(this.body.quaternion);
	}
	this.update();
	if (obj.mass) objAry.push(this);
	if (obj.name) this.mesh.name = obj.name;
}

function Sphere (obj) {
	this.shape = new CANNON.Sphere(obj.radius);
	this.geometry = new THREE.SphereGeometry(obj.radius, 64, 64);
	Obj3d.call(this, obj, this.shape, this.geometry);
}

function Box (obj) {
	this.shape = new CANNON.Box(new CANNON.Vec3(obj.size.x/2, obj.size.y/2, obj.size.z/2));
	this.geometry = new THREE.BoxGeometry(obj.size.x, obj.size.y, obj.size.z);
	Obj3d.call(this, obj, this.shape, this.geometry);
}

function Plane (obj) {
	this.shape = new CANNON.Plane();
	this.geometry = new THREE.PlaneGeometry(obj.size.x, obj.size.y);
	Obj3d.call(this, obj, this.shape, this.geometry);
}

function Floor (obj) {
	obj.size = {x:1000, y:1000};
	obj.name = 'floor';
	Plane.call(this, obj);
	this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
	this.update();
}
// why? only use when .prototype was called
// Floor.prototype = Object.create(Plane.prototype);
// Floor.prototype.constructor = Floor;
