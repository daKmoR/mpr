/**
 * a nice visual effect of writing (original idea by david walsh)
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

var Typewriter = new Class({
	Implements: [Options],
	options: {
		message: '',
		duration: 150,
		cursor: 0,
		auto: true,
		step: 1
	},
	
	autotimer: $empty,
	container: $empty,
	
	initialize: function(element, options) {
		this.setOptions(options);
		this.container = $(element);
		this.options.message = this.options.message || this.container.get('html');
		
		this.reset();
		if (this.options.auto) this.auto();
	},
	
	auto: function() {
		$clear(this.autotimer);
		this.autotimer = this.setLetter.delay(this.options.duration, this);
	},
	
	reset: function() {
		this.container.set('html', '');
		this.options.cursor = 0;
		if (this.options.auto) this.auto();
	},
	
	setLetter: function(cursor) {
		if (cursor) this.options.cursor = cursor;
		this.container.set('html', this.options.message.substring(0, this.options.cursor) );
		this.options.cursor += this.options.step;
		if (this.options.auto) this.auto();
	}
	
});