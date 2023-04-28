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

	constructor(n, f, rc, rs) {
		this.n_legs = n;	// number of legs
		this.freq = f;		// target frequency (Hz)
		this.r_coil = rc;	// radius of the birdcage TODO - units = meters?
		this.r_shield = rs; // radius of shield TODO units

		this.legs = new BCLegs(this.n_legs, this.r_coil, this.r_shield);
		
	}

	to_string() {
		var s = 'BirdcageBuilder Object:<br>';
		s += 'n_legs: ' + this.n_legs + '<br>';
		s += 'freq: ' + this.freq + '<br>';
		s += 'r_coil: ' + this.r_coil + '<br>';
		s += 'r_shield: ' + this.r_shield + '<br>';
		return s;

	}

}
