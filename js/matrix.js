var m4 = THREE.Matrix4;

var M4 = {
	identity: new m4(),

	makeTranslationX: function(x) { return new m4().makeTranslation(x, 0, 0); },
	makeTranslationY: function(y) { return new m4().makeTranslation(0, y, 0); },
	makeTranslationZ: function(z) { return new m4().makeTranslation(0, 0, z); },

	makeRotationX: function(x) { return new m4().makeRotationX(x); },
	makeRotationY: function(y) { return new m4().makeRotationY(y); },
	makeRotationZ: function(z) { return new m4().makeRotationZ(z); },

	makeRotationAxis: function(axis, angle) { return new m4().makeRotationAxis(axis, angle); },

	mul: function() {
		var m = new m4();

		for (var i = 0; i < arguments.length; ++i) {
			m.multiply(arguments[i]);
		}

		return m;
	}
};