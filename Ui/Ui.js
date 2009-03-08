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
				if(this.Uis[name].options.refactor) {
					//this.options.Windows.name.refactor( this.Uis[name].options.refactor );
					console.log( this.options.Windows.name );
					
					if( this.options.Windows.name == 'FlowWindows') {
						FlowWindows.refactor( this.Uis[name].options.refactor );
					}
					
				}
				
			}
		}, this);
	},
	
	registerClass: function(options) {
		this.setOptions(options);
		//console.log(this.options.Windows['class']);
	}
	
});

var UI = new Ui();

