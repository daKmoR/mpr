/**
 * create multiple MooFlow
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Galleries/MooFlow/MooFlow.js');

var MooFlows = new Class({

	mooFlows: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.mooFlows.include( new MooFlow(el, options) );
		}, this);
	},
	
	getMooFlows: function() {
		return this.mooFlows;
	}
	
});