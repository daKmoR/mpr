Element.implement({
	reflect2: function(_options) {
		var options = {};
		$extend(options, _options);
		var size = options.size || this.getSize(), image = this.clone();
		var ref = 0.4;
		//forces absolute urls - needed for canvas
		image.src = image.src;
		if(Browser.Engine.trident){
			image.style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity=40, style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+100*ref+')';
			image.setStyles({'width':'100%', 'height':'100%'});
			return new Element('div').adopt(i);
		} else {
			var canvas = new Element('canvas', {
				'width': size.x,
				'height': size.y,
				'style': 'width: 100%;'
			});
			if( canvas.getContext ) {
				var ctx = canvas.getContext('2d');
				ctx.save();
				ctx.translate(0, size.y-1);
				ctx.scale(1, -1);
				ctx.drawImage(image, 0, 0, size.x, size.y);
				ctx.restore();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, size.y*0.5, size.x, size.y);
				var gra = ctx.createLinearGradient(0, 0, 0, size.y*ref);					
				gra.addColorStop(1, 'rgba(255, 255, 255, 1.0)');
				gra.addColorStop(0, 'rgba(255, 255, 255, '+(1-ref)+')');
				ctx.fillStyle = gra;
				ctx.rect(0, 0, size.x, size.y);
				ctx.fill();
				delete ctx, gra;
			}
			canvas.inject(this, 'after');
			return canvas;
		}
	}
});