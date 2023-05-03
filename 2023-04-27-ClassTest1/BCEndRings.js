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
		this.er_self_inductance = this.calc_er_self_inductance_rect(this.er_arclen, this.er_width);
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
		var k1;
		var lmu = new Array(n);
		var z, z1;
		

		var k=0;
		for (k=0; k < n; k++){

			//Mutual Inductance of Opposite Rings
			d = Math.sqrt(Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+n/2)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+n/2)%n],2));
			Lop = 0;
			if (Math.abs(this.er_currents[k%n])>(1/10000)) {
				Lop = 2*this.er_arclen*(Math.log(this.er_arclen/d+Math.sqrt(1+Math.pow(this.er_arclen/d, 2)))-Math.sqrt(1+Math.pow(d/this.er_arclen,2))+d/this.er_arclen);
			
			}
			
		
			//Mutual Inductance of Adjacent Rings
			m1 = Math.sqrt(Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+n)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+n)%n],2));
			l1 = Math.sqrt(Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+2)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+2)%n],2));
			R1 = Math.sqrt(Math.pow(legs.leg_x[(k+2)%n]-legs.leg_x[(k)%n],2)+Math.pow(legs.leg_y[(k+2)%n]-legs.leg_y[(k)%n],2));
			
			ang1 = (Math.pow(l1,2)+Math.pow(m1,2)-Math.pow(R1,2))/(2*l1*m1);

			Mnext = Math.abs(2*ang1*(l1*this.harct(m1/(l1+R1))+m1*this.harct(m1/(m1+R1)) ));
			
			m1 = Math.sqrt(Math.pow(legs.leg_x[(k)%n]-legs.leg_x[(k+n-1)%n],2)+Math.pow(legs.leg_y[(k)%n]-legs.leg_y[(k+n-1)%n],2));
			l1 = Math.sqrt(Math.pow(legs.leg_x[(k)%n]-legs.leg_x[(k+1)%n],2)+Math.pow(legs.leg_y[(k)%n]-legs.leg_y[(k+1)%n],2));
			R1 = Math.sqrt(Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+n-1)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+n-1)%n],2));
			

			ang1 = (Math.pow(l1,2)+Math.pow(m1,2)-Math.pow(R1,2))/(2*l1*m1);
			Mprev = Math.abs(2*ang1*(l1*this.harct(m1/(l1+R1))+m1*this.harct(m1/(m1+R1)) ));	
			

			Ladj=0;
			if (Math.abs(this.er_currents[k%n])>(1/100000)) {
				Ladj = (Mnext*this.er_currents[(k+1)%n]+Mprev*this.er_currents[(k+n-1)%n])/this.er_currents[k%n];
			}
			

			//Mutual Inductance of Non Adjacent Rings
			Lnadj = 0;
			for (k1 = 3; k1<n; k1++) {
			
				M = Math.sqrt(Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k)%n],2));
				L = Math.sqrt(Math.pow(legs.leg_x[(k+k1)%n]-legs.leg_x[(k+k1-1)%n],2)+Math.pow(legs.leg_y[(k+k1)%n]-legs.leg_y[(k+k1-1)%n],2));
				R3 = (Math.pow(legs.leg_x[(k)%n]-legs.leg_x[(k+k1-1)%n],2)+Math.pow(legs.leg_y[(k)%n]-legs.leg_y[(k+k1-1)%n],2));
				R4 = (Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+k1-1)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+k1-1)%n],2));
				R2 = (Math.pow(legs.leg_x[(k)%n]-legs.leg_x[(k+k1)%n],2)+Math.pow(legs.leg_y[(k)%n]-legs.leg_y[(k+k1)%n],2));
				R1 = (Math.pow(legs.leg_x[(k+1)%n]-legs.leg_x[(k+k1)%n],2)+Math.pow(legs.leg_y[(k+1)%n]-legs.leg_y[(k+k1)%n],2));
				
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
				
				
				if (Math.abs(this.er_currents[k%n])>(1/100000)) {
					Lnadj = Lnadj + lmu[k1]*Math.abs(this.er_currents[(k+k1-1)%n]/this.er_currents[k%n]);		
				}
			
			
			
			}
		

			this.er_mutual_inductance[k] = Lnadj + this.er_self_inductance + Lop + Ladj;
		
		
		}
			
		this.er_self_inductance = this.er_self_inductance*1e-7;
		for (k=0;k<n;k++) {
			this.er_mutual_inductance[k] = this.er_mutual_inductance[k]*1e-7;		
		}
		
	}	



	// TODO START HERE BCJ 300 (main file?)





	/*** Helper Functions ***/
	
	harct(x) {
		/* TODO ?
		 *
		 * BCJ.357
		 */

		return Math.log((1+x)/(1-x)) / 2;
	}

}
