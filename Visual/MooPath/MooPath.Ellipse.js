/*
Class: MooPath.Ellipse
	Move objects over an ellipse

Arguments:
	elements  - the elements to arrange
	options   - optional

Options:
	see MooPath and
	ellipse   - object with width and height of the ellipse
	factor    - objects far away look smaller
*/

$require('Visual/MooPath/MooPath.js');

MooPath.Ellipse = new Class({

	Extends: MooPath,

	options: {
		ellipse: {x: 500, y: 300},
		factor: 0.7,
		useOpacity: true
	},

	set: function(el, position) {
		// Set the styles of the element at position
		var origsize = el.retrieve(this.options.origsize);
		var a = this.options.ellipse.x/2;
		var b = this.options.ellipse.y/2;

		// 0-1 scale to 0-2pi
		position = 2 * Math.PI * position;

		var newy = b + b * Math.sin(position - 0.5 * Math.PI);
		var factor = this.realFactor(newy);
		var point = {
			x: a + (a * Math.sin(position-Math.PI) * factor),
			y: newy
		};
		
		var values = {
			'bottom':  Math.round(point.y),
			'left':    Math.round(point.x - (origsize.x * factor / 2)),
			'z-index': this.options.ellipse.y - Math.round(point.y)
		};
		
		var imageValues = {
			'width':   Math.round(origsize.x * factor),
			'height':  Math.round(origsize.y * factor)
		};
		if( this.options.useOpacity ) {
			imageValues.opacity = ((this.options.ellipse.y-point.y) / this.options.ellipse.y).round(1);
		}
		
		
		var tmp = el.getElement('img');
		if( $defined(tmp) ) {
			tmp.setStyles(imageValues);
		} else {
			$extend(values, imageValues);
		}
		
		el.setStyles(values);
	},

	realFactor: function(posy) {
		// Get the factor that aplies on position posy
		return ((this.options.ellipse.y - posy) * (1 - this.options.factor) / this.options.ellipse.y) + this.options.factor;
	},

	movement: function(el) {
		// Calculate movement diff (current position + diff = new position)
		var diff = el.retrieve(this.options.position);
		while (diff < 0) diff += this.maxposition;
		while (diff >= this.maxposition) diff -= this.maxposition;

		// Reverse direction
		if (diff >= this.maxposition / 2) {
			diff -= this.maxposition;
		}

		return diff;
	}
});