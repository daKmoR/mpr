/**
 * create canvas overlays from images with an imagemap
 * heavily inspired by http://davidlynch.org/js/maphilight/docs/
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Core/Fx/Fx.Tween.js');
$require(MPR.path + 'Core/Element/Element.Dimensions.js');
$require(MPR.path + 'Core/Utilities/Json.js');
 
$require(MPR.path + 'More/Class/Class.Occlude.js');

var CanvasOverlay = new Class({
	Implements: [Events, Options, Class.Occlude],
	property: 'CanvasOverlay',
	
	options: {
		fill: true,
		fillColor: '#333333',
		fillOpacity: 0.2,
		stroke: true,
		strokeColor: '#ff3333',
		strokeOpacity: 1,
		strokeWidth: 1,
		glow: true,
		glowSize: 8,
		glowColor: '#ffffa8',
		active: true,
		alwaysActive: false,
		fade: true
	},
	
	initialize: function(element, options) {
		this.setOptions(options);
		this.element = $(element);
		
		// if the element doesn't have the property "usemap" we can't/shouldn't use it...
		if ( !this.element.get('usemap') ) return;
		
		// no canvas support so we can't do anything
		if ( !new Element('canvas').getContext ) return;
		
		if (this.occlude()) return this.occluded;
		this.build();
	},
	
	build: function() {
		this.areas = $$(this.element.get('usemap'))[0].getElements('area');
		this.container = new Element('div', { 
			style: 'position: relative; background: url(' + this.element.get('src') + '); width: ' + this.element.getSize().x + 'px; height: ' + this.element.getSize().y + 'px;'
		}).wraps(this.element);
		
		this.element.setStyle('opacity', 0.01);
		
		this.canvas = this.createCanvas();
		if( this.options.fade )
			this.canvas.setStyle('opacity', 0);
		
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineJoin = 'round';
		
		this.clear();
		
		this.canvas.set('tween', {'link': 'cancel'});
		$each( this.areas, function(el) {
			this.attach(el);
		}, this);
	},
	
	createCanvas: function() {
		return new Element('canvas', {
			width: this.element.getSize().x, 
			height: this.element.getSize().y,
			style: 'position: absolute; left: 0; top: 0;'
		}).inject(this.container, 'top');
	},
	
	attach: function(area) {
		var that = this;
		
		var options = that.options;
		try {
			options = $merge(options, JSON.decode( area.get('alt') ) );
		} catch(e) {}
		area.store('CanvasOverlay:ElementOptions', options);
		
		if ( options.alwaysActive ) {
			this.activeCanvas = this.activeCanvas || this.createCanvas();
			this.activeCtx = this.activeCtx || this.activeCanvas.getContext('2d');
			this.attachShape( area.get('shape'), area.get('coords').split(','), options, this.activeCtx );
		}
		
		area.addEvents({
			'mouseenter': function() {
				options = area.retrieve('CanvasOverlay:ElementOptions');
				if ( options.active && !options.alwaysActive )
					that.attachShape( this.get('shape'), this.get('coords').split(','), options );
				if( options.fade )
					that.canvas.tween('opacity', 1);
			},
			'mouseleave': function() {
				that.clear();
			}
		});
	},
	
	attachShape: function(shape, coords, options, ctx) {
		options = options || this.options;
		ctx = ctx || this.ctx;
		shape = shape.toLowerCase();
		ctx.beginPath();
		if (shape === 'rect') {
			ctx.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
		} else if (shape === 'poly') {
			ctx.moveTo(coords[0], coords[1]);
			for(i = 2; i < coords.length; i += 2)
				ctx.lineTo(coords[i], coords[i+1]);
		} else if (shape === 'circ') {
			ctx.arc(coords[0], coords[1], coords[2], 0, Math.PI * 2, false);
		}
		ctx.closePath();
		
		if ( options.glow ) {
			ctx.save();
			ctx.globalAlpha = 0.1; 
			ctx.strokeStyle = options.glowColor;
			for(i = options.glowSize; i > 0; i--) {
				ctx.lineWidth = i*2;
				ctx.stroke();
			}
			ctx.restore();
		}

		if ( options.fill ) {
			ctx.save();
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor;
			ctx.fill();
			ctx.restore();
		}
		
		if ( options.stroke ) {
			ctx.save();
			ctx.globalAlpha = options.strokeOpacity;
			ctx.strokeStyle = options.strokeColor;
			ctx.lineWidth = options.strokeWidth;
			ctx.stroke();
			ctx.restore();
		}

	},
	
	clear: function() {
		if(this.options.fade)
			this.canvas.tween('opacity', 0);
		this.ctx.clearRect(0, 0, this.canvas.getSize().x, this.canvas.getSize().y);
	}
	
});