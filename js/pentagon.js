function Pentagon(edgeLength)
{
	Polygon.call(this, 5, edgeLength);
}

Pentagon.prototype = Object.create(Polygon.prototype);

Pentagon.prototype.constructor = Pentagon;