/* Birdcage Builder
 *
 * GUI Handler
 *
 * Doug Brantner
 * 27 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */



class BirdcageBuilder {

	constructor(n, f, rc, rs) {
		this.n_legs = n;	// number of legs
		this.freq = f;		// target frequency (Hz)
		this.r_coil = rc;	// radius of the birdcage TODO - units = meters?
		this.r_shield = rs; // radius of shield TODO units
		
		// these are set in the set_legs_... functions below 
		// TODO subclass for rect/tube legs (ie. extendable to other geometries?)
		//leg_shape_rect = true; // leg shape (true=rectangle or false=tubular)
		//leg_length; 
		//leg_width;
		//leg_r_inner; // inner radius of tubular leg
		//leg_r_outer; // outer radius of tubular leg

		this.leg_self_inductance = -1;
		this.leg_mutual_inductance = -1;
		
		this.leg_currents = new Array(n);
		this.leg_x = new Array(n);
		this.leg_y = new Array(n);

		this.leg_shield_currents = new Array(n);
		this.leg_shield_x = new Array(n);
		this.leg_shield_y = new Array(n);

		this.init_legs(this.n_legs, this.r_coil);
	}

	set_legs_rect(l, w) {
		this.leg_shape = 'rect';
		this.leg_length = l;
		this.leg_width = w;
		this.leg_self_inductance = this.calc_leg_self_inductance_rect(this.leg_length, this.leg_width);
		// TODO mutual inductance
	}

	set_legs_tube(l, ir, or) {
		this.leg_shape_rect = 'tube';
		this.leg_length = l;
		this.leg_r_inner = ir;
		this.leg_r_outer = or;
		this.leg_self_inductance = this.calc_leg_self_inductance_tube(this.leg_length, this.leg_r_inner, this.leg_r_outer);

		// TODO mutual inductance
	}


	init_legs(n, r) {
		/* Initialize leg arrays
		 *		n = number of legs
		 *		r = radius of birdcage coil TODO units
		 *
		 *	This directly modifies the global arrays:
		 *		leg_currents
		 *		leg_x
		 *		leg_y
		 *
		 *	BC2J.67
		 */
	
		var b = (2*Math.PI)/(2*n); // TODO do the 2's cancel out?
	
		for (var k=0; k < n; k++) {
			var a = 2*Math.PI*k/n;

			this.leg_currents[k] = Math.cos(a + b);
			this.leg_x[k] = r * this.leg_currents[k];
			this.leg_y[k] = r * Math.sin(a + b);
	
			//from Birdcage.java (slightly edited) TODO can delete
			//ILeg[k] =     (float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
			//Ix[k] = Rcoil*(float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
			//Iy[k] = Rcoil*(float)Math.sin(2*Math.PI*k/n + 2*Math.PI/(2*n));
		}
	
	}


	calc_leg_self_inductance_rect(len, width) {
		/* Calculate self-inductance of Rectangular leg
		 *
		 * len = leg length TODO units
		 * width = leg width
		 *
		 * Returns self inductance value TODO units
		 * BC2J.78
		 */
	
		// TODO - java & javascript both seem to use natural log as default - double check this!
		return 2.0 * len * (Math.log(2.0 * len/width) + 0.5);
	}
	
	
	calc_leg_self_inductance_tube(len, r_in, r_out) {
		/* Calculate self-inductance of Tubular leg
		 *
		 * len = leg length TODO units
		 * r_in = inner radius of tube  TODO what does zero mean see below?
		 * r_out = outer radius of tube 
		 *
		 * Returns self inductance value TODO units
		 * BC2J.81
		 */
	
		// TODO - if inner radius is zero, does that mean a solid core conductor/wire?
		// TODO what are these constants in r>0 case? can they be expanded for better precision?
	
		if (r_in > 0) { 
			var ratio = r_in / r_out;
			k = 0.1493 * Math.pow(ratio,3) - 0.3606 * Math.pow(ratio,2) - 0.0405 * ratio + 0.2526;
			return 2 * len * (Math.log(4*len/r_out) + k - 1);
		}
		else {
			return 2 * len * (Math.log(4*len/r_out) - 0.75);
		}
	
	}


}
