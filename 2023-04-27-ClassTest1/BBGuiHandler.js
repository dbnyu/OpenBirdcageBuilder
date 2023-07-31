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
PLOTLY_ENABLE = false;



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


	// Plots
	if (PLOTLY_ENABLE) {
		try {
			plotly_leg_currents(BB.legs, 'plotly_ILegs');
			plotly_cross_section(BB.legs, 'plotly_crossSection');
			plotly_endring_currents(BB.legs, BB.endrings, 'plotly_Iendrings');
			plotly_leg_inductance(BB.legs, 'plotly_leg_inductance');
		}
		catch ({name, message}) {
			console.warn('Exception in BBGuihandler plotting');
			console.log('(probably plotly is not available)');
			console.log(name);
			console.log(message);
		}
	}
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
	var n_legs = Number(document.getElementById('num_legs').value);

	var freq = Number(document.getElementById('center_freq').value);
	var r_coil = Number(document.getElementById('coil_radius').value); 
	var r_shield = Number(document.getElementById('shield_radius').value);

	//var leg_shape_rect = true; // leg shape (true=rectangle or false=tubular) TODO can probably delete!
	var leg_length = Number(document.getElementById('leg_len').value);
	var leg_width = Number(document.getElementById('leg_width').value);
	var leg_r_inner; // inner radius of tubular leg TODO - need to add DOM flexibility
	var leg_r_outer; // outer radius of tubular leg TODO

	
	var endring_width = Number(document.getElementById('er_width').value);
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
	// TODO XXX Predetermined Band Pass Cap value * 1e-12
	
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
		// TODO XXX - BUG - endring shape is not always the same as leg shape!!!
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

	// TODO do we need a 4th category for bandpass for cap on leg/ER?
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

/* update form inputs for rectangular/tube legs & endrings
 * Just gray out/disable & enable the appropriate input fields
 */

function update_leg_geom_inputs(radiobtn) {
	if (radiobtn.value === "leg_rect") {
		document.getElementById("leg_ID").disabled = true;
		document.getElementById("leg_OD").disabled = true;
		document.getElementById("leg_width").disabled = false;
	}
	else if (radiobtn.value === "leg_tube") {
		document.getElementById("leg_ID").disabled = false;
		document.getElementById("leg_OD").disabled = false;
		document.getElementById("leg_width").disabled = true;
	}
	else {
		debug("BBGuiHandler update_leg_geom_inputs: invalid leg type input");
	}
}


