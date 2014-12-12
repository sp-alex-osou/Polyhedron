function Edges() {
	this.edges = {};
}

Edges.prototype.clone = function() {
	var clone = new Edges();

	this.forEach(function(min, max, faces) {
		clone.init(min, max);
		clone.edges[min][max] = faces;
	});

	return clone;
};

Edges.prototype.get = function(from, to) {
	var min = Math.min(from, to);
	var max = Math.max(from, to);

	this.init(min, max);

	return this.edges[min][max];
};

Edges.prototype.remove = function(from, to) {
	var min = Math.min(from, to);
	var max = Math.max(from, to);

	delete this.edges[min][max];
};

Edges.prototype.forEach = function(callback) {
	for (var min in this.edges) {
		for (var max in this.edges[min]) {
			callback(min, max, this.edges[min][max]);
		}
	}
};

Edges.prototype.init = function(min, max) {
	this.edges[min] = this.edges[min] || {};
	this.edges[min][max] = this.edges[min][max] || [];
};