var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var parent = new Dodecahedron();
// scene.add(parent);

var material = new THREE.MeshLambertMaterial({ 
	// wireframe: true,
	// side: THREE.DoubleSide,
	shading: THREE.FlatShading
});

var mesh = new Mesh();

mesh.subdivide();

var geometry = new THREE.Geometry();

for (var i = 0; i < mesh.vertices.length; ++i) {
	geometry.vertices.push(mesh.vertices[i]);
}

for (var i = 0; i < mesh.faces.length; ++i) {
	var f = mesh.faces[i];

	for (var j = 0; j < f.corners.length - 2; ++j) {
		geometry.faces.push(new THREE.Face3(f.corners[0], f.corners[1+j], f.corners[2+j], f.normal));
	}
}

var parent = new THREE.Mesh(geometry, material);
scene.add(parent);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0,1,1);

var ambient = new THREE.AmbientLight(0x222222);
// var ambient = new THREE.AmbientLight(0xffffff);

scene.add(light);
scene.add(ambient);

camera.position.z = 5;

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

