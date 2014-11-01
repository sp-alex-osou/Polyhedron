function Polygon(numVertices, edgeLength)
{
	var halfCenterAngle = Math.PI / numVertices;
	var centerAngle  = 2.0 * halfCenterAngle;

	this.neighbors = [];
	this.edgeLength = edgeLength || 1;
	this.radius = this.edgeLength / (2.0 * Math.sin(halfCenterAngle));
	this.apothem =  this.radius * Math.cos(halfCenterAngle);

	var shape = new THREE.Shape();

	var angle = Math.PI / 2.0;

	for (var i = 0; i < numVertices; ++i) {
		angle += centerAngle;

		var x = this.radius * Math.cos(angle);
		var y = this.radius * Math.sin(angle);

		i == 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
	}

	THREE.ShapeGeometry.call(this, shape);
}

Polygon.prototype = Object.create(THREE.ShapeGeometry.prototype);

Polygon.prototype.constructor = Polygon;

Polygon.prototype.center = function() {
	var c = new THREE.Vector3();

	for (var i = 0; i < this.vertices.length; ++i) {
		c.add(this.vertices[i]);
	}

	c.multiplyScalar(1.0 / this.vertices.length);

	return c;
}