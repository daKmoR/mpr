/**
 * create automatic MultiOverlays for all CSS-Classes "MultiOverlay"
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require('Visual/MultiOverlays/MultiOverlays.js');

var Auto = Auto || {};

window.addEvent('domready', function() {
	Auto.MultiOverlays = new MultiOverlays( '.MultiOverlay' );
});