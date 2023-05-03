/* Birdcage Builder
 *
 * Birdcage Main Class
 *
 * Doug Brantner
 * 27 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */



class BirdcageBuilder {

	constructor(n, f, rc, rs, config) {
		this.n_legs = n;	// number of legs
		this.freq = f;		// target frequency (Hz)
		this.r_coil = rc;	// radius of the birdcage TODO - units = meters?
		this.r_shield = rs; // radius of shield TODO units
		this.coil_config = config; // string: 'highpass', 'lowpass', 'bandpass_leg', or 'bandpass_er'
			// bandpass_<capacitor location>

		this.legs = new BCLegs(this.n_legs, this.r_coil, this.r_shield);
		this.endrings = new BCEndRings(this.n_legs);

		this.endrings.init_endrings(this.legs); // only needs leg currents to be set up

		// USER must call:
		//	legs.set_legs_<geom>
		// 	endrings.set_endrings_<geom>
		//  endrings.set_mutual_inductance(this.legs); // TODO - can this have a wrapper here to make it more transparent to user?
		// before continuing
		// (these all have dependence on the steps before them)

		
	}

	to_string() {
		var s = 'BirdcageBuilder Object:<br>';
		s += 'n_legs: ' + this.n_legs + '<br>';
		s += 'freq: ' + this.freq + '<br>';
		s += 'r_coil: ' + this.r_coil + '<br>';
		s += 'r_shield: ' + this.r_shield + '<br>';
		return s;

	}


	calc_capacitor() {
		/* Calculate Capacitor Values
		 *
		 * Returns the capacitor value.
		 */

		var w = 2 * Math.PI * this.freq; // angular frequency (radians/sec)
		var wsq = Math.pow(w, 2); // omega squared
		var n = this.n_legs;
		var k = n/4 - 1; // index for most leg currents/mutual inductance
		var vol, extravol;

		var predcap = 67e-12; // TODO is this right/fixed/does it need user intput???
		var cap, kk, jj; // TODO rename kk, jj if possible?


		console.log('coil_config: ' + this.coil_config);

		debug('calc_capacitor k index: ' + k);

		debug('Leg Currents:');
		debug(this.legs.leg_currents);

		debug('Endring Currents');
		debug(this.endrings.er_currents);

		debug('Endring Mutual Inductance');
		debug(this.endrings.er_mutual_inductance);

		// TODO START HERE
		// TODO ER mutual inductance [k = 1] is NaN and 2 is Inf; WHY?
		// That's the problem - the NaN is propagating...


		switch(this.coil_config) {
			case 'lowpass':
				kk = -this.endrings.er_currents[k] * wsq * this.endrings.er_mutual_inductance[k];
				jj = this.legs.leg_currents[n/4] * wsq * this.legs.leg_mutual_inductance;
				cap = this.legs.leg_currents[n/4] / (jj + kk);
				break;

			case 'highpass':
				vol = 0.5 * w * this.legs.leg_mutual_inductance * this.legs.leg_currents[k];
				extravol = 0;
				cap = this.endrings.er_currents[k] / (wsq * this.endrings.er_currents[k] * this.endrings.er_mutual_inductance[k] + w * 2 * (vol + extravol));
				break;

			case 'bandpass_leg':
				// copied from above:
				vol = 0.5 * w * this.legs.leg_mutual_inductance * this.legs.leg_currents[k];
				extravol = -0.5 * this.legs.leg_currents[k] / (w * predcap);
				cap = this.endrings.er_currents[k] / (wsq * this.endrings.er_currents[k] * this.endrings.er_mutual_inductance[k] + w*2*(vol + extravol));
				break;
				
			case 'bandpass_er':
				kk = -this.endrings.er_currents[k] * (wsq * this.endrings.er_mutual_inductance[k] - 1/predcap);
				jj = this.legs.leg_currents[n/4] * wsq * this.legs.leg_mutual_inductance;
				cap = this.legs.leg_currents[n/4]/ (jj + kk);
				break;
				
			default:
				console.log('BirdcageBuilder: calc_capacitor: invalid coil_config');
		}


		return cap;
	}




}
