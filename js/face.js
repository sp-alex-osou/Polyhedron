function Face(corners, center, normal, level) {
	this.corners = corners;
	this.center = center;
	this.normal = normal;
	this.level = level;
	this.selected = false;
}

Face.prototype.containsAllCorners = function(corners) {
	for (var j = 0; j < corners.length; ++j) {
		if ($.inArray(corners[j], this.corners) == -1)
			return false;
	}

	return true;
};