/**
 * create automatic MooFlows for all CSS-Classes "MooFlow"
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require('Galleries/MooFlow/MooFlows.js');

var Auto = Auto || {};

window.addEvent('domready', function() {
	Auto.MooFlows = new MooFlows( '.MooFlow' );
});