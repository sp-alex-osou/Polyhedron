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
});

var geometry = new THREE.Geometry();

for (var i = 0; i < vertices.length; ++i) {
	geometry.vertices.push(new THREE.Vector3(vertices[i][0], vertices[i][1], vertices[i][2]));
}

for (var i = 0; i < faces.length; ++i) {
	var f = faces[i];
	geometry.faces.push(new THREE.Face3(f[0], f[1], f[2]));
	geometry.faces.push(new THREE.Face3(f[0], f[2], f[3]));
	geometry.faces.push(new THREE.Face3(f[0], f[3], f[4]));
}

geometry.computeVertexNormals();

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

