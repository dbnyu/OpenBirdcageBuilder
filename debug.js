/* Birdcage Builder
 *
 * Debug Helpers
 *
 * Douglas Brantner
 * 27 April 2023
 * NYU Langone Health
 * cai2r.net
 */

// set these in GUI handler:
// TODO make this a class?
var DEBUG_ENABLE = false; // bool; enable or disable debug printing to DOM
var DEBUG_ID; // DOM ID for debug output
var DEBUG_OUTPUT = "CONSOLE"; // 'CONSOLE' or 'DOM' or 'BOTH'
	// adding console option for production

function debug(s) {
	/* Append a string s to the DEBUG_ID DOM element if global DEBUG_ENABLE is true
	 * UPDATE: follows the DEBUG_OUTPUT global and prints to console and/or DOM
	 *
	 *	s = string to print
	 *
	 *	Automatically adds a newline/<br> tag to create a new line for DOM output
	 */

	if (DEBUG_ENABLE) {
		if (DEBUG_OUTPUT === "CONSOLE" || DEBUG_OUTPUT === "BOTH") {
			console.log(s);
		}
		if (DEBUG_OUTPUT === "DOM" || DEBUG_OUTPUT === "BOTH") {
			document.getElementById(DEBUG_ID).innerHTML += s + '<br>';
		}
	}
}

function debug1 (s) {
	/* print 1 debug statement with NO newline at the end 
	 * (DOM only)
	 *
	 */
	if (DEBUG_ENABLE) {
		document.getElementById(DEBUG_ID).innerHTML += s;
	}
}


function debug_clear() {
	/* Clear the DEBUG_ID field (DOM only) */
	document.getElementById(DEBUG_ID).innerHTML = '';
}
