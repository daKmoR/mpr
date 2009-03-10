/**
 * a general Ui Class to work easily with multiple themes...
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'More/Class.Refactor/Class.Refactor.js');
 
var Ui = new Class({
	Implements: [Events, Options],
	options: {
		theme: ''
	},
	
	Uis: {},
	
	initialize: function(options) {
	},
	
	render: function(theme, options) {
		if( $type(theme) == 'object' )
			this.setOptions(theme);
			
		if( $type(theme) == 'string' )
			this.options.theme = theme;
			
		if( $type(options) == 'object' )
			this.setOptions(options);
		
		if(this.options.theme != '')
			this.renderTheme(this.options.theme);
	},
	
	renderTheme: function(theme) {
		$each( Ui[theme], function(el, name) {
			if( $type(el) == 'class' ) {
			  this.Uis[name] = new Ui[theme][name]( this.options[name].param, this.options[name].options );
				
				if( this.Uis[name].options.refactor ) {
					if( typeof( this.options[name]['class'] ) !== 'undefined' ) {
						this.options[name]['class'].setOptions( this.Uis[name].options.refactor.options );
						this.options[name]['class'].fireEvent('onUiInit');
					} else if( this.options[name].name ) {
						//eval(this.options[name].name).refactor( this.Uis[name].options.refactor );  //only works with eval?
						var tmp = window;
						this.options[name].name.split('.').each( function(el) {
							tmp = tmp[el];
						});
						tmp.refactor( this.Uis[name].options.refactor );
					}
				}
			}
		}, this);
	},
	
	registerClass: function(options) {
		this.setOptions(options);
	}
	
});

var UI = new Ui();