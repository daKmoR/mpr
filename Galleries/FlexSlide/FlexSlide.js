/**
 * gives a simple Gallery
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
/* 
<div class="fsPrevious"></div>
<div class="fsWrap">
	<div class="fsContent">
		<a href="#"><img src="" alt="" /></a>
	</div>
	<div class="fsHeader">
		Header
	</div>
	<div class="fsDescription">
		Description
	</div>
	<div class="fsSelect">
		<img src="thumb" alt="" />
	</div>
</div>
<div class="fsNext"></div>


<div class="fsContent">
	<a href="#"><img src="" alt="" /></a>
</div>
<div class="fsContent">
	<a href="#"><img src="" alt="" /></a>
</div>



selections: {
	select: 'fsSelect',
	previous: 'fsPrevious',
	content: 'fsContent',
	next: 'fsNext',
	header: 'fsHeader',
	description: 'fsDescription'
}
render: ['select', 'previous', 'content', 'next', 'header', 'description']


render: ['select', 'previous', 'content', 'next']


render: ['content', 'header', 'select']





new FlexContent( $$('fsContent') );

*/

$require(MPR.path + 'Galleries/FlexSlide/Resources/css/FlexSlide.css'); 

$require(MPR.path + 'Core/Element/Element.Dimensions.js');
$require(MPR.path + 'Core/Element/Element.Style.js');

$require(MPR.path + 'Core/Fx/Fx.Tween.js');
$require(MPR.path + 'Core/Fx/Fx.Morph.js');
$require(MPR.path + 'Core/Fx/Fx.Transitions.js');

$require(MPR.path + 'More/Fx/Fx.Slide.js');
 
var FlexSlide = new Class({
	Implements: [Options, Events],
	options: {
		selections: {
			select: '.fsSelect',
			previous: '.fsPrevious',
			content: '.fsContent',
			next: '.fsNext',
			header: '.fsHeader',
			description: '.fsDescription'
		},
		render: ['select', 'previous', 'content', 'next', 'header', 'description'],
		create: ['select', 'previous', 'next'],
		ui: {
			selects: { 'class': 'ui-Selects' },
			next: { 'class': 'ui-Next' },
			contents: { 'class': 'ui-Contents' },
			content: { 'class': 'ui-Content' },
			previous: { 'class': 'ui-Previous' },
		},
		display: 0,
		auto: true,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		onDeselect: function(image, title, container) {
			title.removeClass('active');
		},
		onDisplay: function(container) {
			this.options.effects[this.options.effect.active.getRandom()].call( this, container, 'show' );
		},
		onShow: function(container) {
			this.options.effects[this.options.effect.active.getRandom()].call( this, container, 'in' );
			//this.options.effects[this.options.effect.active.getRandom()]( image, 'in' );
		},
		onHide: function(container) { 
			this.options.effects[this.options.effect.active.getRandom()].call( this, container, 'hide' );
			//this.options.effects[this.options.effect.active.getRandom()].delay( this.options.duration, this, [image, 'hide'] );
		},
		effect: {
			active: ['fade'],
			options: {
				fade: { duration: 1500 },
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
	
	content: [],
	current: -1,
	autotimer: $empty,
	
	//		render: ['select', 'previousx', 'content', 'nextx', 'header', 'description'],
	
	initialize: function(wrap, content, options) {
		this.setOptions(options);

		this.wrap = $(wrap);
		this.wrap.set( this.options.ui.wrap );
		
		this.build();
		this.display( this.options.display );
	},
	
	buildSelectWrap: function() {
		return new Element('div', this.options.ui.selects).inject( this.wrap );
	},
	
	buildNextWrap: function() {
		return new Element('div', this.options.ui.next).inject( this.wrap );
	},
	
	buildPreviousWrap: function() {
		return new Element('div', this.options.ui.previous).inject( this.wrap );
	},
	
	buildContentWrap: function() {
		return new Element('div', this.options.ui.contents).inject( this.wrap );
	},
	
	build: function() {
		this.options.render.each( function(item) {
			els = $$( this.options.selections[item] );
			itemName = item.camelCase() + 'Wrap';
			if( els.length > 0 ) {
				if( item == 'previous' || item == 'next' ) {
					this[itemName] = els[0];
				} else if ( item == 'content' ) {
					this[itemName] = this['build' + itemName.capitalize().camelCase()]();
					els.each( function(el) {
						this[itemName].grab(el);
					}, this);
					this.content = els;
				}	else {
					this[itemName] = els;
				}
			} else {
				if( this.options.create.contains(item) ) {
				  this[itemName] = this['build' + itemName.capitalize().camelCase()]();
				}
			}
			console.log( itemName );
			
		}, this);
	},
	
	reset: function(id) {
		this.content[id].set('style', '');
		this.content[id].setStyle('display', 'none');
	},
	
	show: function(id, event) {
		var event = event || 'onShow';
		if( id != this.current) {
			
			this.reset(id);
			this.content[id].setStyle('display', 'block');
			// if( this.current >= 0 ) {
				// this.deselect( this.current );
			// }
			
			//this.selectWrap[id].addClass('active');
			this.hide(id);
			this.current = id;
			
			this.contentWrap.tween('height', this.content[id].getSize().y);
			
			this.contentWrap.grab( this.content[id] );
			
			this.fireEvent(event, [ this.content[id] ]);
			if( this.options.auto ) this.auto();
		}
	},
	
	display: function(id) {
		this.show(id, 'onDisplay');
	},
	
	deselect: function(id) {
		this.fireEvent('onDeselect', [ this.images[id], this.titles[id], this.content[id] ]);
	},
	
	hide: function(id) {
		this.fireEvent('onHide', [ this.content[id] ]);
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
				next = $random(0, this.content.length-1 );
			while ( next == this.current )
		} else {
			if ( this.current + step < this.content.length ) next = this.current + step;
			if ( this.current + step < 0 )	next = this.content.length-1;
		}
		
		this.show(next);
	},
	
	previous: function(step) {
		this.next( step * -1 );
	}
	
});