Element.implement({
	shadow: function(_options) {
		var options = {};
		$extend(options, _options);
		var size = options.size || this.getSize();
		if(Browser.Engine.trident){
			this.setStyle('filter', 'progid:DXImageTransform.Microsoft.Shadow(color=#444444, direction=135, strength=10)');
			return this;
		} else {
			var canvas = new Element('canvas', {
				'width': size.x,
				'height': size.y,
				'style': 'width: 100%; height: 100%; position: absolute; right: -4%; bottom: -6%; z-index: -1'
			});
			if( canvas.getContext ) {
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
				ctx.shadowColor = '#444';
				ctx.shadowOffsetX = 5;
				ctx.shadowOffsetY = 5;
				ctx.shadowBlur = 12;
				ctx.fillRect(0, 0, size.x-12, size.y-12);
			}
			canvas.inject(this, 'after');
			return canvas;
		}
	}
});