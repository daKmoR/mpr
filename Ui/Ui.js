/**
 * a general Ui Class to work easily with multiple themes...
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

var Ui = new Class({
	Implements: [Events, Options],
	options: {
		Tabs: { param: '.ui-tab' },
		Window: { param: '.ui-window' }
	},
	
	Uis: {},
	
	initialize: function(theme, options) {
		this.setOptions(options);
		
		$each( Ui[theme], function(el, name) {
			if( $type(el) == 'class' ) {
			  this.Uis[name] = new Ui[theme][name]( this.options[name].param, this.options[name].options );
			}
		}, this);
		
	}
	
});