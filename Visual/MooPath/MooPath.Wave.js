/*
Class: MooPath.Wave
	Move objects over a wave

Arguments:
	elements  - the elements to arrange
	options   - optional

Options:
	see MooPath and
	wave      - object with width and height of the wave
	factor    - objects far away look smaller
*/

$require('Visual/MooPath/MooPath.js');

MooPath.Wave = new Class({

	Extends: MooPath,

	options: {
		wave: {x: 500, y: 200},
		factor: 0.7
	},

	set: function(el, position) {
		// Set the styles of the element at position
		var origsize = el.retrieve(this.options.origsize);
		var b = this.options.wave.y/2;

		// 0-1 scale to 0-2pi
		positionpi = 2 * Math.PI * position;

		var newy = b + b * Math.sin(positionpi - 0.5 * Math.PI);
		var factor = this.realFactor(newy);
		var point = {
			x: this.options.wave.x * position,
			y: newy
		};
		el.setStyles({
			'bottom':  Math.round(point.y),
			'left':    Math.round(point.x - (origsize.x / 2)),
			'width':   Math.round(origsize.x * factor),
			'height':  Math.round(origsize.y * factor),
			'z-index': this.options.wave.y - Math.round(point.y)
		});
	},

	realFactor: function(posy) {
		// Get the factor that aplies on position posy
		return ((this.options.wave.y - posy) * (1 - this.options.factor) / this.options.wave.y) + this.options.factor;
	}
});