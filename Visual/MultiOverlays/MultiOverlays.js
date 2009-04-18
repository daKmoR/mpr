/**
 * create multiple MultiOverlay
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Visual/MultiOverlays/MultiOverlay.js');

var MultiOverlays = new Class({

	multiOverlays: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.multiOverlays.include( new MultiOverlay(el, options) );
		}, this);
	},
	
	getMultiOverlays: function() {
		return this.multiOverlays;
	}
	
});