/**
 * create multiple CanvasOverlays
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Visual/CanvasOverlays/CanvasOverlay.js');

var CanvasOverlays = new Class({

	canvasOverlays: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.canvasOverlays.include( new CanvasOverlay(el, options) );
		}, this);
	},
	
	getCanvasOverlays: function() {
		return this.canvasOverlays;
	}
	
});