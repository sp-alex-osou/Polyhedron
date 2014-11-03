function Hexagon(edgeLength)
{
	Polygon.call(this, 6, edgeLength);
}

Hexagon.prototype = Object.create(Polygon.prototype);

Hexagon.prototype.constructor = Hexagon;