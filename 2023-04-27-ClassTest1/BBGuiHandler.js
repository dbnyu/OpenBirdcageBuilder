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
DEBUG_OUTPUT = 'CONSOLE'; // set to CONSOLE only for production; BOTH or DOM for testing is ok
DEBUG_ID = 'debug1'; // DOM ID for debug output (not used in production)
ROUND_OUTPUT = true; // true/false - round displayed output or not
ROUND_N_DIGITS = 4; // number of decimal places to round to (if ROUND_OUTPUT is true)
PLOTLY_ENABLE = false;



/********************
 *  MAIN FUNCTIONS  *
 ********************/
//debug('BBGuiHandler loaded.');


function calculate() {

	reset_output_table("--"); // clear old results (if any)
	
	BB = get_gui_args();
	cap = BB.calc_capacitor();

	debug("n_legs = " + BB.n_legs);

	// convert units for final output:
	var disp_leg_self_ind = 1e9 * BB.legs.leg_self_inductance;
	var disp_er_self_ind  = 1e9 * BB.endrings.er_self_inductance;
	var disp_leg_mut_ind  = 1e9 * BB.legs.leg_mutual_inductance;
	var disp_er_mut_ind   = 1e9 * BB.endrings.er_mutual_inductance[BB.n_legs/4];
	var disp_calc_cap     = 1e12 * cap;
	
	// print full precision to console before rounding
	debug('Leg Self Inductance       (H?): ' + disp_leg_self_ind  );
	debug('EndRing Self Inductance   (H?): ' + disp_er_self_ind   );
	debug('Leg Mutual Inductance     (H?): ' + disp_leg_mut_ind   );
	debug('EndRing Mutual Inductance (H?): ' + disp_er_mut_ind    );
	debug('Calculated Capacitance    (F?): ' + disp_calc_cap      );
	debug(''); // keep a blank line at the end

	if (ROUND_OUTPUT) {
		// NOTE: this converts numbers to STRINGS:
		disp_leg_self_ind = disp_leg_self_ind.toFixed(ROUND_N_DIGITS);
		disp_er_self_ind  = disp_er_self_ind.toFixed(ROUND_N_DIGITS);
		disp_leg_mut_ind  = disp_leg_mut_ind.toFixed(ROUND_N_DIGITS);
		disp_er_mut_ind   = disp_er_mut_ind.toFixed(ROUND_N_DIGITS);
		disp_calc_cap     = disp_calc_cap.toFixed(ROUND_N_DIGITS);
	}

	// fill in Results table:
	document.getElementById("leg_si").innerHTML = disp_leg_self_ind;
    document.getElementById("er_si").innerHTML =  disp_er_self_ind;
	document.getElementById("leg_mi").innerHTML = disp_leg_mut_ind;
	document.getElementById("er_mi").innerHTML =  disp_er_mut_ind;
	document.getElementById("calc_cap").innerHTML = disp_calc_cap;

	//document.getElementById("leg_si").innerHTML = 1e9 * BB.legs.leg_self_inductance;
    //document.getElementById("er_si").innerHTML = 1e9 * BB.endrings.er_self_inductance;
	//document.getElementById("leg_mi").innerHTML = 1e9 * BB.legs.leg_mutual_inductance;
	//document.getElementById("er_mi").innerHTML = 1e9 * BB.endrings.er_mutual_inductance[BB.n_legs/4];
	//document.getElementById("calc_cap").innerHTML = 1e12 * cap;




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
	/* Parse DOM and populate BirdcageBuilder object (including Leg and Endring child objects) 
	 *
	 * Returns populated BB object.
	 */

	// TODO - input sanitize & sanity check
	// TODO		- ideally this would be baked into the HTML so user can't submit invalid values
	// TODO		- and highlight wrong inputs in red or something so they can fix it

	// TODO var or let?
	var n_legs = Number(document.getElementById('num_legs').value);

	var freq = Number(document.getElementById('center_freq').value);
	var r_coil = Number(document.getElementById('coil_radius').value); 
	var r_shield = Number(document.getElementById('shield_radius').value);

	var leg_length = Number(document.getElementById('leg_len').value);
	var leg_width = Number(document.getElementById('leg_width').value);
	var leg_r_inner = Number(document.getElementById('leg_ID').value);
	var leg_r_outer = Number(document.getElementById('leg_OD').value);
	
	var endring_width = Number(document.getElementById('er_width').value);
	var endring_r_inner = Number(document.getElementById('er_ID').value);
	var endring_r_outer = Number(document.getElementById('er_OD').value);

	var predcap = Number(document.getElementById('bp_predcap').value);

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
	predcap *= 1e-12; // TODO make this a function
	


	bb = new BirdcageBuilder(n_legs, freq, r_coil, r_shield, coil_config);
	debug(bb.to_string());


	
	// TODO change to ===?
	if (leg_geom == 'rect') {

		bb.legs.set_legs_rect(leg_length, leg_width);

		//console.log("leg_length: " + leg_length);
		//console.log("leg_width: " + leg_width);
	}
	else if (leg_geom == 'tube') {

		bb.legs.set_legs_tube(leg_length, leg_r_inner, leg_r_outer);

		//console.log("leg_length: " + leg_length);
		//console.log("leg_r_inner: " + leg_r_inner);
		//console.log("leg_r_outer: " + leg_r_outer);
	}
	else {
		console.warning('BBGuiHandler: invalid leg_geom');
	}


	if (endring_geom == 'rect') {
		bb.endrings.set_endrings_rect(endring_width);
	}
	else if (endring_geom == 'tube') {
		bb.endrings.set_endrings_tube(endring_r_inner, endring_r_outer);
	}
	else {
		console.warning('BBGuiHandler: invalid endring_geom');
	}

	// TODO make another 'finish_setup' function in BB that does this (abstract from user?)
	bb.endrings.calc_er_mutual_inductance(bb.legs);


	if (coil_config == 'bandpass_leg' || coil_config == 'bandpass_er') {
		bb.predcap = predcap;
	}



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
	else if (document.getElementById('config_bp_leg').checked) {
		return 'bandpass_leg';
	}
	else if (document.getElementById('config_bp_er').checked) {
		return 'bandpass_er';
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
	// Enable/disable leg width/inner/outer diameter inputs based on radio button state

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
	// Enable/disable endring width/inner/outer diameter inputs based on radio button state

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


function update_coil_config(radiobtn) {
	// Enable/disable predefined capacitor field based on coil config radio button state

	if (radiobtn.value === "lowpass" || radiobtn.value === "highpass") {
		document.getElementById("bp_predcap").disabled = true;
	}
	else if (radiobtn.value === "bandpass_leg" || radiobtn.value === "bandpass_er") {
		document.getElementById("bp_predcap").disabled = false;
		// TODO - add input validation here? so it only turns red if/after bandpass is selected?
		// OR TODO can 'disabled' CSS take precedence over input validation error CSS?
	}

}



function append_main_output(s) {
	/* Append a string to the output_main DOM paragraph.
	 * Adds a <br> at the end.
	 */

	document.getElementById('output_main').innerHTML += s + '<br>';
}

function output_clear() {
	/* Clear the (deprecated) output field */
	document.getElementById('output_main').innerHTML = '';
}

function reset_output_table(s) {
	/* Reset output in new twble format 
	 * (just writes the same string to all output fields in table)
	 *
	 * s = string to overwrite table data with
	 *
	 * */
	document.getElementById("leg_si").innerHTML = s;
    document.getElementById("er_si").innerHTML =  s;
	document.getElementById("leg_mi").innerHTML = s;
	document.getElementById("er_mi").innerHTML =  s;
	document.getElementById("calc_cap").innerHTML = s;
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
