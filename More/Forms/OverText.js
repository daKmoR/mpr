/*
Script: OverText.js
	Shows text over an input that disappears when the user clicks into it. The text remains hidden if the user adds a value.

	License:
		MIT-style license.

	Authors:
		Aaron Newton
*/

var OverText = new Class({

	Implements: [Options, Events, Class.Occlude],

	Binds: ['reposition', 'assert', 'focus'],

	options: {/*
		textOverride: null,
		onFocus: $empty()
		onTextHide: $empty(textEl, inputEl),
		onTextShow: $empty(textEl, inputEl), */
		element: 'label',
		positionOptions: {
			position: 'upperLeft',
			edge: 'upperLeft',
			offset: {
				x: 4,
				y: 2
			}
		},
		poll: false,
		pollInterval: 250
	},

	property: 'OverText',

	initialize: function(element, options){
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.attach(this.element);
		OverText.instances.push(this);
		if (this.options.poll) this.poll();
		return this;
	},

	toElement: function(){
		return this.element;
	},

	attach: function(){
		var val = this.options.textOverride || this.element.get('alt') || this.element.get('title');
		if (!val) return;
		this.text = new Element(this.options.element, {
			'class': 'overTxtLabel',
			styles: {
				lineHeight: 'normal',
				position: 'absolute'
			},
			html: val,
			events: {
				click: this.hide.pass(true, this)
			}
		}).inject(this.element, 'after');
		if (this.options.element == 'label') this.text.set('for', this.element.get('id'));
		this.element.addEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		}).store('OverTextDiv', this.text);
		window.addEvent('resize', this.reposition.bind(this));
		this.assert(true);
		this.reposition();
	},

	startPolling: function(){
		this.pollingPaused = false;
		return this.poll();
	},

	poll: function(stop){
		//start immediately
		//pause on focus
		//resumeon blur
		if (this.poller && !stop) return this;
		var test = function(){
			if (!this.pollingPaused) this.assert(true);
		}.bind(this);
		if (stop) $clear(this.poller);
		else this.poller = test.periodical(this.options.pollInterval, this);
		return this;
	},

	stopPolling: function(){
		this.pollingPaused = true;
		return this.poll(true);
	},

	focus: function(){
		if (!this.text.isDisplayed() || this.element.get('disabled')) return;
		this.hide();
	},

	hide: function(suppressFocus){
		if (this.text.isDisplayed() && !this.element.get('disabled')){
			this.text.hide();
			this.fireEvent('textHide', [this.text, this.element]);
			this.pollingPaused = true;
			try {
				if (!suppressFocus) this.element.fireEvent('focus').focus();
			} catch(e){} //IE barfs if you call focus on hidden elements
		}
		return this;
	},

	show: function(){
		if (!this.text.isDisplayed()){
			this.text.show();
			this.reposition();
			this.fireEvent('textShow', [this.text, this.element]);
			this.pollingPaused = false;
		}
		return this;
	},

	assert: function(suppressFocus){
		this[this.test() ? 'show' : 'hide'](suppressFocus);
	},

	test: function(){
		var v = this.element.get('value');
		return !v;
	},

	reposition: function(){
		this.assert(true);
		if (!this.element.getParent() || !this.element.offsetHeight) return this.stopPolling().hide();
		if (this.test()) this.text.position($merge(this.options.positionOptions, {relativeTo: this.element}));
		return this;
	}

});

OverText.instances = [];

OverText.update = function(){

	return OverText.instances.map(function(ot){
		if (ot.element && ot.text) return ot.reposition();
		return null; //the input or the text was destroyed
	});

};

if (window.Fx && Fx.Reveal) {
	Fx.Reveal.implement({
		hideInputs: Browser.Engine.trident ? 'select, input, textarea, object, embed, .overTxtLabel' : false
	});
}