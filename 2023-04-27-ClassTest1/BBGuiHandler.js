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

	debug("n_legs = " + BB.n_legs);

	//init_legs(n_legs, r_coil);
	//if (leg_shape_rect) {
	//	leg_self_ind = calc_leg_self_inductance_rect(leg_length, leg_width);
	//	}
	//else {
	//	leg_self_ind = calc_leg_self_inductance_tube(leg_length, leg_r_inner, leg_r_outer);
	//}

	debug('Leg Self Inductance: ' + BB.legs.leg_self_inductance);
	debug('Leg Mutual Inductance: ' + BB.legs.leg_mutual_inductance);
}



function get_gui_args() {
	/* Parse DOM and populate global vars
	 *
	 * This version initializes & returns a BirdcageBuilder class object
	 *
	 * TODO - returns populated BB object now - does that make sense?
	 *
	 */

	// TODO - input sanitize & sanity check
	// TODO - ideally this would be baked into the HTML so user can't submit invalid values
	//		- and highlight wrong inputs in red or something so they can fix it

	// TODO fix units/convert to internal units
	// TODO var or let?
	var n_legs = document.getElementById('num_legs').value; // TODO cast to number?

	var freq = document.getElementById('center_freq').value;
	var r_coil = document.getElementById('coil_radius').value; 
	var r_shield = document.getElementById('shield_radius').value;

	var leg_shape_rect = true; // leg shape (true=rectangle or false=tubular) TODO implement this!
	var leg_length = document.getElementById('leg_len').value;
	var leg_width = document.getElementById('leg_width').value;
	//leg_r_inner; // inner radius of tubular leg TODO - need to add DOM flexibility
	//leg_r_outer; // outer radius of tubular leg TODO
	//
	
	debug('hello');
	
	bb = new BirdcageBuilder(n_legs, freq, r_coil, r_shield);
	debug(bb.to_string());
	
	if (leg_shape_rect) {
		bb.legs.set_legs_rect(leg_length, leg_width);
	}
	else {
		bb.legs.set_legs_tube(leg_length, leg_r_inner, leg_r_outer);
	}


	return bb;
}





