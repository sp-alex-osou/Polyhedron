function Face(corners, normal) {
	this.corners = corners;
	this.normal = normal;
	this.edges = [];

	for (var i = 0; i < corners.length; ++i) {
		this.edges.push(new Edge(corners[i], corners[(i+1) % corners.length]));
	}
}