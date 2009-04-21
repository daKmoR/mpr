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
 
$require(MPR.path + 'More/Class.Occlude/Class.Occlude.js');

var MultiOverlay = new Class({
	Implements: [Events, Options, Class.Occlude],
	property: 'MultiOverlay',
	
	options: {
		activeClass: 'active',
		onInit: function(overlay, active) {
			if ( active )
				overlay.addClass( this.options.activeClass );
			else
				overlay.fade('hide');
		},
		onShow: function(overlay) {
			overlay.fade(1);
		},
		onHide: function(overlay) {
			overlay.fade(0);
		}
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
		this.container = new Element('div', { style: 'position: relative;' }).wraps(this.element);
		
		$each( this.areas, function(el) {
			this.attach(el);
		}, this);
	},
	
	attach: function(area) {
		var overlay = new Element('img', { 
			src: area.get('alt'),
			title: area.get('title'),
			style: 'position: absolute; left: 0; top: 0;', 
			usemap : this.element.get('usemap') 
		});
		this.fireEvent('onInit', [overlay, area.hasClass(this.options.activeClass)] );
		this.container.grab(overlay);
		
		area.store('MultiOverlay:Image', overlay);
		var that = this;
		area.addEvents({
			'mouseenter': function() {
				var overlay = this.retrieve('MultiOverlay:Image');
				if( !overlay.hasClass(that.options.activeClass) )
					that.fireEvent('onShow', [overlay] );
			},
			'mouseleave': function() {
				var overlay = this.retrieve('MultiOverlay:Image');
				if( !overlay.hasClass(that.options.activeClass) )
					that.fireEvent('onHide', [overlay] );
			}
		});
	}
	
});2