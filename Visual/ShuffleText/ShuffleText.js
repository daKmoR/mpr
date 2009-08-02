$require('Snippets/Array/Array.shuffle.js');

var ShuffleText = new Class({
	Implements: [Events, Options],
	options: {
		onStart: $empty,
		onComplete: $empty,
		duration: 300,
		fps: 50
	},
	initialize: function(el, options) {
		this.setOptions(options);
		this.options.duration = this.options.duration.toInt();
		this.el = $(el);
	},
	shuffle: function() {
		if( !this.el ) return;
		var time = $time();
		if (time < this.time + this.options.duration) {
			var shuffledText = this.text.shuffle().join('');
			this.el.set('text', shuffledText);
		}
		else {
			this.el.set('text', this.oriText);
			this.complete();
		}
	},
	start: function() {
		if (this.timer || !this.el) return this;
		this.oriText = this.el.get('text');
		this.text = this.oriText.split('');
		this.time = 0;
		this.startTimer();
		this.onStart();
		return this;
	},
	complete: function() {
		return (!this.stopTimer()) ? this: this.onComplete();
	},
	onStart: function() {
		return this.fireEvent('onStart');
	},
	onComplete: function() {
		return this.fireEvent('onComplete');
	},
	stopTimer: function() {
		if (!this.timer) return false;
		this.timer = $clear(this.timer);
		return true;
	},
	startTimer: function() {
		if (this.timer) return false;
		this.time = $time() - this.time;
		this.timer = this.shuffle.periodical(Math.round(1000 / this.options.fps), this);
		return true;
	}
});