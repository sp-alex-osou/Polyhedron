var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var material = new THREE.MeshLambertMaterial({ 
	// wireframe: true,
	// side: THREE.DoubleSide,
	shading: THREE.FlatShading,
	vertexColors: THREE.FaceColors
});

var mesh = new Mesh(Dodecahedron.vertices, Dodecahedron.faces);

var parent = new THREE.Object3D();
var child;

scene.add(parent);

function updateMesh() {
	parent.remove(child);

	var geometry = new THREE.Geometry();

	for (var i = 0; i < mesh.vertices.length; ++i) {
		geometry.vertices.push(mesh.vertices[i]);
	}

	for (var i = 0; i < mesh.faces.length; ++i) {
		var f = mesh.faces[i];

		for (var j = 0; j < f.corners.length - 2; ++j) {
			geometry.faces.push(new THREE.Face3(f.corners[0], f.corners[1+j], f.corners[2+j], f.normal, mesh.getColor(f)));
		}
	}

	child = new THREE.Mesh(geometry, material);
	parent.add(child);
}

updateMesh();

var light = new THREE.DirectionalLight(0x777777);
light.position.set(0,1,1);

var ambient = new THREE.AmbientLight(0x444444);
// var ambient = new THREE.AmbientLight(0xffffff);

scene.add(light);
scene.add(ambient);

camera.position.z = 4;

var render = function () {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
};

render();