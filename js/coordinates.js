Math.PHI = (1.0 + Math.sqrt(5)) / 2.0;

var vertices = [

	// orange

	[ -1, -1, -1 ], // 0
	[ -1, -1, +1 ], // 1
	[ -1, +1, -1 ], // 2
	[ -1, +1, +1 ], // 3

	[ +1, -1, -1 ], // 4
	[ +1, -1, +1 ], // 5
	[ +1, +1, -1 ], // 6
	[ +1, +1, +1 ], // 7

	// green

	[ 0, -1 / Math.PHI, -Math.PHI ], // 8
	[ 0, -1 / Math.PHI, +Math.PHI ], // 9
	[ 0, +1 / Math.PHI, -Math.PHI ], // 10
	[ 0, +1 / Math.PHI, +Math.PHI ], // 11

	// blue

	[ -1 / Math.PHI, -Math.PHI, 0 ], // 12
	[ -1 / Math.PHI, +Math.PHI, 0 ], // 13
	[ +1 / Math.PHI, -Math.PHI, 0 ], // 14
	[ +1 / Math.PHI, +Math.PHI, 0 ], // 15

	// pink

	[ -Math.PHI, 0, -1 / Math.PHI ], // 16
	[ +Math.PHI, 0, -1 / Math.PHI ], // 17
	[ -Math.PHI, 0, +1 / Math.PHI ], // 18
	[ +Math.PHI, 0, +1 / Math.PHI ], // 19
];

var faces = [
	[ 10,  2, 13, 15,  6 ],
	[ 10,  6, 17,  4,  8 ],
	[ 10,  8,  0, 16,  2 ],
	[  8,  4, 14, 12,  0 ],

	[ 11,  7, 15, 13,  3 ],
	[ 11,  9,  5, 19,  7 ],
	[ 11,  3, 18,  1,  9 ],
	[  9,  1, 12, 14,  5 ],

	[ 15,  7, 19, 17,  6 ],
	[ 14,  4, 17, 19,  5 ],
	[ 13,  2, 16, 18,  3 ],
	[ 12,  1, 18, 16,  0 ]
];