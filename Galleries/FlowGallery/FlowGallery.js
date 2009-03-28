/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'More/Fx.Slide/Fx.Slide.js');
 
FlowGallery = new Class({
	Implements: [Options, Events],
	options: {
		start: 0,
		auto: false,
		duration: 4000,
		mode: 'continious',
		increase: 1,
		onShow: function(image, title, container) { 
			this.options.effects[this.options.usefx.getRandom()]( image, 'in' );
		},
		onHide: function(image, title, container) { 
			this.options.effects[this.options.usefx.getRandom()]( image, 'hide' );
			
			//this.options.effects[this.options.usefx.getRandom()].delay( this.options.duration, this, [image, 'hide'] );
		},
		effect: {
			active: ['slide'],
			duration: 2000,
		},
		usefx: ['slide'],
		effects: {
			fade: function(el, state) {
				el.set('tween', { 'duration': 2000 } );
				el.fade( state == 'in' ? 1 : 0 );
			},
			slide: function(el, state) {
				el.set('slide', { 'duration': 2000 } );
				el.slide( state );
			}
		}
	},
	
	containers: [],
	images: [],
	titles: [],
	description: [],
	current: 0,
	autotimer: $empty,
	
	initialize: function(container, options) {
		this.setOptions(options);
		
		this.containers = $$(container);
		this.images = this.containers.getElement('img');
		
		this.images.each( function(el, i) {
			el.setStyle('z-index', i);
			this.options.effects[this.options.usefx.getRandom()]( el, 'hide' );
		}, this);
		
		this.images.setStyle('position', 'relative');
		
		this.titles = $$('.menu h3');

		this.titles.each( function(el, i) {
			el.addEvent('click', function(e) {
				e.stop();
				this.show(i);
			}.bind(this) );
		}, this);
		
		this.show( this.options.start );
	},
	
	show: function(id) {
		this.titles[id].addClass('active');
		this.images[id].setStyle('z-index', this.images.length + 1 );
		
		if( id != this.current) {
			this.hide(this.current);
			this.current = id;
		}
		this.fireEvent('onShow', [ this.images[id], this.titles[id], this.containers[id] ]);
		if( this.options.auto ) this.auto();
	},
	
	hide: function(id) {
		this.titles[id].removeClass('active');
		this.images[id].setStyle('z-index', id);
		$clear(this.hidefxtimer);
		this.hidefxtimer = this.hidefx.delay(this.options.effect.duration, this, this.current);
	},
	
	hidefx: function(id) {
		this.fireEvent('onHide', [ this.images[id], this.titles[id], this.containers[id] ]);
	},
	
	auto: function() {
		$clear(this.autotimer);
		this.autotimer = this.next.delay(this.options.duration, this);
	},
	
	next: function(increase) {
		var increase = increase || this.options.increase;
		var next = 0;
		if ( this.options.mode === 'reverse' ) increase *= -1;
			
		if ( this.options.mode === 'random' ) {
			next = $random(0, this.containers.length-1 );
		} else {
			if ( this.current + increase < this.containers.length ) next = this.current + increase;
			if ( this.current + increase < 0 )	next = this.containers.length-1;
		}
		
		this.show(next);
	}
	
});