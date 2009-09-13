Element.implement({
	shadow: function(_options) {
		var options = { color: '#444444', opacity: 0.9, shadowBlur: 11, shadowSize: 12, shadowOffset: { x: 5, y: 5 }, wrap: { 'class': 'ui-Shadow' } };
		$extend(options, _options);
		var size = options.size || this.getSize();
		var wrap = new Element('div', $extend(options.wrap, {'style': 'position: relative; width: ' + (size.x + options.shadowSize) + 'px; height: ' + (size.y + options.shadowSize) + 'px' }) ).wraps( this );
		if( Browser.Engine.trident ) {
			wrap.setStyle('filter', 'progid:DXImageTransform.Microsoft.Shadow(color=' + options.color + ', direction=135, strength=' + (options.shadowSize*0.8).round() +')');
		} else {
			var canvas = new Element('canvas', {
				'width': size.x,
				'height': size.y,
				'style': 'width: 100%; height: 100%; position: absolute; right: 0; bottom: 0; z-index: -1'
			});
			if( canvas.getContext ) {
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = 'rgba(255, 255, 255, ' + options.opacity + ')';
				ctx.shadowColor = options.color;
				ctx.shadowOffsetX = options.shadowOffset.x;
				ctx.shadowOffsetY = options.shadowOffset.y;
				ctx.shadowBlur = options.shadowBlur;
				ctx.fillRect(0, 0, size.x-options.shadowSize, size.y-options.shadowSize);
			}
			canvas.inject(this, 'after');
		}
		this.setStyles({
			'width': (size.x/((size.x+options.shadowSize)/100)).round(2) + '%',
			'height': (size.y/((size.y+options.shadowSize)/100)).round(2) + '%'
		});
		return this;
	}
});