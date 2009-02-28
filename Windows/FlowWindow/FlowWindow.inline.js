/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Windows/FlowWindow/Resources/FlowWindow.css');

$require(MPR.path + 'More/Drag.Move/Drag.Move.js');

var FlowWindow = {};

FlowWindow.inline = new Class({
	Implements: [Events, Options],
	options: {
		ui: {
			window: { 'class': 'ui-window' },
			title: { 'class': 'ui-windowTitle' },
			draggable: { 'class': 'ui-draggable' }
		},
		resizable: true,
		draggable: true
	},
	
	window: $empty,
	title: $empty,
	content: $empty,
	x: [],
	y: [],
	handles: [],
	
	initialize: function(title, content, options) {
		this.setOptions(options);
		
		this.attach(title, content);
	},
	
	attach: function(title, content) {
		this.window = new Element('div', this.options.ui.window);
		this.title = new Element('div', this.options.ui.title).grab(title);
		
		this.window.grab(this.title).grab(content).inject( document.body );
		
		if (this.options.resizable)
			this.makeResizable();
		if (this.options.draggable)
			this.makeDraggable();
	},
	
	makeDraggable: function() {
		this.title.set( this.options.ui.draggable );
		this.window.makeDraggable( { 'handle': this.title } );
	},
	
	makeResizable: function() {
		var windowSize = this.window.getSize();
		
		this.handles.push( new Element('div', { 'class': 'handle corner', 'styles': { 'top': 0, 'left': 0, 'cursor': 'nw-resize' } }).inject(this.window) );
		this.handles.push( new Element('div', { 'class': 'handle corner', 'styles': { 'top': 0, 'right': 0, 'cursor': 'ne-resize' } }).inject(this.window) );
		this.handles.push( new Element('div', { 'class': 'handle corner', 'styles': { 'bottom': 0, 'left': 0, 'cursor': 'sw-resize' } }).inject(this.window) );
		this.handles.push( new Element('div', { 'class': 'handle corner', 'styles': { 'bottom': 0, 'right': 0, 'cursor': 'se-resize' } }).inject(this.window) );
		
		this.y.push( new Element('div', { 'class': 'handle', 'styles': { 'bottom': 0, 'left': 10, 'cursor': 's-resize' } }).inject(this.window) );
		this.y.push( new Element('div', { 'class': 'handle', 'styles': { 'top': 0, 'left': 10, 'cursor': 'n-resize' } }).inject(this.window) );
		
		this.x.push( new Element('div', { 'class': 'handle', 'styles': { 'top': 10, 'right': 0, 'cursor': 'e-resize' } }).inject(this.window) );
		this.x.push( new Element('div', { 'class': 'handle', 'styles': { 'top': 10, 'left': 0, 'cursor': 'w-resize' } }).inject(this.window) );
		
		this.window.makeResizable({ 'handle': [this.y[0], this.handles[2], this.handles[3]], 'modifiers': {x: false, y: 'height'}, 'onDrag': function(el) { this.updateX(); }.bind(this) });
		this.window.makeResizable({ 'handle': [this.x[0], this.handles[1], this.handles[3]], 'modifiers': {x: 'width', y: false}, 'onDrag': function(el) { this.updateY();	}.bind(this) });
		
		this.window.makeResizable({ 'handle': [this.y[1], this.handles[0], this.handles[1]], 'modifiers': {x: false, y: 'top'},
			'onStart': function(el) {
				el.store('FlowWindow:coordinates', el.getCoordinates());
				el.store('FlowWindow:size', el.getSize());
			},
			'onDrag': function(el) {
				el.setStyle('height', el.retrieve('FlowWindow:size').y - (el.getCoordinates().top - el.retrieve('FlowWindow:coordinates').top) );
				this.updateX();
			}.bind(this)
		});
		
		this.window.makeResizable({ 'handle': [this.x[1], this.handles[0], this.handles[2]], 'modifiers': {x: 'left', y: false}, 
			'onStart': function(el) {
				el.store('FlowWindow:coordinates', el.getCoordinates());
				el.store('FlowWindow:size', el.getSize());
			},
			'onDrag': function(el) {
				el.setStyle('width', el.retrieve('FlowWindow:size').x - (el.getCoordinates().left - el.retrieve('FlowWindow:coordinates').left) );
				this.updateY();
			}.bind(this) 
		});
		
		this.update();
	},
	
	updateX: function() {
		this.x.each( function(el) {
			el.setStyle('height', this.window.getSize().y - 20);
		}, this);
	},
	
	updateY: function() {
		this.y.each( function(el) {
			el.setStyle('width', this.window.getSize().x - 20);
		}, this);
	},
	
	update: function() {
		this.updateX();
		this.updateY();
	}

});