/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Ui/Mocha/Mocha.js');

$require(MPR.path + 'Snippets/Css/Resources/clearfix.css');
$require(MPR.path + 'Ui/Mocha/Resources/Mocha.Tabs.css');

Ui.Mocha.Tabs = new Class({
	Implements: [Events, Options],
	options: {
	},
	
	initialize: function(tabs, options) {
		this.setOptions(options);
		this.attach(tabs);
	},
	
	attach: function(tabs) {
		if ( $type(tabs) == 'string' ) tabs = $$(tabs);
		if ( $type(tabs) == 'element' ) tabs = [tabs];
		
		tabs.each( function(el) {
			var inside = new Element('span', { html: el.get('html') } );
			el.empty();
			el.grab(inside);
		}, this);
	}
	
});