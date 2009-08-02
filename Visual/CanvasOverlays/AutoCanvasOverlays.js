/**
 * create automatic CanvasOverlays for all CSS-Classes "CanvasOverlay"
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require('Visual/CanvasOverlays/CanvasOverlays.js');

var Auto = Auto || {};

window.addEvent('load', function() {
	Auto.CanvasOverlays = new CanvasOverlays( '.CanvasOverlay' );
});