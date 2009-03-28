/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
FlowGallery = new Class({
	Implements: [Options, Events],
	options: {
		start: 0,
		auto: true,
		autointerval: 4000,
		onShow: function(title, container) { title.addClass('active'); container.fade(1); },
		onHide: function(title, container) { title.removeClass('active'); container.fade(0); }
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
		
		console.log( this.images );
		this.titles = $$('.menu h3');

		this.containers.fade('hide');					
		
		this.titles.each( function(el, i) {
			el.addEvent('click', function(e) {
				e.stop();
				this.show(i);
			}.bind(this) );
		}, this);
		
		this.show( this.options.start );
	},
	
	show: function(id) {
		this.fireEvent('onShow', [ this.titles[id], this.containers[id] ]);
		if( id != this.current) {
			this.hide(this.current);
			this.current = id;
		}
		if( this.options.auto ) this.auto();
	},
	
	hide: function(id) {
		this.fireEvent('onHide', [ this.titles[id], this.containers[id] ]);
	},
	
	auto: function() {
		$clear(this.autotimer);
		this.autotimer = this.progress.delay(this.options.autointerval, this);
	},
	
	progress: function() {
		this.show( (this.current + 1 < this.containers.length) ? this.current + 1 : 0);
	}
	
});