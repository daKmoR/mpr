/**
 * FlexSlide - allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects
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

*/

$require('Galleries/FlexSlide/Resources/css/FlexSlide.css'); 

$require('Core/Element/Element.Dimensions.js');
$require('Core/Element/Element.Style.js');

$require('Core/Fx/Fx.Tween.js');
$require('Core/Fx/Fx.Morph.js');
$require('Core/Fx/Fx.Transitions.js');

$require('More/Class/Class.Binds.js');
 
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
		render: ['previous', 'content', 'next', 'select', 'header', 'description'],
		create: ['select', 'previous', 'next'],
		ui: {
			select: { 'class': 'ui-SelectWrap' },
			selectItem: { 'class': 'ui-Select' },
			next: { 'class': 'ui-NextWrap' },
			content: { 'class': 'ui-ContentWrap' },
			contentItem: { 'class': 'ui-Content' },
			previous: { 'class': 'ui-PreviousWrap' }
		},
		display: 0,
		auto: true,
		autoHeight: true,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		autoSelectCount: true,
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			active: ['slideRight', 'slideLeft', 'fade', 'slideLeftBounce'],
			options: {
				fade: { },
				slideLeft: { },
				slideRight: { },
				slideLeftBounce: { transition: Fx.Transitions.Bounce.easeInOut }
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
			},
			slideLeftBounce: function(current, next) {
				this.options.effects.slideLeft.call(this, current, next);
			}
		}
	},
	
	current: -1,
	autotimer: $empty,
	items: {},
	
	initialize: function(wrap, options) {
		this.setOptions(options);

		this.wrap = $(wrap);
		this.wrap.set( this.options.ui.wrap );

		this.build();
		this.display( this.options.display );
	},
	
	build: function() {
		this.options.render.each( function(item) {
		
			this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject( this.wrap );
			
			this.items[item] = this.wrap.getElements( this.options.selections[item] );
			if( this.items[item].length > 0 ) {
				this.items[item].each( function(el, i) {
					if( item == 'select' ) {
						el.addEvent('click', this.show.bind(this, i) );
					}
					el.addClass( this.options.ui[item + 'Item']['class'] );
					this[item + 'Wrap'].grab(el);
				}, this);
			}
			
		}, this);
		
		if( this.items.select.length <= 0 ) {
			this.items.content.each( function(el, i) {
				var select = new Element('span', this.options.ui.selectItem)
					.addEvent('click', this.show.bind(this, i))
					.inject(this.selectWrap);
				if( this.options.autoSelectCount == true ) {
					select.set('html', i+1);
				}
				this.items.select.push(select);
			}, this);
		}
		
		if( this.nextWrap ) {
			this.nextWrap.addEvent('click', this.next.bind(this, this.options.step) );
		}
		if( this.previousWrap ) {
			this.previousWrap.addEvent('click', this.previous.bind(this, this.options.step) );
		}
		
	},
	
	reset: function(el) {
		el.set('style', '');
	},
	
	prepare: function(el) {
		this.reset(el);
		el.setStyle('display', 'block');
		el.setStyle('width', this.contentWrap.getSize().x);
		if( this.options.autoHeight == true ) {
			this.contentWrap.tween('height', el.getSize().y);
		}
	},
	
	show: function(id, fx) {
		if( id != this.current) {
			this.reset( this.items.content[id] );
			
			this.contentWrap.grab( this.items.content[id] );
			this.prepare( this.items.content[id] );
			
			if( id > this.current && this.options.effect.up != 'random' ) {
				fx = fx || this.options.effect.up;
			} else if ( id < this.current && this.options.effect.down != 'random' )  {
				fx = fx || this.options.effect.down;
			} else {
				fx = fx || this.options.effect.active.getRandom();
			}
			
			this.items.content[this.current].set('tween', this.options.effect.options[fx]);
			this.items.content[id].set('tween', this.options.effect.options[fx]);
			this.options.effects[fx].call( this, this.items.content[this.current], this.items.content[id] );
			
			this.items.select[this.current].removeClass('active');
			this.items.select[id].addClass('active');
			
			this.current = id;
			if( this.options.auto ) this.auto();
		}
	},
	
	display: function(id) {
		this.contentWrap.grab( this.items.content[id] );
		this.items.content[id].setStyle('display', 'block');
		
		if( this.options.autoHeight == true ) {
			this.contentWrap.setStyle('height', this.items.content[id].getSize().y);
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
				next = $random(0, this.items.content.length-1 );
			while ( next == this.current )
		} else {
			if ( this.current + step < this.items.content.length ) next = this.current + step;
			if ( this.current + step < 0 )	next = this.items.content.length-1;
		}
		
		this.show(next);
	},
	
	previous: function(step) {
		this.next( step * -1 );
	}
	
});