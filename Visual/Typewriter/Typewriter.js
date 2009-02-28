/**
 * a nice visual effect of writing
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		david walsh
 * @copyright Copyright belongs to the respective authors
 */
 
var Typewriter = new Class({
	Implements: [Options],
	options: {
		container: $$('body')[0],
		message: '',
		delay: 150,
		cursor: 0
	},
	
	initialize: function(options) {
		this.setOptions(options);
	},
	
	start: function() {
		//for every letter
		for(x = 0; x < this.options.message.length; x++) {
			var id = this.setLetter.delay(this.options.delay * x,this);
		}
	},
	
	//place the newest letter in the container
	setLetter: function() {
		this.options.container.set('html',this.options.container.get('html') + '' + this.options.message.charAt(this.options.cursor));
		this.options.cursor++;
	}
});
