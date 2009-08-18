/*
Script: MooPath-0.1.js
	MooPath version 0.1 19-09 2008

License:
	MIT-style license.

Copyright:
	Copyright 2008
	Sjors van der Pluijm
	http://www.desjors.nl/blog

See also:
	http://mootools.net

Usage:
	window.addEvent('domready', function() {
		new MooPath.Ellipse($$('div.myelements'), {
			show: 2,
			ellipse: {x: 400, y: 400},
			factor: 0.8,
			fxoptions: {
				duration: 1000
			}
		});
	});
*/


$require('Core/Element/Element.Dimensions.js');
$require('Core/Element/Element.Style.js');
$require('Core/Utilities/Selectors.js');

$require('Core/Fx/Fx.Tween.js');
$require('Core/Fx/Fx.Morph.js');
$require('Core/Fx/Fx.Transitions.js');

/*
Class: Fx.Any
	Fx.Any is a hack of Fx.Elements to add custom properties to change. 
	Each property has a callback function that takes the element and the current value of 
	the property as its arguments.
	Callback example: {myname: function(el, value) {el.setStyle('height', value);}}

Arguments:
	elements  - see Fx.Elements
	callbacks - an object of callbacks
	options   - optional, see Fx.Elements
*/
Fx.Any = new Class({

	Extends: Fx.Elements,

	initialize: function(elements, callbacks, options) {
		this.callbacks = callbacks || {};
		this.parent(elements, options);
	},

	render: function(element, property, value) {
		if (this.callbacks[property]) {
			this.callbacks[property](element, value[0]['value']);
		} else {
			this.parent(element, property, value);
		}
	}
});

/*
Class: MooPath
	To use MooPath you need to subclass it and add the method 'set' which will
	set the position of the element at a point

Arguments:
	elements  - the elements to arrange
	options   - optional

Options:
	show      - the element to show at start (int)
	fxoptions - options, see Fx.Elements
*/
var MooPath = new Class({

	Implements: [Options],

	maxposition: 1,

	options: {
		show: 0,
		fxoptions: {},
		position: 'position',
		origsize: 'origsize'
	},

	initialize: function(elements, options) {
		this.setOptions(options);
 		this.elements = elements;
 		this.curel = this.options.show;

		this.fx = new Fx.Any(this.elements, {pathpoint: this.set.bind(this)}, this.options.fxoptions);

		var numelements = this.elements.length;
 		this.elements.each(function(el, i) {
 			el.store(this.options.origsize,  el.getSize());

			// Position element on path
			if (!el.retrieve(this.options.position)) {
				el.store(this.options.position, (i - this.curel) / numelements);
			}
			this.set(el, el.retrieve(this.options.position));

			el.addEvent('click', function(e) {
				if( i !== this.curel ) {
					e.stop();
					this.display(i);
					el.blur();
				}
			}.bind(this) );
 		}, this);
	},
	
	/*
	Property: turn
		Do a full animation from position 0 to position 1
		
	Arguments:
		numrounds - integer, number of rounds

	Example:
		(start code)
		new MooPath.Ellipse($$('a')).turn(2);
		(end)
	*/
	turn: function(numrounds) {
		var diff = numrounds * this.maxposition * -1;
		var obj = {};
		this.elements.each(function(el, i) {
			var curpos = el.retrieve(this.options.position);
			obj[i] = {pathpoint: [curpos, curpos - diff]};
			el.store(this.options.position, curpos - diff);
		}, this);
		this.fx.start(obj);
	},

	/*
	Property: display
		Brings the element to position 0 (front).
		
	Arguments:
		idx - integer, the index of the item to show, or the actual element to show.

	Example:
		(start code)
		new MooPath.Ellipse($$('a')).display(1);
		(end)
	*/
	display: function(idx) {
		if ($type(idx) == 'element') {
		 	this.curel = idx = this.elements.indexOf(idx);
		} else if ($type(idx) == 'string') {
			if (idx == 'next') {
				this.curel--;
				idx = this.elements[this.curel]?this.curel:this.elements.length-1;
			} else if (idx == 'previous') {
				this.curel++;
				idx = this.elements[this.curel]?this.curel:0;
			}
		} else {
			this.curel = idx;
		}

		var diff = this.movement(this.elements[idx]);
		if (diff == 0) return;

		var obj = {};
		this.elements.each(function(el, i) {
			var curpos = el.retrieve(this.options.position);
			obj[i] = {pathpoint: [curpos, curpos - diff]};
			el.store(this.options.position, curpos - diff);
		}, this);

		this.fx.start(obj);
	},

	movement: function(el) {
		// Calculate movement diff (current position + diff = new position)
		return el.retrieve(this.options.position);
	}
});

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
MooPath.Ellipse = new Class({

	Extends: MooPath,

	options: {
		ellipse: {x: 500, y: 300},
		factor: 0.7
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
		el.setStyles({
			'bottom':  Math.round(point.y),
			'left':    Math.round(point.x - (origsize.x * factor / 2)),
			'width':   Math.round(origsize.x * factor),
			'height':  Math.round(origsize.y * factor),
			'z-index': this.options.ellipse.y - Math.round(point.y)
		});
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