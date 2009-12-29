/**
 * create multiple FlexSlides
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require('Galleries/FlexSlide/FlexSlide.js');

var FlexSlides = new Class({

	flexSlides: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.flexSlides.include( new FlexSlide(el, options) );
		}, this);
	},
	
	getFlexSlides: function() {
		return this.flexSlides;
	}
	
});