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

	this.radius = this.vertices[0].length();

	for (var i = 0; i < subdivisions; ++i) {
		this.subdivide();
	}
};

Mesh.prototype.merge = function() {
	this.init(Math.max(this.subdivisions - 1, 0));
};

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
};

Mesh.prototype.mergeFaces = function(faces) {
	var corners = [];

	for (var i = 0; i < 2; ++i) {
		for (var j = 1; j < faces[i].corners.length; ++j) {
			corners.push(faces[i].corners[j]);
		}
	}

	return new Face(corners, this.getCenter(corners), this.getNormal(corners), this.subdivisions);
};

Mesh.prototype.subdivideFace = function(face, newFaces) {
	var oldCorners = face.corners.clone();
	var offsets = [];

	for (var i = 0; i < oldCorners.length; ++i) {
		face.corners[i] = this.addVertex(this.vertices[oldCorners[i]].clone());
		offsets[i] = new THREE.Vector3().subVectors(this.vertices[face.corners[i]], face.center).multiplyScalar(0.5);
	}

	for (var iteration = 0; iteration < 10; ++iteration) {
		for (var i = 0; i < oldCorners.length; ++i) {
			this.vertices[face.corners[i]] = new THREE.Vector3().addVectors(face.center, offsets[i]).normalize().multiplyScalar(this.radius);
		}

		face.center = this.getCenter(face.corners);
	}

	for (var i = 0; i < oldCorners.length; ++i) {
		var a = i;
		var b = (i+1) % oldCorners.length;

		var newFace = new Face([ oldCorners[a], oldCorners[b], face.corners[b], face.corners[a] ]);

		var min = Math.min(oldCorners[a], oldCorners[b]);
		var max = Math.max(oldCorners[a], oldCorners[b]);

		newFaces[min] = newFaces[min] || {};
		newFaces[min][max] = newFaces[min][max] || [];
		newFaces[min][max].push(newFace);
	}
};

Mesh.prototype.addVertex = function(vertex) {
	this.vertices.push(vertex);
	return this.vertices.length - 1;
};

Mesh.prototype.getCenter = function(corners) {
	var center = new THREE.Vector3();

	for (var j = 0; j < corners.length; ++j) {
		center.add(this.vertices[corners[j]]);
	}

	return center.divideScalar(corners.length);
};

Mesh.prototype.getNormal = function(corners) {
	return this.getCenter(corners).normalize();
};

Mesh.prototype.getColor = function(face) {
	var color = THREE.ColorKeywords.green;

	if (face.selected) {
		color = THREE.ColorKeywords.blue;
	} else if (face.level == 0) {
		color = THREE.ColorKeywords.red;
	} else if (face.level == this.subdivisions) {
		color = THREE.ColorKeywords.yellow;
	}

	return new THREE.Color(color);
};

Mesh.prototype.selectFace = function(corners)
{
	for (var i = 0; i < this.faces.length; ++i) {
		var containsAllCorners = true;
		for (var j = 0; j < corners.length; ++j) {
			if ($.inArray(corners[j], this.faces[i].corners) == -1)
				containsAllCorners = false;
		}
		if (containsAllCorners)
			this.faces[i].selected = !this.faces[i].selected;
	}
};