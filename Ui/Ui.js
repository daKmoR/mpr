/**
 * a general Ui Class to work easily with multiple themes...
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Mutators/Mutators.Singleton/Mutators.Singleton.js');

var Ui = new Class({
	Implements: [Events, Options],
	options: {
		theme: ''
	},
	
	Uis: {},
	
	initialize: function(options) {
		if( $type(options) == 'object' )
			this.setOptions(options);
			
		if( $type(options) == 'string' )
			this.options.theme = options;
		
		if(this.options.theme != '')
			this.renderTheme(this.options.theme);
	},
	
	render: function(options) {
		this.initialize(options);
	},
	
	renderTheme: function(theme) {
		$each( Ui[theme], function(el, name) {
			if( $type(el) == 'class' ) {
			  this.Uis[name] = new Ui[theme][name]( this.options[name].param, this.options[name].options );
			}
		}, this);
	},
	
	registerClass: function(options) {
		this.setOptions(options);
	}
	
});

var UI = new Ui();