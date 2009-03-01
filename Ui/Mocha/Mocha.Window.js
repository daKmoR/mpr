/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Ui/Mocha/Mocha.js');

$require(MPR.path + 'Ui/Mocha/Resources/Mocha.Window.css');

Ui.Mocha.Window = new Class({
	Implements: [Events, Options],
	options: {
	},
	
	windows: [],
	canvas: [],
	ctx: [],
	
	initialize: function(window, options) {
		this.setOptions(options);
		this.attach(window);
	},
	
	attach: function(window) {
		$$(window).each( function(el, i) {
			this.windows.push(el);
			var size = el.getSize();
			var canvas = new Element('canvas', {'width': size.x, 'height': size.y, 'style': 'position: absolute; top: 0; left: 0;'} ).inject(el, 'top');
			
			this.canvas.push(canvas);
			this.ctx.push( canvas.getContext('2d') );
			
			var size = el.getSize();
			this.updateSingle(i, size.x, size.y);
		}, this);
	},
	
	update: function() {
		$each( this.windows, function(el, i) {
			var size = el.getSize();
			this.updateSingle(i, size.x, size.y);
		}, this);
	},
	
	updateSingle: function(id, width, height) {
		this.canvas[id].set({ 'width': width, 'height': height });
		this.ctx[id].clearRect(0, 0, width, height);
		this.drawBox(this.ctx[id], width, height, 5, {'x': 0, 'y': 1}, true);
		// this.roundedRect(this.ctx[id], 0, 0, width, height, 14, [229, 229, 229], 1);
	},
	
	drawBox: function(ctx, width, height, shadowBlur, shadowOffset, shadows) {

		var shadowBlur2x = shadowBlur * 2;
		var cornerRadius = 8;
		
		// This is the drop shadow. It is created onion style.
		if ( shadows != false ) {
			for (var i = 0; i <= shadowBlur; i++){
				this.roundedRect( ctx, shadowOffset.x + i, shadowOffset.y + i, width - (i * 2) - shadowOffset.x, height - (i * 2) - shadowOffset.y,	
					cornerRadius + (shadowBlur - i), [0, 0, 0],	i == shadowBlur ? .29 : .065 + (i * .01)
				);
			}
		}
		
		// Window body.
		this.roundedRect( ctx, shadowBlur - shadowOffset.x, shadowBlur - shadowOffset.y, width - shadowBlur2x, height - shadowBlur2x,	cornerRadius,	[229, 229, 229], 1 );

	},	
	
	roundedRect: function(ctx, x, y, width, height, radius, rgb, a){
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill(); 
	},
	
	triangle: function(ctx, x, y, width, height, rgb, a){
		ctx.beginPath();
		ctx.moveTo(x + width, y);
		ctx.lineTo(x, y + height);
		ctx.lineTo(x + width, y + height);
		ctx.closePath();
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.fill();
	},
	
	circle: function(ctx, x, y, diameter, rgb, a){
		ctx.beginPath();
		ctx.arc(x, y, diameter, 0, Math.PI*2, true);
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.fill();
	}	
	
});