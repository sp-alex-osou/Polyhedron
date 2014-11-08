function Mesh(vertices, faces) {
	this.defaultVertices = vertices.clone();
	this.defaultFaces = faces.clone();

	this.init(0);
}

Mesh.prototype.init = function(subdivisions) {
	this.vertices = [];
	this.faces = [];

	this.subdivisions = 0;

	var v = this.defaultVertices;
	var f = this.defaultFaces;

	for (var i = 0; i < v.length; ++i) {
		this.vertices.push(new THREE.Vector3(v[i][0], v[i][1], v[i][2]));
	}

	for (var i = 0; i < f.length; ++i) {
		this.faces.push(new Face(f[i].clone(), this.getCenter(f[i]), this.getNormal(f[i]), 0));
	}

	for (var i = 0; i < subdivisions; ++i) {
		this.subdivide();
	}
}

Mesh.prototype.merge = function() {
	this.init(Math.max(this.subdivisions - 1, 0));
}

Mesh.prototype.subdivide = function() {
	++this.subdivisions;

	var newFaces = {};

	for (var i = 0; i < this.faces.length; ++i) {
		this.subdivideFace(this.faces[i], newFaces);
	}

	for (var min in newFaces) {
		for (var max in newFaces[min]) {
			this.faces.push(this.mergeFaces(newFaces[min][max]));
		}
	}
}

Mesh.prototype.mergeFaces = function(faces) {
	var corners = [];

	for (var i = 0; i < 2; ++i) {
		for (var j = 1; j < faces[i].corners.length; ++j) {
			corners.push(faces[i].corners[j]);
		}
	}

	return new Face(corners, this.getCenter(corners), this.getNormal(corners), this.subdivisions);
}

Mesh.prototype.subdivideFace = function(face, newFaces) {
	var newCorners = face.corners;
	var oldCorners = face.corners.clone();

	for (var i = 0; i < oldCorners.length; ++i) {
		var corner = this.vertices[oldCorners[i]].clone();

		var prev = this.vertices[oldCorners[(i-1).mod(oldCorners.length)]];
		var next = this.vertices[oldCorners[(i+1).mod(oldCorners.length)]];

		var normalPrev = new THREE.Vector3().addVectors(corner, prev).multiplyScalar(0.5).normalize();
		var normalNext = new THREE.Vector3().addVectors(corner, next).multiplyScalar(0.5).normalize();

		var a = new THREE.Vector3().subVectors(corner, prev).multiplyScalar(0.5);
		var bn = new THREE.Vector3().crossVectors(a, normalPrev).normalize();
		var cn = new THREE.Vector3().crossVectors(normalPrev, normalNext).normalize();

		var bc = Math.acos(bn.dot(cn));
		var sinBC = Math.sin(bc);

		var c = cn.clone().multiplyScalar(a.length() / sinBC);

		var x = sinBC * 2 * c.length() / (1 + sinBC * 2);

		console.log(x);

		corner.add(cn.multiplyScalar(x));

		newCorners[i] = this.addVertex(corner);
	}

	for (var i = 0; i < oldCorners.length; ++i) {
		var a = i;
		var b = (i+1) % oldCorners.length;

		var newFace = new Face([ oldCorners[a], oldCorners[b], newCorners[b], newCorners[a] ]);

		var min = Math.min(oldCorners[a], oldCorners[b]);
		var max = Math.max(oldCorners[a], oldCorners[b]);

		newFaces[min] = newFaces[min] || {};
		newFaces[min][max] = newFaces[min][max] || [];
		newFaces[min][max].push(newFace);
	}
}

Mesh.prototype.addVertex = function(vertex) {
	this.vertices.push(vertex);
	return this.vertices.length - 1;
}

Mesh.prototype.getCenter = function(corners) {
	var center = new THREE.Vector3();

	for (var j = 0; j < corners.length; ++j) {
		center.add(this.vertices[corners[j]]);
	}

	return center.divideScalar(corners.length);
}

Mesh.prototype.getNormal = function(corners) {
	return this.getCenter(corners).normalize();
}

Mesh.prototype.getColor = function(face) {
	var color = THREE.ColorKeywords.green;

	if (face.level == 0) {
		color = THREE.ColorKeywords.red;
	} else if (face.level == this.subdivisions) {
		color = THREE.ColorKeywords.yellow;
	}

	return new THREE.Color(color);
}