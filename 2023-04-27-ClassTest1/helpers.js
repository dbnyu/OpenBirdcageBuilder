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
