/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Ui/Ui.js');

$require(MPR.path + 'Snippets/Css/Resources/clearfix.css');
$require(MPR.path + 'Ui/Plain/Resources/Plain.Tabs.css');

var Ui = {};
Ui.Plain = {};
Ui.Plain.Tabs = new Class({
	Implements: [Events, Options],
	options: {

	},
	
	initialize: function(tabs, options) {
		this.setOptions(options);
		//this.attach(tabs);
	},
	
	attach: function(tabs) {
	
		$$(tabs).each( function(el) {
			
		
		});
	
	}
	
	
});