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
		this.n_legs = Number(n); // TODO is this the number of legs or number of ring segments?
		//this.legs = legs; // BCLegs object (MUST be fully set up!)
		// NOTE for now keeping the objects separate; functions that require leg info must be passed the leg object as an input arg

		this.er_shape = 'null'; // 'rect' or 'tube'
		
		// TODO units for all!

		// for rectangular end ring copper:
		// TODO delete arbitrary defaults?
		//this.er_arclen = 0.1;	// arc length of each endring segment (circumference/N) TODO units
		//this.er_width = 0.02;	// TODO what is this? thickness of the copper?
		this.er_arclen = -1;	// arc length of each endring segment (circumference/N) TODO units
		this.er_width = -1;	// TODO what is this? thickness of the copper?

		// for tubular endrings:
		// TODO delete arbitrary defaults?
		//this.er_r_inner = 0;	// tube endring inner radius
		//this.er_r_outer = 0.02;	// tube endring outer radius
		this.er_r_inner = -1;	// tube endring inner radius
		this.er_r_outer = -1;	// tube endring outer radius

		this.er_self_inductance = -1;
		this.er_mutual_inductance = new Array(n);

		this.er_currents = new Array(n);	// TODO end ring currents?
		// TODO are these used?
		//this.er_x = new Array(n);	// end ring x position (TODO or legs?)
		//this.er_y = new Array(n);

		// USER MUST CALL:
		// init_endrings() (called automatically in BircageBuilder constructor
		// NOTE: if user wants to specify custom endring arclength values, do it AFTER 
		//		BirdcageBuilder constructor and before anything else!)
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

		var k;
		for (k = 1; k < this.n_legs; k++) {
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
		this.er_width = Number(w);

		//this.er_self_inductance = 2 * this.er_arclen * (Math.log(2*this.er_arclen/this.er_width) + 0.5);
		this.er_self_inductance = this.calc_er_self_inductance_rect(this.er_arclen, this.er_width);
	}



	set_endrings_tube(ir, or) {
		/* Set up tubular endring segments
		 *
		 *	ir = inner radius of tube
		 *	or = outer radius of tube
		 */

		this.er_shape = 'tube';
		this.er_r_inner = Number(ir);
		this.er_r_outer = Number(or);

		this.er_self_inductance = this.calc_er_self_inductance_tube(this.er_arclen, this.er_r_inner, this.er_r_outer);

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

		arclen = Number(arclen);
		width = Number(width);

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

		arclen = Number(arclen);
		r_in = Number(r_in);
		r_out = Number(r_out);


		if (r_in > 0) {
			var ratio = r_in/r_out;
			var c = 0.1493*Math.pow(ratio, 3) - 0.3606*Math.pow(ratio, 2) - 0.0405*ratio + 0.2526;

			return 2 * arclen * (Math.log(4*arclen/r_out) + c - 1);
		}
		else {
			return 2 * arclen * (Math.log(4*arclen/r_out) - 0.75);
		}
	}

	calc_er_mutual_inductance(legs) {
		/* TODO - this is mostly transliterated directly from the Java code (ie. black box)
		 *
		 *
		 * legs = BCLegs object (must be fully setup!)
		 *
		 * Starting on BCJ.195 - BCJ.294
		 *
		 * Directly modifies this.er_mutual_inductance
		 */

		console.assert(this.n_legs == legs.n_legs, 'BCEndRings: calc_er_mutual_inductance: # of legs must match!');

		// TODO descriptions???
		var n = this.n_legs;
		var d, m1, l1, R1, ang1, Mnext, Mprev, Lop, Ladj, Lnadj, M, L, R3, R4, R2, a2, ang, p, mu, v, t1, t2, t3, t4, s1, s2, s3, s4;
		var lmu = new Array(n);
		var z, z1;
		var idx1, idxN, idx2, idxK, iKN2N, iKN1N;
		var iKpK1N, iKpK1m1N;


		//debug('n = ' + n);
		//debug('n_legs = ' + this.n_legs);


		// TODO - source starts at 0 but should this start at 1?
		var k, k1;
		for (k=0; k < n; k++){

			//debug('k: ' + k);
			//debug('--------');

			// pre-compute modulo indexes (NOTE javascript % operator does NOT behave as expected)
			// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
			idx1 = mod(k+1, n);
			idxN = mod(k+n, n);

			//debug('k = ' + k);
			//debug('n = ' + n);
			//debug('k+1 = ' + (k+1));
			//debug('idx1: (k+1) mod n: ' + idx1);
			//debug('test idx1        : ' + mod(k+1, n));
			////debug('test idx1-2      : ' + mod(1, 8));
			//debug('');
			//debug('idxN: mod(k+n, n): ' + idxN);
			//debug('test idxN:       : ' + mod(k+n, n));
			////debug('test idxN-2      : ' + mod(8, 8));
			//debug('');

			idx2 = mod(k+2, n);
			idxK = mod(k, n);
			iKN2N = mod(k+n/2, n);
			iKN1N = mod(k+n-1, n);

			//Mutual Inductance of Opposite Rings
			d = Math.sqrt(Math.pow(legs.leg_x[idx1]-legs.leg_x[iKN2N],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[iKN2N],2));
			Lop = 0;
			if (Math.abs(this.er_currents[idxK])>(1/10000)) {
				Lop = 2*this.er_arclen*(Math.log(this.er_arclen/d+Math.sqrt(1+Math.pow(this.er_arclen/d, 2)))-Math.sqrt(1+Math.pow(d/this.er_arclen,2))+d/this.er_arclen);
			
			}
			
			//debug('d: ' + d);
			//debug('Lop: ' + Lop);
		
			//Mutual Inductance of Adjacent Rings
			// TODO m1 is zero when k=1 in app default value test
			m1 = Math.sqrt(Math.pow(legs.leg_x[idx1]-legs.leg_x[idxN],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[idxN],2));
			l1 = Math.sqrt(Math.pow(legs.leg_x[idx1]-legs.leg_x[idx2],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[idx2],2));
			R1 = Math.sqrt(Math.pow(legs.leg_x[idx2]-legs.leg_x[idxK],2)+Math.pow(legs.leg_y[idx2]-legs.leg_y[idxK],2));

			//debug('m1 first calc:');
			//debug('Math.pow(legs.leg_x[idx1]-legs.leg_x[idxN],2): ' + Math.pow(legs.leg_x[idx1]-legs.leg_x[idxN],2));
		    //debug('Math.pow(legs.leg_y[idx1]-legs.leg_y[idxN],2): ' + Math.pow(legs.leg_y[idx1]-legs.leg_y[idxN],2));
			//debug('m1: ' + m1);
			//debug('l1: ' + l1);
			//debug('R1: ' + R1);
			
			ang1 = (Math.pow(l1,2)+Math.pow(m1,2)-Math.pow(R1,2))/(2*l1*m1);

			//debug('Math.pow(l1,2): ' + Math.pow(l1,2));
			//debug('Math.pow(m1,2): ' + Math.pow(m1,2));
			//debug('Math.pow(R1,2): ' + Math.pow(R1,2));
			//debug('(2*l1*m1): ' +      (2*l1*m1));
			//debug('ang1: ' + ang1);

			Mnext = Math.abs(2*ang1*(l1*this.harct(m1/(l1+R1))+m1*this.harct(m1/(m1+R1)) ));
			
			// TODO m1 is zero when k=1 in app default value test (zero appears in first one above too)
			m1 = Math.sqrt(Math.pow(legs.leg_x[idxK]-legs.leg_x[iKN1N],2)+Math.pow(legs.leg_y[idxK]-legs.leg_y[iKN1N],2));

			l1 = Math.sqrt(Math.pow(legs.leg_x[idxK]-legs.leg_x[idx1],2)+Math.pow(legs.leg_y[idxK]-legs.leg_y[idx1],2));
			R1 = Math.sqrt(Math.pow(legs.leg_x[idx1]-legs.leg_x[iKN1N],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[iKN1N],2));

			//debug('Mnext: ' + Mnext);
			//debug('m1: ' + m1);
			//debug('l1: ' + l1);
			//debug('R1: ' + R1);
			
			ang1 = (Math.pow(l1,2) + Math.pow(m1,2) - Math.pow(R1,2))/(2*l1*m1);
			Mprev = Math.abs(2*ang1*(l1*this.harct(m1/(l1+R1))+m1*this.harct(m1/(m1+R1)) ));	

			//debug('ang1: ' + ang1);
			//debug('Mprev: ' + Mprev);





			

			Ladj=0;
			if (Math.abs(this.er_currents[idxK])>(1/100000)) {
				Ladj = (Mnext*this.er_currents[idx1]+Mprev*this.er_currents[iKN1N])/this.er_currents[idxK];
			}
			


			//Mutual Inductance of Non Adjacent Rings
			Lnadj = 0;
			for (k1 = 3; k1<n; k1++) {

				// pre-compute modulo indexes (see above, do NOT use % operator)
				
				iKpK1N = mod(k+k1, n);
				iKpK1m1N = mod(k+k1-1, n);
			
				M = Math.sqrt(Math.pow(legs.leg_x[idx1]-legs.leg_x[idxK],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[idxK],2));
				L = Math.sqrt(Math.pow(legs.leg_x[iKpK1N]-legs.leg_x[iKpK1m1N],2)+Math.pow(legs.leg_y[iKpK1N]-legs.leg_y[iKpK1m1N],2));
				R3 = (Math.pow(legs.leg_x[idxK]-legs.leg_x[iKpK1m1N],2)+Math.pow(legs.leg_y[idxK]-legs.leg_y[iKpK1m1N],2));
				R4 = (Math.pow(legs.leg_x[idx1]-legs.leg_x[iKpK1m1N],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[iKpK1m1N],2));
				R2 = (Math.pow(legs.leg_x[idxK]-legs.leg_x[iKpK1N],2)+Math.pow(legs.leg_y[idxK]-legs.leg_y[iKpK1N],2));
				R1 = (Math.pow(legs.leg_x[idx1]-legs.leg_x[iKpK1N],2)+Math.pow(legs.leg_y[idx1]-legs.leg_y[iKpK1N],2));
				
				a2 = R4 - R3 + R2 - R1;	
				
				ang = a2/(L*M);
			
				p = 4*Math.pow(L,2)*Math.pow(M,2)-Math.pow(a2,2);
				if (p==0) {
					mu = 0;
					v = 0;
				} else {
					mu = L*(2*Math.pow(M,2)*(R2-R3-Math.pow(L,2))+a2*(R4-R3-Math.pow(M,2)))/(4*Math.pow(L,2)*Math.pow(M,2)-Math.pow(a2,2));
					v = M*(2*Math.pow(L,2)*(R4-R3-Math.pow(M,2))+a2*(R2-R3-Math.pow(L,2)))/(4*Math.pow(L,2)*Math.pow(M,2)-Math.pow(a2,2));
				}
			
				t4 = Math.sqrt(R4);
				t3 = Math.sqrt(R3);
				t2 = Math.sqrt(R2);			
				t1 = Math.sqrt(R1);
				s1 = (mu+L)*this.harct(M/(t1+t2));
				s2 = (v+M)*this.harct(L/(t1+t4));
				s3 = (mu)*this.harct(M/(t3+t4));
				s4 = (v)*this.harct(L/(t3+t2));
				lmu[k1] = ang*(s1+s2-s3-s4);
				if (k1==(n/2+1)) {
					lmu[k1]=0;
				}
				
				
				if (Math.abs(this.er_currents[idxK])>(1/100000)) {
					Lnadj = Lnadj + lmu[k1]*Math.abs(this.er_currents[iKpK1m1N]/this.er_currents[idxK]);		
				}
			
			
			
			}
		

			this.er_mutual_inductance[k] = Lnadj + this.er_self_inductance + Lop + Ladj;
		
		
			//debug('');
		} // end of loop
			
		this.er_self_inductance = this.er_self_inductance*1e-7;
		for (k=0;k<n;k++) {
			this.er_mutual_inductance[k] = this.er_mutual_inductance[k]*1e-7;		
		}
		
	}	







	/*** Helper Functions ***/
	
	harct(x) {
		/* Inverse Hyperbolic Tangent (arctan)
		 * https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions
		 *
		 * Supported on -1 < x < 1
		 *
		 * BCJ.357
		 */

		x = Number(x);

		return Math.log((1+x)/(1-x)) / 2;
	}

}
