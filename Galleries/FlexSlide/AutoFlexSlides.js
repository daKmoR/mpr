/**
 * create automatic MooFlows for all CSS-Classes "MooFlow"
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require('Galleries/FlexSlide/FlexSlides.js');
$require('Core/Utilities/DomReady.js');

var Auto = Auto || {};

window.addEvent('domready', function() {
	Auto.FlexSlides = new FlexSlides( '.FlexSlide' );
});