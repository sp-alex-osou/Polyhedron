function Mesh(vertices, faces) {
	this.defaultVertices = vertices.clone();
	this.defaultFaces = faces.clone();

	this.init(0);
}

Mesh.prototype.init = function(subdivisions) {
	this.vertices = [];
	this.faces = [];
	this.edges = new Edges();

	this.subdivisions = 0;

	var v = this.defaultVertices;
	var f = this.defaultFaces;

	for (var i = 0; i < v.length; ++i) {
		this.addVertex(new THREE.Vector3(v[i][0], v[i][1], v[i][2]));
	}

	for (var i = 0; i < f.length; ++i) {
		this.addFace(new Face(f[i].clone(), this.getCenter(f[i]), this.getNormal(f[i]), 0));
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

	var oldEdges = this.edges.clone();

	for (var i = 0; i < this.faces.length; ++i) {
		this.subdivideFace(this.faces[i]);
	}

	var that = this;

	oldEdges.forEach(function(from, to, faces) {
		that.addFace(that.mergeFaces(faces));
		that.edges.remove(from, to);
	});
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

Mesh.prototype.subdivideFace = function(face) {
	var oldCorners = face.corners.clone();

	for (var i = 0; i < oldCorners.length; ++i) {
		var corner = this.vertices[oldCorners[i]];

		var prev = this.vertices[oldCorners[(i-1).mod(oldCorners.length)]];
		var next = this.vertices[oldCorners[(i+1).mod(oldCorners.length)]];

		var centerPrev = new THREE.Vector3().addVectors(corner, prev);
		var centerNext = new THREE.Vector3().addVectors(corner, next);

		var cornerToCenter = new THREE.Vector3().subVectors(face.center, corner);
		var cornerToPrev = new THREE.Vector3().subVectors(prev, corner);

		var helper = new THREE.Vector3().crossVectors(corner, cornerToCenter);

		var v0 = new THREE.Vector3().crossVectors(helper, centerPrev).normalize();
		var v1 = new THREE.Vector3().crossVectors(helper, centerNext).normalize();

		var vc = cornerToCenter.clone().normalize();

		var offset = cornerToPrev.length() * 0.5;

		var angle = Math.PI * 0.5 - Math.acos(corner.clone().multiplyScalar(-1.0).normalize().dot(v0));

		var offset = Math.sin(angle) * this.radius * 2.0;

		//var edgeNext = new THREE.Vector3().subVectors(next, corner);
		//var edgePrev = new THREE.Vector3().subVectors(prev, corner);

		face.corners[i] = this.addVertex(new THREE.Vector3().addVectors(corner, v0.multiplyScalar(offset)));

		if (this.subdivisions > 1) {
			var v = new THREE.Vector3()
				.addVectors(corner, face.center)
				.normalize()
				.multiplyScalar(this.radius);

			face.corners[i] = this.addVertex(v);
		}
	}

	face.center = this.getCenter(face.corners);

	for (var i = 0; i < oldCorners.length; ++i) {
		var a = i;
		var b = (i+1).mod(oldCorners.length);

		var newFace = new Face([ oldCorners[a], oldCorners[b], face.corners[b], face.corners[a] ]);

		this.edges.get(face.corners[a], face.corners[b]).push(face);
		this.edges.get(oldCorners[a], oldCorners[b]).replace(face, newFace);
	}
};

Mesh.prototype.addVertex = function(vertex) {
	this.vertices.push(vertex);
	return this.vertices.length - 1;
};

Mesh.prototype.addFace = function(face) {
	this.faces.push(face);

	// update edges
	for (var i = 0; i < face.corners.length; ++i) {
		var a = face.corners[i];
		var b = face.corners[(i+1).mod(face.corners.length)];

		this.edges.get(a, b).push(face);
	}

	return face;
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

Mesh.prototype.selectFaces = function(corners) {
	for (var i = 0; i < this.faces.length; ++i) {
		if (this.faces[i].containsAllCorners(corners)) {
			this.faces[i].selected = !this.faces[i].selected;

			var neighbors = this.getNeighbors(this.faces[i]);

			for (var j = 0; j < neighbors.length; ++j) {
				neighbors[j].selected = !neighbors[j].selected;
			}
		}
	}
};

Mesh.prototype.getNeighbors = function(face) {
	var neighbors = [];

	for (var i = 0; i < face.corners.length; ++i) {
		var from = face.corners[i];
		var to = face.corners[(i+1).mod(face.corners.length)];

		var faces = this.edges.get(from, to);

		for (var j = 0; j < faces.length; ++j) {
			if (faces[j] != face) {
				neighbors.push(faces[j]);
			}
		}
	}

	return neighbors;
};