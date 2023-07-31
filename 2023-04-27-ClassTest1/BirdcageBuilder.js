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
		this.n_legs = Number(n);	// number of legs
		this.freq = Number(f);		// target frequency (Hz)
		this.r_coil = Number(rc);	// radius of the birdcage TODO - units = meters?
		this.r_shield = Number(rs); // radius of shield TODO units
		this.coil_config = config; // string: 'highpass', 'lowpass', 'bandpass_leg', or 'bandpass_er'
		this.predcap = -1; // predetermined capacitor for bandpass coils (not used for LP/HP)

		// TODO force type of arrays? item by item or whole array?
		this.legs = new BCLegs(this.n_legs, this.r_coil, this.r_shield);
		this.endrings = new BCEndRings(this.n_legs);

		this.endrings.init_endrings(this.legs); // only needs leg currents to be set up

		// USER must call:
		//	legs.set_legs_<geom>
		// 	endrings.set_endrings_<geom>
		//  endrings.set_mutual_inductance(this.legs); // TODO - can this have a wrapper here to make it more transparent to user?
		//
		// before continuing
		// (these all have dependence on the steps before them)
		//
		//  If coil type is bandpass, user must also set predcap
		//  before calling calc_capacitor().
	}


	to_string() {
		var s = 'BirdcageBuilder Object:<br>';
		s += 'n_legs: ' + this.n_legs + '<br>';
		s += 'freq: ' + this.freq + '<br>';
		s += 'r_coil: ' + this.r_coil + '<br>';
		s += 'r_shield: ' + this.r_shield + '<br>';
		return s;

	}


	to_app_csv_string() {
		/* Returns a CSV-formatted string of values to compare with Android App output.
		 *
		 * Format (no spaces):
		 * Frequency, Leg Self Inductance, ER Self Inductance, Leg Mutual Inductance, ER Mutual Inductance, Capacitor
		 *
		 * Output is only valid after complete setup & capacitor calculation are finished.
		 */

		var s = 1e-6*this.freq + ',';
		s += 1e9*this.legs.leg_self_inductance + ',';
		s += 1e9*this.endrings.er_self_inductance + ',';
		s += 1e9*this.legs.leg_mutual_inductance + ',';
		s += 1e9*this.endrings.er_mutual_inductance[this.n_legs/4] + ',';
		s += 1e12*this.calc_capacitor();
		// TODO store cap value when it's computed to avoid repeating?
		// TODO also return config (HP/LP/BP?)
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

		//var predcap = 67e-12; // TODO is this right/fixed/does it need user intput??? MOVING TO CONSTRUCTOR
		var cap, kk, jj; // TODO rename kk, jj if possible?


		console.log('coil_config: ' + this.coil_config);

		debug('calc_capacitor k index: ' + k);
		debug('');

		debug('Leg Currents:');
		debug(this.legs.leg_currents);
		debug('');

		debug('Shield Currents:');
		debug(this.legs.shield_currents);
		debug('');

		debug('Endring Currents');
		debug(this.endrings.er_currents);
		debug('');

		debug('Endring Mutual Inductance');
		debug(this.endrings.er_mutual_inductance);
		debug('');

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
				if (this.predcap < 0) debug('WARNING: predcap not set');

				vol = 0.5 * w * this.legs.leg_mutual_inductance * this.legs.leg_currents[k];
				extravol = -0.5 * this.legs.leg_currents[k] / (w * this.predcap);
				cap = this.endrings.er_currents[k] / (wsq * this.endrings.er_currents[k] * this.endrings.er_mutual_inductance[k] + w*2*(vol + extravol));
				break;
				
			case 'bandpass_er':
				if (this.predcap < 0) debug('WARNING: predcap not set');
				// TODO upgrade this to a user message or console.log; debugs will get lost when disabled for production (above case also!)

				kk = -this.endrings.er_currents[k] * (wsq * this.endrings.er_mutual_inductance[k] - 1/this.predcap);
				jj = this.legs.leg_currents[n/4] * wsq * this.legs.leg_mutual_inductance;
				cap = this.legs.leg_currents[n/4]/ (jj + kk);
				break;
				
			default:
				console.log('BirdcageBuilder: calc_capacitor: invalid coil_config');
		}


		return cap;
	}




}
