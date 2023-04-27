/* Birdcage Builder
 *
 * Debug Helpers
 *
 * Doug Brantner
 * 27 April 2023
 * NYU Langone Health
 * cai2r.net
 *
 * Based on Android implementation of BirdcageBuilder by Giuseppe Carluccio & Christopher Collins.
 */


//var DEBUG_ENABLE = true; // bool; enable or disable debug printing to DOM
//var DEBUG_ID = 'debug1'; // DOM ID for debug output
// set these in GUI handler:
// TODO make this a class?
var DEBUG_ENABLE; // bool; enable or disable debug printing to DOM
var DEBUG_ID; // DOM ID for debug output

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
