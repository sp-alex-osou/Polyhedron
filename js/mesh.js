function Mesh() {
	this.vertices = [];
	this.faces = [];

	for (var i = 0; i < vertices.length; ++i) {
		this.vertices.push(new THREE.Vector3(vertices[i][0], vertices[i][1], vertices[i][2]));
	}

	for (var i = 0; i < faces.length; ++i) {
		var f = faces[i];

		var a = new THREE.Vector3().subVectors(this.vertices[f[1]], this.vertices[f[0]]);
		var b = new THREE.Vector3().subVectors(this.vertices[f[2]], this.vertices[f[0]]);

		var normal = new THREE.Vector3().crossVectors(a, b).normalize();

		this.faces.push(new Face(f, normal));
	}
}

Mesh.prototype.subdivide = function() {

}