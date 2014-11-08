Array.prototype.clone = function() {
	return this.slice(0);
}

Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}

Math.PHI = (1.0 + Math.sqrt(5)) / 2.0;