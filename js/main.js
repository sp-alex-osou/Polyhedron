var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

Math.PHI = (1.0 + Math.sqrt(5)) / 2.0;

var parent = new Dodecahedron();
scene.add(parent);

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

