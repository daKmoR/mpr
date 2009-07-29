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
		autoHeight: true,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		effect: {
			active: ['slideRight', 'slideLeft', 'fade'],
			options: {
				fade: { duration: 1500 },
				slide: { duration: 600 }
			}
		},
		effects: {
			fade: function(current, next) {
				this.prepare(next);
				next.fade('hide');
				next.fade(1);
				current.fade(0);
			},
			slideLeft: function(current, next) {
				this.prepare(next);
				next.setStyle('left', this.contentWrap.getSize().x);
				next.tween('left', 0);
				current.tween('left', this.contentWrap.getSize().x*-1);
			},
			slideRight: function(current, next) {
				this.prepare(next);
				next.setStyle('left', this.contentWrap.getSize().x*-1);
				next.tween('left', 0);
				current.tween('left', this.contentWrap.getSize().x);
			}
		}
	},
	
	content: [],
	current: -1,
	autotimer: $empty,
	
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
			
		}, this);
	},
	
	reset: function(el) {
		el.set('style', '');
		//el.setStyle('display', 'none');
	},
	
	prepare: function(el) {
		this.reset(el);
		el.setStyle('display', 'block');
		el.setStyle('width', this.contentWrap.getSize().x);
		if( this.options.autoHeight == true ) {
			this.contentWrap.tween('height', el.getSize().y);
		}
	},
	
	show: function(id, event) {
		if( id != this.current) {
			
			this.reset( this.content[id] );
			
			this.contentWrap.grab( this.content[id] );
			this.prepare( this.content[id] );
			
			tmp = this.options.effect.active.getRandom();
			this.options.effects[tmp].call( this, this.content[this.current], this.content[id] );
			
			this.current = id;
			if( this.options.auto ) this.auto();
		}
	},
	
	display: function(id) {
		this.contentWrap.grab( this.content[id] );
		this.content[id].setStyle('display', 'block');
		
		if( this.options.autoHeight == true ) {
			this.contentWrap.setStyle('height', this.content[id].getSize().y);
		}
		this.current = id;
		if( this.options.auto ) this.auto();
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