/* BirdcageBuilder
 * 
 * Main functinality
 *
 * Doug Brantner
 * 26 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */

// TODO - how to split this up? one file? 
// GUI parser/translation separate from math code?
// how to structure this???


/* Debug Options */
var DEBUG_ENABLE = true; // bool; enable or disable debug printing to DOM
var DEBUG_ID = 'debug1'; // DOM ID for debug output


/* User Inputs from HTML DOM */
var n_legs;		// number of legs
var freq;	// target frequency (Hz)
var r_coil; // radius of the birdcage TODO - units = meters?
var r_shield; // radius of shield TODO units

var leg_shape_rect = true; // leg shape (true=rectangle or false=tubular)
var leg_length; 
var leg_width;
var leg_r_inner; // inner radius of tubular leg
var leg_r_outer; // outer radius of tubular leg


/* Internal Vars */
//var leg_r_ratio; // ratio of tubular leg inner/outer radius

var leg_self_inductance;
var leg_mutual_inductance;

const leg_currents = [];
const leg_x = [];
const leg_y = [];

const leg_shield_currents = [];
const leg_shield_x = [];
const leg_shield_y = [];


function debug(s) {
	/* Append a string s to the DEBUG_ID DOM element if global DEBUG_ENABLE is true
	 *
	 *	s = string to print
	 *
	 *	Automatically adds a newline/<br> tag to create a new line
	 */

	if (DEBUG_ENABLE) {
		document.getElementById(DEBUG_ID).innerHTML += s + '<br>';
	}
}


function debug_clear() {
	/* Clear the DEBUG_ID field */
	document.getElementById(DEBUG_ID).innerHTML = '';
}






/********************
 *  MAIN FUNCTIONS  *
 ********************/


// TODO change name to 'main' or something?
function calculate() {
	document.getElementById("output_test1").innerHTML = "Working on it...<br>";
	
	get_gui_args();
	console.log('n_legs = ' + n_legs);

	debug("n_legs = " + n_legs);

	init_legs(n_legs, r_coil);
	
	if (leg_shape_rect) {
		leg_self_ind = calc_leg_self_inductance_rect(leg_length, leg_width);
		}
	else {
		leg_self_ind = calc_leg_self_inductance_tube(leg_length, leg_r_inner, leg_r_outer);
	}

	debug('Leg Self Inductance: ' + leg_self_ind);
}



function get_gui_args() {
	/* Parse DOM and populate global vars
	 */

	// TODO - input sanitize & sanity check
	// TODO - ideally this would be baked into the HTML so user can't submit invalid values
	//		- and highlight wrong inputs in red or something so they can fix it

	// TODO fix units/convert to internal units
	n_legs = document.getElementById('num_legs').value; // TODO cast to number?

	freq = document.getElementById('center_freq').value;
	r_coil = document.getElementById('coil_radius').value; 
	r_shield = document.getElementById('shield_radius').value;
	
	leg_shape_rect = true; // leg shape (true=rectangle or false=tubular) TODO
	leg_length = document.getElementById('leg_len').value;
	leg_width = document.getElementById('leg_width').value;
	//leg_r_inner; // inner radius of tubular leg TODO - need to add DOM flexibility
	//leg_r_outer; // outer radius of tubular leg TODO
}





/********************
 * Leg Calculations *
 ********************/


function init_legs(n, r) {
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
		leg_currents[k] = Math.cos(a + b);
		leg_x[k] = r * leg_currents[k];
		leg_y[k] = r * Math.sin(a + b);

		//from Birdcage.java (slightly edited) TODO can delete
		//ILeg[k] =     (float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
		//Ix[k] = Rcoil*(float)Math.cos(2*Math.PI*k/n + 2*Math.PI/(2*n));
		//Iy[k] = Rcoil*(float)Math.sin(2*Math.PI*k/n + 2*Math.PI/(2*n));
	}

}


function calc_leg_self_inductance_rect(len, width) {
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


function calc_leg_self_inductance_tube(len, r_in, r_out) {
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
