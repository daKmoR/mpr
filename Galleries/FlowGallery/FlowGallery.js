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
		ui: {
			container: { 'class': 'ui-GalleryPics' },
			menu: { 'class': 'ui-GalleryMenu clearfix' }
		},
		start: 0,
		auto: true,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		onDeselect: function(image, title, container) {
			title.removeClass('active');
		},
		onDisplay: function(image, title, container) {
			this.options.effects[this.options.effect.active.getRandom()].call( this, image, 'show' );
		},
		onShow: function(image, title, container) {
			this.options.effects[this.options.effect.active.getRandom()].call( this, image, 'in' );
			//this.options.effects[this.options.effect.active.getRandom()]( image, 'in' );
		},
		onHide: function(image, title, container) { 
			this.options.effects[this.options.effect.active.getRandom()].call( this, image, 'hide' );
			//this.options.effects[this.options.effect.active.getRandom()].delay( this.options.duration, this, [image, 'hide'] );
		},
		effect: {
			active: ['fade'],
			options: {
				fade: { duration: 600 },
				slide: { duration: 600 }
			}
		},
		effects: {
			fade: function(el, state) {
				el.set('tween', this.options.effect.options.fade );
				el.fade( state );
			},
			slide: function(el, state) {
				el.set('slide', this.options.effect.options.slide );
				el.slide( state );
			}
		}
	},
	
	container: $empty,
	containers: [],
	images: [],
	titles: [],
	description: [],
	current: -1,
	autotimer: $empty,
	
	initialize: function(wrap, containers, options) {
		this.setOptions(options);

		this.wrap = $(wrap);
		this.containers = $$(containers);
		this.images = this.containers.getElement('img');
		this.titles = this.containers.getElement('h3');

		this.images.setStyle('position', 'relative');
		
		this.build();

		this.titles.each( function(el, i) {
			el.addEvent('click', function(e) {
				e.stop();
				this.show(i);
			}.bind(this) );
		}, this);
		
		this.display( this.options.start );
	},
	
	build: function() {
		this.container = new Element('div', this.options.ui.container).inject( this.wrap );
		this.containers.each( function(el) { this.container.grab(el); }, this );
		
		this.menu = new Element('div', this.options.ui.menu).inject( this.wrap, 'top' );
		this.titles.each( function(el) { this.menu.grab(el); }, this );
	},
	
	show: function(id, event) {
		var event = event || 'onShow';
		if( id != this.current) {
			
			if( this.current >= 0 ) {
				this.deselect( this.current );
			}
			
			this.titles[id].addClass('active');
			this.hide(id);
			this.current = id;
			this.container.grab( this.containers[id] );
			
			this.fireEvent(event, [ this.images[id], this.titles[id], this.containers[id] ]);
			if( this.options.auto ) this.auto();
		}
	},
	
	display: function(id) {
		this.show(id, 'onDisplay');
	},
	
	deselect: function(id) {
		this.fireEvent('onDeselect', [ this.images[id], this.titles[id], this.containers[id] ]);
	},
	
	hide: function(id) {
		this.fireEvent('onHide', [ this.images[id], this.titles[id], this.containers[id] ]);
	},
	
	auto: function() {
		$clear(this.autotimer);
		this.autotimer = this.next.delay(this.options.duration, this);
	},
	
	next: function(step) {
		var step = step || this.options.step;
		var next = 0;
		if ( this.options.mode === 'reverse' ) step *= -1;
			
		if ( this.options.mode === 'random' ) {
			do 
				next = $random(0, this.containers.length-1 );
			while ( next == this.current )
		} else {
			if ( this.current + step < this.containers.length ) next = this.current + step;
			if ( this.current + step < 0 )	next = this.containers.length-1;
		}
		
		this.show(next);
	},
	
	previous: function(step) {
		this.next( step * -1 );
	}
	
});