function update_er_geom_inputs(radiobtn) {
	if (radiobtn.value === "er_rect") {
		document.getElementById("er_ID").disabled = true;
		document.getElementById("er_OD").disabled = true;
		document.getElementById("er_width").disabled = false;
	}
	else if (radiobtn.value === "er_tube") {
		document.getElementById("er_ID").disabled = false;
		document.getElementById("er_OD").disabled = false;
		document.getElementById("er_width").disabled = true;
	}
	else {
		debug("BBGuiHandler update_er_geom_inputs: invalid er type input");
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





/*** Plotly Plots ***/

function circle(r) {
	/* Return an x, y array of a circle of points with radius r.
	 *
	 * TODO - input # of points etc.
	 *
	 */

	var n = 100; // # of points	
	const x = new Array(n);
	const y = new Array(n);
	
	var i, theta;
	for (i = 0; i < n; i++) {
		theta = i*2*Math.PI/n;
		x[i] = r*Math.cos(theta);
		y[i] = r*Math.sin(theta);
	}

	return [x, y];
}


function plotly_cross_section(legs, div) {
	/* Plot leg & shield cross section (leg x,y positions)
	 *
	 */

	legs_gt = circle(legs.r_coil);
	shield_gt = circle(legs.r_shield);

	var data = [{x: legs.leg_x, 
				 y: legs.leg_y,
				 mode: "lines+markers",
				 name: "Leg Positions"
			    },

				{x: legs.shield_x,
				 y: legs.shield_y,
				 mode: "lines+markers",
				 name: "Shield Image Positions"
				},

				{x: legs_gt[0],
				 y: legs_gt[1],
				 mode: "lines",
				 //marker: {color: 'black'},
				 line: {color: 'gray',
						dash: "dot"
						},
				 name: "Expected Coil Radius"
				},

				{x: shield_gt[0],
				 y: shield_gt[1],
				 mode: "lines",
				 //marker: {color: 'black'},
				 line: {color: 'gray',
						dash: "dash"
						},
				 name: "Shield Radius (E-field should be 0 here)"
				},
				// TODO label rungs w/ index
				//{x: [0, legs.leg_x[0]], // draw a line to first rung (k=0)
				// y: [0, legs.leg_y[0]],
				// mode: "lines",
				// name: "Leg 0"
				//}
	];

	var layout = {xaxis: {title: "X Position (m?)"},
				  yaxis: {title: "Y Position (m?)", scaleanchor: "x", scaleratio: 1.0},
				  title: "Leg & Shield Positions (n=" + legs.n_legs + ")"
				 };

	Plotly.newPlot(div, data, layout);
}


function plotly_leg_currents(legs, div) {
	/* Plot Leg Currents vs. leg angle
	 *
	 * legs = fully populated BCLegs object
	 * div = string, name of the HTML div to plot in
	 *
	 * See https://www.w3schools.com/js/tryit.asp?filename=tryai_plotly_scatter
	 */

	var data = [{x: legs.theta, 
				 y: legs.leg_currents, 
				 mode: "lines+markers",
				 name: "Leg Currents"
			    },
				{x: legs.theta,
				 y: legs.shield_currents,
				 mode: "lines+markers",
				 name: "Shield Currents"
				}

	];

	var layout = {xaxis: {title: "Angle (rad)"},
				  yaxis: {title: "Current (A?)"},
				  title: "Leg & Shield Currents (n=" + legs.n_legs + ")"
				 };

	Plotly.newPlot(div, data, layout);
}


function plotly_endring_currents(legs, er, div) {
	/* Plot endring currents & mutual inductance
	 *
	 *  legs = BCLegs object, fully populated (for angles)
	 *	er = BCEndrings object, fully populated
	 *	div = string div id for the plot
	 *
	 */

	// TODO - do we need to offset the endring segments by 1/2 arclen (1/2 theta step) for correct visualizatin?


	var data = [{x: legs.theta,
				 y: er.er_currents,
				 mode: "lines+markers",
				 name: "EndRing Currents"
			    },
				{x: legs.theta,
				 y: er.er_mutual_inductance,
				 yaxis:"y2",
				 mode: "lines+markers",
				 name: "EndRing Mutual Inductance"
				}

	];


	var layout = {xaxis: {title: "Angle (rad)"},
				  yaxis: {title: "Current (A?)"}, // TODO inductance
				  yaxis2: {title: "Inductance (H?)",  
					      titlefont: {color: 'rgb(148, 103, 189)'},
					      tickfont: {color: 'rgb(148, 103, 189)'},
					      overlaying: 'y',
					      side: 'right'
						  },
				  title: "EndRing Currents TBD (n=" + legs.n_legs + ")"
				 };
	// TODO adjust overlapping legend & 2nd yaxis


	Plotly.newPlot(div, data, layout);
}


function plotly_leg_inductance(legs, div) {
	/* Plot each component of the leg & shield mutual inductance
	 * (using specially stored arrays, of each part of the summation)
	 *
	 * legs = fully populated BCLegs with extra inductance arrays
	 * div = HTML div name
	 *
	 */

	var data = [{x: legs.theta,
				 y: legs._leg_mutual_inductances,
				 mode: "lines+markers",
				 name: "Leg Mutual Inductance"
			    },
				{x: legs.theta,
				 y: legs._shield_mutual_inductances,
				 //yaxis:"y2",
				 mode: "lines+markers",
				 name: "Shield Mutual Inductance"
				}

	];


	var layout = {xaxis: {title: "Angle (rad)"},
				  yaxis: {title: "Inductance (H?)"}, // TODO inductance
				//  yaxis2: {title: "Inductance (H?)",  
				//	      titlefont: {color: 'rgb(148, 103, 189)'},
				//	      tickfont: {color: 'rgb(148, 103, 189)'},
				//	      overlaying: 'y',
				//	      side: 'right'
				//		  },
				  title: "Leg Mutual Inductance Components (n=" + legs.n_legs + ")"
				 };

	Plotly.newPlot(div, data, layout);
}
