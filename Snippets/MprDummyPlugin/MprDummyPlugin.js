/**
 * a simple example class for MPR. 
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

var MprDummyPlugin = new Class({
	Implements: [Options],
	options: {
		console: true
	},
	
	initialize: function(element, options) {
		this.setOptions(options);
		
		this.element = $(element) || $$(element);
	},
	
	show: function(where) {
		if( this.options.console )
			console.log( this.element );
		else
			alert( this.element );
		if( $(where) )
			$(where).adopt( this.element.clone() );
	}
	
});