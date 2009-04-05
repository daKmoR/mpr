/**
 * a nice visual effect of writing
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		david walsh
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

var Typewriter = new Class({
	Implements: [Options],
	options: {
		message: '',
		delay: 150,
		cursor: 0
	},
	
	container: $empty,
	
	initialize: function(element, options) {
		this.container = $(element);
		this.options.message = this.container.get('html');
		
		this.setOptions(options);
		this.reset();
	},
	
	reset: function() {
		this.container.set('html', '');
		this.options.cursor = 0;
		this.start();
	},
	
	start: function() {
		//for every letter
		for(x = 0; x < this.options.message.length; x++) {
			var id = this.setLetter.delay(this.options.delay * x,this);
		}
	},
	
	//place the newest letter in the container
	setLetter: function() {
		this.container.set('html', this.container.get('html') + '' + this.options.message.charAt(this.options.cursor) );
		this.options.cursor++;
	}
	
});
