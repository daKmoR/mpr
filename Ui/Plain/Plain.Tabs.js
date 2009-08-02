/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Ui/Plain/Plain.js');

$require('Snippets/Css/Resources/clearfix.css');
$require('Ui/Plain/Resources/Plain.Tabs.css');

Ui.Plain.Tabs = new Class({
	Implements: [Options],
	options: {
	},
	
	initialize: function(options) {
		this.setOptions(options);
	}
	
});