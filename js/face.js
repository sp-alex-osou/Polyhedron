function Face(vertices) {
	this.vertices = vertices;
	this.edges = {};

	for (var i = 0; i < vertices.length; ++i) {
		var v = vertices[i];
		var edge = new Edge(v, vertices[(i+1)%vertices.length], this);
		
		v.faces.push_back(this);
		v.edges.push_back(edge);

		this.edges.push_back(edge);
	}
}