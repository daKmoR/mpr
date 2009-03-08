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

$require(MPR.path + 'Ui/Mocha/Resources/Mocha.Windows.css');

Ui.Mocha.Windows = new Class({
	Implements: [Events, Options],
	options: {
		shadow: true,
		shadowBlur: 3,
		shadowOffset: {'x': 0, 'y': 1},
		cornerRadius: 10
	},
	
	windows: [],
	content: [],
	canvas: [],
	ctx: [],
	
	initialize: function(windows, options) {
		this.setOptions(options);
		this.attach(windows);
	},
	
	attach: function(windows) {
		$$(windows).each( function(el, i) {
			this.windows.push(el);
			var size = el.getSize();
			var canvas = new Element('canvas', {'width': size.x, 'height': size.y, 'style': 'position: absolute; top: 0; left: 0;'} ).inject(el, 'top');
			
			this.content.push( el.getElement('.ui-windowContent') );
			
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
		this.drawBox(this.ctx[id], width, height, this.options.shadowBlur, this.options.shadowOffset, this.options.shadow);
	},
	
	drawBox: function(ctx, width, height, shadowBlur, shadowOffset, shadows) {

		var shadowBlur2x = shadowBlur * 2;
		var cornerRadius = this.options.cornerRadius;
		
		// This is the drop shadow. It is created onion style.
		if ( shadows != false ) {
			for (var i = 0; i <= shadowBlur; i++) {
				this.roundedRect( ctx, shadowOffset.x + i, shadowOffset.y + i, width - (i * 2) - shadowOffset.x, height - (i * 2) - shadowOffset.y,	
					cornerRadius + (shadowBlur - i), [0, 0, 0],	i == shadowBlur ? .29 : .065 + (i * .01)
				);
			}
		}
		var headerStartColor =  [250, 250, 250];
	  var headerStopColor =   [229, 229, 229];
		
		// Window body.
		this.roundedRect( ctx, shadowBlur - shadowOffset.x, shadowBlur - shadowOffset.y, width - shadowBlur2x, height - shadowBlur2x,	cornerRadius,	[229, 229, 229], 1 );

		// Window header.
		this.topRoundedRect( ctx, shadowBlur - shadowOffset.x, shadowBlur - shadowOffset.y,	width - shadowBlur2x,	20,	cornerRadius,	headerStartColor, headerStopColor);

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
	
	topRoundedRect: function(ctx, x, y, width, height, radius, headerStartColor, headerStopColor){
		var lingrad = ctx.createLinearGradient(0, 0, 0, height);
		lingrad.addColorStop(0, 'rgb(' + headerStartColor.join(',') + ')');
		lingrad.addColorStop(1, 'rgb(' + headerStopColor.join(',') + ')');		
		ctx.fillStyle = lingrad;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + height);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill();
	}
	
});