/* BirdcageBuilder
 * 
 * Compute self- and mutual-inductance for legs and endrings.
 *
 * Doug Brantner
 * 26 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */

/* DEPRECATED! */
/* See main2.js */

// TODO switch to math.js??? or use builtin math?

import Math


// TODO - include images (shield) in main.js or is it only used here?
const leg_shield_currents = [];
const leg_shield_x = [];
const leg_shield_y = [];


function init_legs(n, r) {
	/* Initialize leg arrays
	 *		n = number of legs
	 *		r = radius of birdcage coil TODO units
	 *
	 *	This directly modifies the global arrays:
	 *		leg_currents
	 *		leg_x
	 *		leg_y
	 */

	var b = (2*Math.PI)/(2*n); // TODO do the 2's cancel out?

	for (var k=0; k < n; k++) {
		var a = 2*Math.PI*k/n;
		leg_currents[k] = Math.cos(a + b);
		leg_x[k] = r * leg_currents[k];
		ley_y[k] = r * Math.sin(a + b);

		//from Birdcage.java (slightly edited) TODO can delete
		//ILeg[k] =     (float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
		//Ix[k] = Rcoil*(float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
		//Iy[k] = Rcoil*(float)Math.sin(2*Math.PI*k/n + 2*Math.PI/(2*n));
	}

}


// TODO change name w/ 'calc' prefix? to distinguish from variable names? or 'get'?
function leg_self_inductance_rect(len, width) {
	/* Calculate self-inductance of Rectangular leg
	 *
	 * len = leg length TODO units
	 * width = leg width
	 *
	 * Returns self inductance value TODO units
	 */

	// TODO - java seems to use natuarl log as default - double check this!

	return 2.0 * len * (math.log(2.0 * len/width) + 0.5);
}



