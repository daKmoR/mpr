/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Ui/Mocha/Mocha.js');

$require('Snippets/Css/Resources/clearfix.css');
$require('Ui/Mocha/Resources/Mocha.Tabs.css');

Ui.Mocha.Tabs = new Class({
	Implements: [Options],
	options: {
		refactor: {
			options: {		
				onUiAttach: function(el, i) {
					if ( (typeof(UI) !== 'undefined') && ( typeof(UI.Uis.Tabs) !== 'undefined' ) ) {
						UI.Uis.Tabs.attach( $(el) );
					}
				}
			}
		}
	
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