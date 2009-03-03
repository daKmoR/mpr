/**
 * Creating Window Funktionality with Drag and Resize (heavily inspired by MochUI)
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
			content: { 'class': 'ui-windowContent' },
			controlsWrap: { 'class': 'ui-windowControlsWrap' },
			draggable: { 'class': 'ui-draggable' },
			handle: { 'class': 'ui-windowHandle' },
			corner: { 'class': 'ui-windowHandle ui-windowCorner' },
			minimize: { 'class': 'ui-windowMinimize', 'html': '<span>_</span>' },
			maximize: { 'class': 'ui-windowMinimize', 'html': '<span>^</span>' },
			close: { 'class': 'ui-windowClose', 'html': '<span>x</span>' },
		},
		container: 'document.body',
		resizable: true,
		resizeLimit: {'x': [250, 2500], 'y': [125, 2000]},
		draggable: true,
		controls: ['minimize', 'close'],
		controlsSize: 18
	},
	
	window: $empty,
	title: $empty,
	content: $empty,
	x: {},
	y: {},
	handles: {},
	controls: {},
	
	initialize: function(title, content, options) {
		this.setOptions(options);
		
		this.attach(title, content);
	},
	
	attach: function(title, content) {
		this.window = new Element('div', this.options.ui.window);
		this.title = new Element('div', this.options.ui.title).grab(title);
		this.content = new Element('div', this.options.ui.content).grab(content);
		
		this.window.grab(this.title).grab(this.content).inject( document.body );
		
		if (this.options.resizable)
			this.makeResizable();
		if (this.options.draggable)
			this.makeDraggable();
		this.makeControls();
	},
	
	makeControls: function() {
		this.controlsWrap = new Element('div', this.options.ui.controlsWrap);
		this.options.controls.each( function(el, i) {
			this.controls[el] = new Element('div', $extend( this.options.ui[el], { 'events': { 'click': function() { this[el]() }.bind(this) } }) );
			this.controlsWrap.grab( this.controls[el] );
		}, this);
		this.title.grab(this.controlsWrap);
	},
	
	makeDraggable: function() {
		this.title.addClass( this.options.ui.draggable['class'] );
		//this.title.set( $merge( this.options.ui.title, this.options.ui.draggable ) );
		this.window.makeDraggable( { 'handle': this.title } );
	},
	
	makeResizable: function(options) {
		this.setOptions(options);
		var windowSize = this.window.getSize();
		
		this.handles.nw = new Element('div', $extend( this.options.ui.corner, { 'styles': {'top':    0, 'left':  0, 'cursor': 'nw-resize'} }) ).inject(this.window);
		this.handles.ne = new Element('div', $extend( this.options.ui.corner, { 'styles': {'top':    0, 'right': 0, 'cursor': 'ne-resize'} }) ).inject(this.window);
		this.handles.sw = new Element('div', $extend( this.options.ui.corner, { 'styles': {'bottom': 0, 'left':  0, 'cursor': 'sw-resize'} }) ).inject(this.window);
		this.handles.se = new Element('div', $extend( this.options.ui.corner, { 'styles': {'bottom': 0, 'right': 0, 'cursor': 'se-resize'} }) ).inject(this.window);
		
		this.y.s = new Element('div', $extend( this.options.ui.handle, { 'styles': {'bottom': 0, 'left': 10, 'cursor': 's-resize'} }) ).inject(this.window);
		this.y.n = new Element('div', $extend( this.options.ui.handle, { 'styles': {'top':    0, 'left': 10, 'cursor': 'n-resize'} }) ).inject(this.window);
		
		this.x.e = new Element('div', $extend( this.options.ui.handle, { 'styles': {'top': 10, 'right': 0, 'cursor': 'e-resize'} }) ).inject(this.window);
		this.x.w = new Element('div', $extend( this.options.ui.handle, { 'styles': {'top': 10, 'left':  0, 'cursor': 'w-resize'} }) ).inject(this.window);
		
		this.window.makeResizable({ 'handle': [this.y.s, this.handles.sw, this.handles.se], 'modifiers': {x: false, y: 'height'}, 'onDrag': function(el) { this.update('x'); }.bind(this), 'limit': this.options.resizeLimit });
		this.window.makeResizable({ 'handle': [this.x.e, this.handles.ne, this.handles.se], 'modifiers': {x: 'width', y: false}, 'onDrag': function(el) { this.update('y');	}.bind(this), 'limit': this.options.resizeLimit });
		
		this.window.makeResizable({ 'handle': [this.y.n, this.handles.nw, this.handles.ne], 'modifiers': {x: false, y: 'top'},
			'onStart': function(el) {
				el.store('FlowWindow:coordinates', el.getCoordinates());
				el.store('FlowWindow:size', el.getSize());
			},
			'onDrag': function(el) {
				el.setStyle('height', el.retrieve('FlowWindow:size').y - (el.getCoordinates().top - el.retrieve('FlowWindow:coordinates').top) );
				this.update('x');
			}.bind(this),
			'limit': {
				y: [
					function(){ return this.window.getCoordinates().top + this.window.getSize().y - this.options.resizeLimit.y[1]; }.bind(this),
					function(){ return this.window.getCoordinates().top + this.window.getSize().y - this.options.resizeLimit.y[0]; }.bind(this)
				]			
			}
		});
		
		this.window.makeResizable({ 'handle': [this.x.w, this.handles.nw, this.handles.sw], 'modifiers': {x: 'left', y: false}, 
			'onStart': function(el) {
				el.store('FlowWindow:coordinates', el.getCoordinates());
				el.store('FlowWindow:size', el.getSize());
			},
			'onDrag': function(el) {
				el.setStyle('width', el.retrieve('FlowWindow:size').x - (el.getCoordinates().left - el.retrieve('FlowWindow:coordinates').left) );
				this.update('y');
			}.bind(this),
			'limit': {
				x: [
					function(){ return this.window.getCoordinates().left + this.window.getSize().x - this.options.resizeLimit.x[1]; }.bind(this),
					function(){ return this.window.getCoordinates().left + this.window.getSize().x - this.options.resizeLimit.x[0]; }.bind(this)
				]
			}
		});
		
		this.update();
	},
	
	updateX: function() {
		var size = this.window.getSize();
		$each( this.x, function(el) {
			el.setStyle('height', size.y - 20);
		}, this);
	},
	
	updateY: function() {
		var size = this.window.getSize();
		$each( this.y, function(el) {
			el.setStyle('width', size.x - 20);
		});
	},
	
	update: function(what) {
		if (what != 'y')
			this.updateX();
		if (what != 'x')
			this.updateY();
		this.fireEvent('onUpdate', this.window.getSize() );
	},
	
	close: function() {
		this.window.fade(0);
	},
	
	minimize: function() {
		alert('minimize');
	}

});