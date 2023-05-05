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

// v0.0.2 - Testing Class based functionality separated from GUI handling (2 files)

// TODO - how to split this up? one file? 
// GUI parser/translation separate from math code?
// how to structure this???

// Anything related to HTML/DOM/GUI id's or anything else should happen HERE
// All other code should be completely agnostic of GUI


/* Debug Settings */
// these are declared in debug.js but set here 
DEBUG_ENABLE = true; // bool; enable or disable debug printing to DOM
DEBUG_ID = 'debug1'; // DOM ID for debug output




/********************
 *  MAIN FUNCTIONS  *
 ********************/
//debug('BBGuiHandler loaded.');


// TODO change name to 'main' or something?
function calculate() {
	document.getElementById("output_test1").innerHTML = "Working on it...<br>";
	
	BB = get_gui_args();
	cap = BB.calc_capacitor();

	debug("n_legs = " + BB.n_legs);

	// TODO are the units only changed for the output? - should I keep the internals the same?
	
	append_main_output('Leg Self Inductance       (nH): ' + 1e9 * BB.legs.leg_self_inductance);
	append_main_output('EndRing Self Inductance   (nH): ' + 1e9 * BB.endrings.er_self_inductance);
	append_main_output('Leg Mutual Inductance     (nH): ' + 1e9 * BB.legs.leg_mutual_inductance);
	append_main_output('EndRing Mutual Inductance (nH): ' + 1e9 * BB.endrings.er_mutual_inductance[BB.n_legs/4]);
	append_main_output('Calculated Capacitance    (pF): ' + 1e12 * cap);
	append_main_output('');

	document.getElementById('output_test1').innerHTML = 'Done.';



	// Mocking output from the Android app for debugging:
	debug('Leg Self Inductance       (H?): ' + BB.legs.leg_self_inductance);
	debug('EndRing Self Inductance   (H?): ' + BB.endrings.er_self_inductance);
	debug('Leg Mutual Inductance     (H?): ' + BB.legs.leg_mutual_inductance);
	debug('EndRing Mutual Inductance (H?): ' + BB.endrings.er_mutual_inductance);
	debug('Calculated Capacitance    (F?): ' + cap);

	debug(''); // keep a blank line at the end



}



function get_gui_args() {
	/* Parse DOM and populate global vars
	 *
	 * This version initializes & returns a BirdcageBuilder class object
	 *
	 * Returns populated BB object.
	 * // TODO - rename?
	 *
	 */

	// TODO - input sanitize & sanity check
	// TODO		- ideally this would be baked into the HTML so user can't submit invalid values
	// TODO		- and highlight wrong inputs in red or something so they can fix it

	// TODO var or let?
	var n_legs = document.getElementById('num_legs').value; // TODO cast to number?

	var freq = document.getElementById('center_freq').value;
	var r_coil = document.getElementById('coil_radius').value; 
	var r_shield = document.getElementById('shield_radius').value;

	//var leg_shape_rect = true; // leg shape (true=rectangle or false=tubular) TODO can probably delete!
	var leg_length = document.getElementById('leg_len').value;
	var leg_width = document.getElementById('leg_width').value;
	var leg_r_inner; // inner radius of tubular leg TODO - need to add DOM flexibility
	var leg_r_outer; // outer radius of tubular leg TODO

	
	var endring_width = document.getElementById('er_width').value;
	var endring_r_inner; // = TODO
	var endring_r_outer; // = TODO

	var coil_config = get_coil_config();
	var leg_geom = get_leg_geom();
	var endring_geom = get_endring_geom();

	debug('coil_config: '  + coil_config);
	debug('leg_geom: '     + leg_geom);
	debug('endring_geom: ' + endring_geom);

	
	// convert units (BCJ.MA)
	// TODO double check all unit conversions
	freq = mhz2hz(freq);
	r_coil = cm2meters(r_coil);
	r_shield = cm2meters(r_shield);
	leg_length = cm2meters(leg_length);
	leg_width = cm2meters(leg_width);
	leg_r_inner = cm2meters(leg_r_inner); // inner radius of tubular leg
	leg_r_outer = cm2meters(leg_r_outer); // outer radius of tubular leg
	endring_width = cm2meters(endring_width);
	endring_r_inner = cm2meters(endring_r_inner);
	endring_r_outer = cm2meters(endring_r_outer);
	// TODO stopped after BCJ.MA.280
	// TODO Predetermined Band Pass Cap value
	
	debug('hello');
	
	bb = new BirdcageBuilder(n_legs, freq, r_coil, r_shield, coil_config);
	debug(bb.to_string());
	
	//if (leg_shape_rect) {
	if (leg_geom == 'rect') {
		bb.legs.set_legs_rect(leg_length, leg_width);
		bb.endrings.set_endrings_rect(endring_width);
	}
	else if (leg_geom == 'tube') {
		bb.legs.set_legs_tube(leg_length, leg_r_inner, leg_r_outer);
		bb.endrings.set_endrings_tube(endring_r_inner, endring_r_outer);
	}
	else {
		console.log('BBGuiHandler: invalid leg_geom');
	}

	// TODO make another 'finish_setup' function in BB that does this (abstract from user?)
	bb.endrings.calc_er_mutual_inductance(bb.legs);

	return bb;
}



function get_coil_config() {
	/* Return the value (str) of the Coil Config Radio Buttons
	 * (Hi/Low/Bandpass)
	 */

	if (document.getElementById('config_lp').checked) {
		return 'lowpass';
	}
	else if (document.getElementById('config_hp').checked) {
		return 'highpass';
	}
	else if (document.getElementById('config_bp').checked) {
		return 'bandpass';
	}
	else {
		return 'INVALID';
	}
}

function get_leg_geom() {
	/* Get Leg Geometry Type 
	 *
	 * Returns string.
	 */

	if (document.getElementById('leg_rect').checked) {
		return 'rect';
	}
	else if (document.getElementById('leg_tube').checked) {
		return 'tube';
	}
	else {
		return 'INVALID';
	}

}

function get_endring_geom() {
	/* Get Endring Geometry Type 
	 *
	 * Returns string.
	 */

	if (document.getElementById('er_rect').checked) {
		return 'rect';
	}
	else if (document.getElementById('er_tube').checked) {
		return 'tube';
	}
	else {
		return 'INVALID';
	}

}


function append_main_output(s) {
	/* Append a string to the output_main DOM paragraph.
	 * Adds a <br> at the end.
	 */

	document.getElementById('output_main').innerHTML += s + '<br>';
}

function output_clear() {
	/* Clear the DEBUG_ID field */
	document.getElementById('output_main').innerHTML = '';
}
