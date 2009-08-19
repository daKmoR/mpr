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
$require('Core/Utilities/Selectors.js');

$require('Core/Fx/Fx.Tween.js');
$require('Core/Fx/Fx.Transitions.js');

$require('Visual/MooPath/Fx.Any.js');

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
 		this.elements = $$(elements);
 		this.curel = this.options.show;

		this.fx = new Fx.Any(this.elements, {pathpoint: this.set.bind(this)}, this.options.fxoptions);

		var numelements = this.elements.length;
 		this.elements.each(function(el, i) {
 			el.store(this.options.origsize,  el.getSize());
			el.setStyle('position', 'absolute');

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