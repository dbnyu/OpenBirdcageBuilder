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

var DEBUG_ENABLE = true; // bool; enable or disable debug printing to DOM
var DEBUG_ID = 'debug1'; // DOM ID for debug output

var n_legs;		// number of legs
var freq;	// target frequency (Hz)
var r_coil; // radius of the birdcage TODO - units = meters?
var r_shield; // radius of shield TODO units

var leg_shape_rect = true; // leg shape (true=rectangle or false=tubular)
var leg_length; 
var leg_width;
var leg_r_inner; // inner radius of tubular leg
var leg_r_outer; // outer radius of tubular leg
var leg_r_ratio; // ratio of tubular leg inner/outer radius
var leg_self_inductance;
var leg_mutual_inductance;
const leg_currents = [];
const leg_x = [];
const leg_y = [];




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


// TODO change name to 'main' or something?
function calculate() {
	document.getElementById("output_test1").innerHTML = "Working on it...<br>";
	
	get_gui_args();
	console.log('n_legs = ' + n_legs);

	debug("n_legs = " + n_legs);

	init_legs(n_legs, r_coil);
	//leg_self_ind = leg_self_inductance_rect();
	//debug(leg_self_ind);
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

