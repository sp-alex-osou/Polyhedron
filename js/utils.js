Array.prototype.clone = function() {
	return this.slice(0);
};

Array.prototype.remove = function(index) {
	return this.splice(index, 1);
};

Array.prototype.replace = function(elementOld, elementNew) {
	this[this.indexOf(elementOld)] = elementNew;
};

Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

Math.PHI = (1.0 + Math.sqrt(5)) / 2.0;