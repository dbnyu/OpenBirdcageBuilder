/* Birdcage Builder
 *
 * Birdcage End Rings (Circular)
 *
 * Doug Brantner
 * 28 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */


class BCEndRings {

	//constructor(n, legs) {
	constructor(n) {
		// TODO is n input redundant? since we require BCLegs to be setup already?
		this.n_legs = n; // TODO is this the number of legs or number of ring segments?
		//this.legs = legs; // BCLegs object (MUST be fully set up!)
		// NOTE for now keeping the objects separate; functions that require leg info must be passed the leg object as an input arg

		this.er_shape = 'null'; // 'rect' or 'tube'
		
		// TODO units for all!

		// for rectangular end ring copper:
		this.er_arclen = 0.1;	// arc length of each endring segment (circumference/N) TODO units
		this.er_width = 0.02;	// TODO what is this? thickness of the copper?

		// for tubular endrings:
		this.er_r_inner = 0;	// tube endring inner radius
		this.er_r_outer = 0.02;	// tube endring outer radius

		this.er_self_inductance = -1;
		this.er_mutual_inductance = new Array(n);

		this.er_currents = new Array(n);	// TODO end ring currents?
		// TODO are these used?
		//this.er_x = new Array(n);	// end ring x position (TODO or legs?)
		//this.er_y = new Array(n);

		// USER MUST CALL:
		// init_endrings()
		// set_legs_<geom>

	}

	init_endrings(legs) {
		/* Initialize the currents of the endrings
		 *
		 * legs = BCLegs object (must be fully set up!)
		 *
		 * BCJ.172
		 */
		
		console.assert(this.n_legs == legs.n_legs, 'BCEndRings: init_endrings: # of legs must match!');

		this.er_arclen = 2 * Math.PI * legs.r_coil / this.n_legs;

		this.er_currents[0] = legs.leg_currents[0];

		for (var k = 1; k < this.n_legs; k++) {
			this.er_currents[k] = legs.leg_currents[k] + this.er_currents[k-1];
		}
	}


	set_endrings_rect(w) {
		/* Set up rectangular endring segments
		 *
		 * w = end ring width (TODO what about thickness? assuming this is the width of copper strip?
		 *
		 */

		this.er_shape = 'rect';
		this.er_width = w;

		//this.er_self_inductance = 2 * this.er_arclen * (Math.log(2*this.er_arclen/this.er_width) + 0.5);
		this.er_self_inductance = calc_er_self_inductance_rect(this.er_arclen, this.er_width);
	}



	set_endrings_tube(ir, or) {
		/* Set up tubular endring segments
		 *
		 *	ir = inner radius of tube
		 *	or = outer radius of tube
		 */

		this.er_shape = 'tube';
		this.er_r_inner = ir;
		this.er_r_outer = or;

		this.er_self_inductance = calc_er_self_inductance_tube(this.er_arclen, this.er_r_inner, this.er_r_outer);

	}

	calc_er_self_inductance_rect(arclen, width) {
		/* Calculate self inductance for Rectangular endrings
		 *
		 * arclen = length of each segment
		 * width = width of each segment
		 *
		 * Returns self inductance value.
		 *
		 * BCJ.183
		 */

		return 2 * arclen * (Math.log(2*arclen/width) + 0.5);
	}


	calc_er_self_inductance_tube(arclen, r_in, r_out) {
		/* Calculate the self inductance for Tube legs
		 *
		 * arclen = length of each segment
		 * r_in = inner radius of tube
		 * r_out = outer radius of tube
		 *
		 * Returns the self inductnce value
		 *
		 * BCJ.185
		 */



		if (r_in > 0) {
			var ratio = r_in/r_out;
			var c = 0.1493*Math.pow(ratio, 3) - 0.3606*Math.pow(ratio, 2) - 0.0405*ratio + 0.2526;

			return 2 * arclen * (Math.log(4*arclen/r_out) + c - 1);
		}
		else {
			return 2 * arclen * (Math.log(4*arclen/r_out) - 0.75);
		}

	}


	// TODO START HERE BCJ 195





	/*** Helper Functions ***/
	
	harct(x) {
		/* TODO ?
		 *
		 * BCJ.357
		 */

		return Math.log((1+x)/(1-x)) / 2;
	}

}
