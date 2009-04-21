/**
 * create multiple overlays from images with an imagemap
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Core/Fx.Tween/Fx.Tween.js');
$require(MPR.path + 'Core/Element.Dimensions/Element.Dimensions.js');
$require(MPR.path + 'Core/Utilities.Json/Utilities.Json.js');
 
$require(MPR.path + 'More/Class.Occlude/Class.Occlude.js');

$require(MPR.path + 'Snippets/String/String.hexToRgba.js');

var CanvasOverlay = new Class({
	Implements: [Events, Options, Class.Occlude],
	property: 'CanvasOverlay',
	
	options: {
		fill: true,
		fillColor: '#333',
		fillOpacity: 0.2,
		stroke: true,
		strokeColor: '#ff3333',
		strokeOpacity: 1,
		strokeWidth: 1,
		glow: true,
		glowSize: 8,
		glowColor: '#ffffa8',
		
		fade: true
	},
	
	initialize: function(element, options) {
		this.setOptions(options);
		this.element = $(element);
		
		// if the element doesn't have the property "usemap" we can't/shouldn't use it...
		if ( !this.element.get('usemap') ) return;
		
		if (this.occlude()) return this.occluded;
		this.build();
	},
	
	build: function() {
		this.areas = $$(this.element.get('usemap'))[0].getElements('area');
		this.container = new Element('div', { 
			style: 'position: relative; background: url(' + this.element.get('src') + ');'
		}).wraps(this.element);
		
		this.element.set('style', 'opacity: 0;');
		
		this.canvas = new Element('canvas', {
			width: this.element.getSize().x, 
			height: this.element.getSize().y,
			style: 'position: absolute; left: 0; top: 0;'
		}).inject(this.container, 'top');
		if( this.options.fade )
			this.canvas.setStyle('opacity', 0);
		
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineJoin  = 'round';
		
		this.clear();
		
		this.canvas.set('tween', {'link': 'cancel'});
		$each( this.areas, function(el) {
			this.attach(el);
		}, this);
	},
	
	attach: function(area) {
		var that = this;
		area.addEvents({
			'mouseenter': function() {
				that.attachShape( this.get('shape'), this.get('coords').split(',') );
			},
			'mouseout': function() {
				that.clear();
			}
		});
	},
	
	attachShape: function(shape, coords, options) {
		this.ctx.beginPath();
		if (shape === 'rect') {
			this.ctx.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
		} else if (shape === 'poly') {
			this.ctx.moveTo(coords[0], coords[1]);
			for(i = 2; i < coords.length; i += 2) {
				this.ctx.lineTo(coords[i], coords[i+1]);
			}
		} else if (shape === 'circ') {
			this.ctx.arc(coords[0], coords[1], coords[2], 0, Math.PI * 2, false);
		}
		this.ctx.closePath();
		
		if( this.options.glow ) {
			for(i = this.options.glowSize; i > 0; i--) {
				this.ctx.strokeStyle = this.options.glowColor.hexToRgba( 0.1 );
				this.ctx.lineWidth = i*2;
				this.ctx.stroke();
			}
		}
		
		if(this.options.fill) {
			this.ctx.fillStyle = this.options.fillColor.hexToRgba( this.options.fillOpacity );
			this.ctx.fill();
		}
		
		if(this.options.stroke) {
			this.ctx.strokeStyle = this.options.strokeColor.hexToRgba( this.options.strokeOpacity );
			this.ctx.lineWidth = this.options.strokeWidth;
			this.ctx.stroke();
		}
		if(this.options.fade)
			this.canvas.tween('opacity', 1);
	},
	
	clear: function() {
		console.log('clear');
		if(this.options.fade)
			this.canvas.tween('opacity', 0);
		this.ctx.clearRect(0, 0, this.canvas.getSize().x, this.canvas.getSize().y);
	}
	
});