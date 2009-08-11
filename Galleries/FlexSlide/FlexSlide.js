/**
 * FlexSlide - allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexSlide/Resources/css/FlexSlide.css'); 

$require('Core/Element/Element.Dimensions.js');
$require('Core/Element/Element.Style.js');
$require('Core/Utilities/Selectors.js');

$require('Core/Fx/Fx.Tween.js');
$require('Core/Fx/Fx.Morph.js');
$require('Core/Fx/Fx.Transitions.js');

$require('More/Class/Class.Binds.js');

var FlexSlide = new Class({
	Implements: [Options, Events],
	options: {
		selections: {
			content: '.item'
		},
		render: ['previous', 'content', 'description', 'next', 'select'],
		create: ['select', 'previous', 'next'],
		ui: {
			select: { 'class': 'ui-SelectWrap' },
			selectItem: { 'class': 'ui-Select' },
			next: { 'class': 'ui-NextWrap' },
			content: { 'class': 'ui-ContentWrap' },
			contentItem: { 'class': 'ui-Content' },
			previous: { 'class': 'ui-PreviousWrap' },
			description: { 'class': 'ui-DescriptionWrap' },
			descriptionItem: { 'class': 'ui-Description' },
			counter: { 'class': 'ui-CounterWrap' },
			activeClass: 'ui-active'
		},
		display: 0,
		auto: true,
		autoHeight: false,
		autoCenter: true,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		selectTemplate: '{text}',
		counterTemplate: '{id}/{count}',
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			active: ['fade', 'slideLeftBounce', 'slideRightBounce'],
			globalOptions: { duration: 1000, transition: Fx.Transitions.linear },
			options: {
				slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
				slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut }
			}
		},
		effects: {
			fade: function(current, next) {
				this.prepare(next);
				next.fade('hide');
				next.fade(1);
				current.fade('show');
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
			},
			slideRightBounce: function(current, next) {
				this.options.effects.slideRight.call(this, current, next);
			},
			slideLeftQuart: function(current, next) {
				this.options.effects.slideLeft.call(this, current, next);
			},
			slideRightQuart: function(current, next) {
				this.options.effects.slideRight.call(this, current, next);
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
			
			if( !$chk(this.options.selections[item]) ) {
				this.options.selections[item] = '.' + item;
			}
			this.items[item] = this.wrap.getElements( this.options.selections[item] );
			if( this.items[item].length > 0 ) {
				this.items[item].each( function(el, i) {
					if( item == 'select' ) {
						el.addEvent('click', this.show.bind(this, i) );
						if( el.get('tag') !== 'img' ) {
							el.set('html', this.options.selectTemplate.substitute({id: i+1, text: el.get('html')}) );
						}
					}
					el.addClass( this.options.ui[item + 'Item']['class'] );
					this[item + 'Wrap'].grab(el);
				}, this);
			}
			
		}, this);
		
		if( $chk(this.items.select) && this.items.select.length <= 0 ) { //automatically build the select if no costum select items are found
			this.items.content.each( function(el, i) {
				var select = new Element('div', this.options.ui.selectItem)
					.addEvent('click', this.show.bind(this, i))
					.inject(this.selectWrap);
				
				select.set('html', this.options.selectTemplate.substitute({id: i+1}) );
				this.items.select.push(select);
			}, this);
		}
		
		this.updateCounter(0);
		
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
	
	prepare: function(el, action) {
		var action = action || 'tween';
		this.reset(el);
		el.setStyle('display', 'block');
		el.setStyle('width', el.getParent().getSize().x - el.getStyle('padding-left').toInt() - el.getStyle('padding-right').toInt() );
		if( this.options.autoCenter === true ) {
			el.setStyle('margin-top', (el.getParent().getSize().y - el.getSize().y) / 2 );
		}
		if( this.options.autoHeight === true ) {
			el.getParent()[action]('height', el.getSize().y);
		}
	},
	
	show: function(id, fx) {
		if( id != this.current) {
			this.reset( this.items.content[id] );
			
			this.contentWrap.grab( this.items.content[id] );
			
			var fx = fx || (id > this.current) ? this.options.effect.up : this.options.effect.down;
			if(fx === 'random') fx = this.options.effect.active.getRandom();
			
			var newOptions = $unlink(this.options.effect.globalOptions);
			$extend( newOptions, this.options.effect.options[fx] );
			this.items.content[this.current].set('tween', newOptions);
			this.items.content[id].set('tween', newOptions);
			this.options.effects[fx].call( this, this.items.content[this.current], this.items.content[id] );
			
			if( $chk(this.items.description) && this.items.description.length > 0 ) {
				this.descriptionWrap.grab( this.items.description[id] );
				this.options.effects['fade'].call( this, this.items.description[this.current], this.items.description[id] );
			}
			
			this.process(id);
		}
	},
	
	display: function(id) {
		this.contentWrap.grab( this.items.content[id] );

		this.prepare( this.items.content[id], 'setStyle' );
		if( this.options.autoHeight === true ) {
			this.contentWrap.setStyle('height', this.items.content[id].getSize().y);
		}
		
		if( $chk(this.items.description) && this.items.description.length > 0 ) {
			this.prepare( this.items.description[id], 'setStyle' );
			if( this.options.autoHeight === true ) {
				this.descriptionWrap.setStyle('height', this.items.description[id].getSize().y);
			}
		}
		
		this.process(id);
	},
	
	updateCounter: function(id) {
		if( this.counterWrap ) {
			this.counterWrap.set('html', this.options.counterTemplate.substitute({id: id+1, 'count': this.items.content.length}) );
		}
	},
	
	process: function(id) {
		if( $chk(this.items.select) ) {
			if( this.current >= 0 ) {
				this.items.select[this.current].removeClass( this.options.ui.activeClass );
			}
			this.items.select[id].addClass( this.options.ui.activeClass );
		}
		
		this.updateCounter(id);
			
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
				next = $random(0, this.items.content.length-1);
			while ( next == this.current )
		} else {
			if ( this.current + step < this.items.content.length ) next = this.current + step;
			if ( this.current + step < 0 ) next = this.items.content.length-1;
		}
		
		this.show(next, (step > 0) ? this.options.effect.up : this.options.effect.down);
	},
	
	previous: function(step) {
		this.next( step * -1 );
	}
	
});