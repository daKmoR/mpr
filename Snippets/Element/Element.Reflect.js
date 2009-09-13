Element.implement({
	reflect: function(_options) {
		if( this.get('tag') !== 'img' ) return this;
		var options = { opacity: 0.4, wrap: { 'class': 'ui-Reflection' } };
		$extend(options, _options);
		var size = options.size || this.getSize(), image = this.clone(), divider = size.y*(1+options.opacity)/100;
		image.src = image.src; //forces absolute urls - needed for canvas
		
		new Element('div', $extend(options.wrap, {'style': 'overflow: hidden; width: ' + size.x + 'px; height: ' + size.y*(1+options.opacity) + 'px' }) ).wraps( this );
		if( Browser.Engine.trident ) {
			image.style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity=' + 100*options.opacity + ', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=' + size.y*options.opacity + ')';
			image.setStyles({'width':'100%', 'height': 'auto'});
			image.inject(this, 'after');
		} else {
			var canvas = new Element('canvas', { 'width': size.x,	'height': size.y*options.opacity, 'style': 'width: 100%; height: ' + (size.y*options.opacity/divider).round(2) + '%;' });
			if( canvas.getContext ) {
				var ctx = canvas.getContext('2d');
				ctx.save();
				ctx.translate(0, size.y-1);
				ctx.scale(1, -1);
				ctx.drawImage(image, 0, 0, size.x, size.y);
				ctx.restore();
				ctx.globalCompositeOperation = 'destination-out';
				var gra = ctx.createLinearGradient(0, 0, 0, size.y*options.opacity);					
				gra.addColorStop(1, 'rgba(255, 255, 255, 1.0)');
				gra.addColorStop(0, 'rgba(255, 255, 255, ' + (1 - options.opacity) + ')');
				ctx.fillStyle = gra;
				ctx.rect(0, 0, size.x, size.y);
				ctx.fill();
				delete ctx, gra;
			}
			canvas.inject(this, 'after');
		}
		this.setStyles({
			'vertical-align': 'bottom',
			'width': '100%',
			'height': (size.y/divider).round(2) + '%'
		});
		return this;
	}
});