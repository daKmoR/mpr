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

$require('More/Fx/Fx.Elements.js');

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
