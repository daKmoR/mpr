/**
 * FlexBoxes - create multiple FlexBoxes for a css array
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexBox/FlexBox.js');

var FlexBoxes = new Class({

	flexBoxes: [],
	
	initialize: function(elements, options) {
		elements = $$(elements)
		elements.each( function(el) {
			this.flexBoxes.include( new FlexBox(el, elements, options) );
		}, this);
	},
	
	getFlexBoxes: function() {
		return this.flexBoxes;
	}
	
});