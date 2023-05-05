/* Birdcage Builder
 * 
 * Helper Functions
 *
 * Doug Brantner
 * 3 May 2023
 * NYU Langone Health
 * cai2r.net
 *
 */


/*** Unit Conversions ***/
/* The constants can be used directly, or called in functions */

// Multiplicative Constants (multiply to acheive desired result)
var CM2M = 1e-2;	// centimeters to meters
var MHZ2HZ = 1e6;	// megahertz to hertz


function cm2meters(m) {
	// Convert centimeters to meters

	return CM2M * m;
}

function mhz2hz(mhz) {
	// Convert MHz to Hertz

	return MHZ2HZ * mhz;
}






/*** Math Functions ***/


function mod(n, d) {
	/* Modulo operator
	 * Implementation Details:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
	 *
	 * The % operator is NOT the same in Javascript as in other languages;
	 * the above reference gives this implementation for the expected behavior.
	 */

	// TODO UNIT TESTS - compare with actual Java output to confirm expected behavior!!!

	return ((n % d) + d) % d;
}
