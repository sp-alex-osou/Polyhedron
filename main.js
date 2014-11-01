var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

Math.PHI = (1.0 + Math.sqrt(5)) / 2.0;

var angle1 = 2.0 * Math.atan(Math.PHI); // angle between pentagons
var angle2 = (angle1 + Math.PI) / 2.0; // angle between pentagon and hexagon

var s = 1; // edge length
var a = Math.PI - angle1; // center angle
var b = 2.0 * Math.PI / 5.0;

var x = new Hexagon(s).apothem / Math.sin(a / 2.0);

var r = x + s * 0.5 * Math.sqrt((5 / 2) + (11 / 10) * Math.sqrt(5));

var parent = new THREE.Object3D();
scene.add(parent);

var material = new THREE.MeshLambertMaterial({ 
	// wireframe: true,
	side: THREE.DoubleSide,
});

parent.add(new THREE.Mesh(new Hexagon(s), material));

// create pentagons
var pentagons = [];

addPentagonPair(M4.identity, r, 0);

for (var i = 0; i < 5; ++i) {
	addPentagonPair(M4.mul(M4.makeRotationZ(i * b), M4.makeRotationX(a), M4.makeRotationZ(Math.PI)), r, i + 1);
}

function addPentagonPair(orientation, offset, index) {
	addPentagon(M4.mul(orientation, M4.makeTranslationZ(+offset), M4.makeRotationX(0 * Math.PI)), index);
	addPentagon(M4.mul(orientation, M4.makeTranslationZ(-offset), M4.makeRotationX(1 * Math.PI)), 11 - index);
}

function addPentagon(transform, index) {
	var pentagon = new Pentagon(s);
	pentagon.applyMatrix(transform)
	parent.add(new THREE.Mesh(pentagon, material));
	pentagons[index] = pentagon;
}


// assign neighbors
for (var i = 0; i < 5; ++i) {
	assignNeighbors(0, 1 + i);
	assignNeighbors(11, 10 - i);

	assignNeighbors(i + 1, wrap(i + 1 + 1, 1, 5));
	assignNeighbors(i + 1, wrap(i + 1 - 1, 1, 5));

	assignNeighbors(10 - i, wrap(10 - i + 1, 6, 10));
	assignNeighbors(10 - i, wrap(10 - i - 1, 6, 10));

	assignNeighbors(i + 1, wrap(7 - i, 6, 10));
	assignNeighbors(i + 1, wrap(8 - i, 6, 10));
}

function wrap(value, min, max) {
	var mod = max - min + 1;
	return (((value - min) + mod) % mod) + min;
}

function assignNeighbors(index0, index1) {
	pentagons[index0].neighbors.push(pentagons[index1]);
	pentagons[index1].neighbors.push(pentagons[index0]);
}

var lineMaterial = new THREE.LineBasicMaterial({
	color: 0xffffff
});

for (var i = 0; i < pentagons.length; ++i) {
	for (var j = 0; j < pentagons[i].neighbors.length; ++j) {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(pentagons[i].neighbors[j].center());
		geometry.vertices.push(pentagons[i].center());
		parent.add(new THREE.Line(geometry, lineMaterial));
	}
}


var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0,1,1);

var ambient = new THREE.AmbientLight(0x222222);

scene.add(light);
scene.add(ambient);

camera.position.z = 7;

var render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

render();

var drag = false;
var x, y;

document.onmousedown = function(e) { 
	drag = true;
	x = e.x;
	y = e.y;
}

document.onmouseup = function(e) { 
	drag = false; 
}

document.onmousemove = function(e) {
	if (!drag) { return; }

	var deltaX = e.x - x;
	var deltaY = e.y - y;

	x = e.x;
	y = e.y;

	var q = new THREE.Quaternion();

	q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.005);
	parent.quaternion.multiplyQuaternions(q, parent.quaternion);

	q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.005);
	parent.quaternion.multiplyQuaternions(q, parent.quaternion);
}

