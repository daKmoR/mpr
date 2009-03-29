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
		onDeselect: function(image, title, container) {
			title.removeClass('active');
		},
		onDisplay: function(image, title, container) {
			this.options.effects[this.options.effect.active.getRandom()]( image, 'show' );
		},
		onShow: function(image, title, container) { 
			this.options.effects[this.options.effect.active.getRandom()]( image, 'in' );
		},
		onHide: function(image, title, container) { 
			this.options.effects[this.options.effect.active.getRandom()]( image, 'hide' );
			//this.options.effects[this.options.effect.active.getRandom()].delay( this.options.duration, this, [image, 'hide'] );
		},
		effect: {
			active: ['fade'],
			duration: 2000,
		},
		effects: {
			fade: function(el, state) {
				el.set('tween', { 'duration': 2000 } );
				el.fade( state );
			},
			slide: function(el, state) {
				el.set('slide', { 'duration': 2000, link: 'chain' } );
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
	
	initialize: function(containers, options) {
		this.setOptions(options);
		
		this.container = $$('.pics')[0];
		this.containers = $$(containers);
		this.images = this.containers.getElement('img');
		
		// this.images.each( function(el, i) {
			// //el.setStyle('z-index', i);
			// this.options.effects[this.options.effect.active.getRandom()]( el, 'hide' );
		// }, this);
		
		this.images.setStyle('position', 'relative');
		
		this.titles = $$('.menu h3');

		this.titles.each( function(el, i) {
			el.addEvent('click', function(e) {
				e.stop();
				this.show(i);
			}.bind(this) );
		}, this);
		
		this.display( this.options.start );
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
	},
	
	previous: function(increase) {
		this.next( increase * -1 );
	}
	
});