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

$require('More/Fx/Fx.Elements.js');

$require('More/Class/Class.Binds.js');

var FlexSlide = new Class({
	Implements: [Options, Events],
	options: {
		selections: {}, /* item: '.myOtherItemClass' you can define your own css classes here */
		render: ['previous', 'item', 'description', 'next', 'select'],
		ui: {
			select: { 'class': 'ui-SelectWrap' },
			selectItem: { 'class': 'ui-Select' },
			next: { 'class': 'ui-NextWrap' },
			item: { 'class': 'ui-ItemWrap' },
			itemItem: { 'class': 'ui-Item' },
			previous: { 'class': 'ui-PreviousWrap' },
			description: { 'class': 'ui-DescriptionWrap' },
			descriptionItem: { 'class': 'ui-Description' },
			counter: { 'class': 'ui-CounterWrap' },
			activeClass: 'ui-active'
		},
		display: 0,
		auto: true,
		autoHeight: false,
		autoWidth: false,
		autoCenter: true,
		autoWrap: false,
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		selectTemplate: '{text}',
		counterTemplate: '{id}/{count}',
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			random: ['fade', 'slideLeftBounce', 'slideRightBounce'],
			globalOptions: { duration: 1000, transition: Fx.Transitions.linear },
			options: {
				slideLeftBounce: { duration: 0 },
				slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
				slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut }
			}
		},
		effects: {
			fade: function(fxConfig, current, next, currentEl, nextEl) {
				fxConfig[current] = { 'opacity': [1, 0] };
				fxConfig[next]    = { 'opacity': [0, 1] };
				return fxConfig;
			},
			slideLeft: function(fxConfig, current, next, currentEl, nextEl) {
				fxConfig[current] = { 'left': currentEl.getSize().x*-1   };
				fxConfig[next]    = { 'left': [currentEl.getSize().x, 0] };
				return fxConfig;
			},
			slideRight: function(fxConfig, current, next, currentEl, nextEl) {
				fxConfig[current] = { 'left': [0, currentEl.getSize().x]   };
				fxConfig[next]    = { 'left': [currentEl.getSize().x*-1, 0] };
				return fxConfig;
			},
			display: function(fxConfig, current, next, currentEl, nextEl) {
				currentEl.set('style', '');
				nextEl.setStyle('display', 'block');
				return fxConfig;
			},
			slideLeftBounce: function(fxConfig, current, next, currentEl, nextEl) { return this.options.effects.slideLeft.call(this, fxConfig, current, next, currentEl, nextEl); },
			slideRightBounce: function(fxConfig, current, next, currentEl, nextEl) { return this.options.effects.slideRight.call(this, fxConfig, current, next, currentEl, nextEl); },
			slideLeftQuart: function(fxConfig, current, next, currentEl, nextEl) { return this.options.effects.slideLeft.call(this, fxConfig, current, next, currentEl, nextEl); },
			slideRightQuart: function(fxConfig, current, next, currentEl, nextEl) { return this.options.effects.slideRight.call(this, fxConfig, current, next, currentEl, nextEl); }
		}
	},
	
	current: -1,
	autotimer: $empty,
	els: {},
	
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
			this.els[item] = this.wrap.getElements( this.options.selections[item] );
			if( this.els[item].length > 0 ) {
				this.els[item].each( function(el, i) {
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
		
		var tmp = [this.options.autoWrap ? this.wrap : this.itemWrap];
		tmp.extend( $unlink(this.els.item) );
		this.fx = new Fx.Elements( tmp, {
			'link': 'cancle'
		});
		
		if( $chk(this.els.select) && this.els.select.length <= 0 ) { //automatically build the select if no costum select items are found
			this.els.item.each( function(el, i) {
				var select = new Element('div', this.options.ui.selectItem)
					.addEvent('click', this.show.bind(this, i))
					.inject(this.selectWrap);
				
				select.set('html', this.options.selectTemplate.substitute({id: i+1}) );
				this.els.select.push(select);
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
		//var action = action || 'tween';
		//this.reset(el);
		el.set('style', 'display: block;');
		//el.setStyle('left', -10000);
		//el.setStyle('display', 'block');
		
		
		//el.setStyle('width', el.getParent().getSize().x - el.getStyle('padding-left').toInt() - el.getStyle('padding-right').toInt() );
		
		// if( this.options.autoCenter === true ) {
			// el.setStyle('margin-top', (el.getParent().getSize().y - el.getSize().y) / 2 );
		// }
		// if( this.options.autoHeight === true ) {
			// console.log( 'setting' );
			// el.getParent()[action]('height', el.getSize().y);
		// }
		// el.getParent()[action]('width', el.getSize().x);
		
	},
	
	show: function(id, fx) {
		//if( id != this.current ) {
		if( 1 ) {
			//this.reset( this.els.item[id] );
			
			var fx = fx || ( (id > this.current) ? this.options.effect.up : this.options.effect.down);
			if(fx === 'random') fx = this.options.effect.random.getRandom();
			
			var newOptions = $unlink(this.options.effect.globalOptions);
			$extend( newOptions, this.options.effect.options[fx] );
			this.els.item[this.current].set('morph', newOptions);
			this.els.item[id].set('morph', newOptions);
			
			this.fx.setOptions( newOptions );
			
			//this.prepare( this.els.item[id] );
			
			//this.els.item[id].set('style', 'display: block; left: 10000px;');

			this.els.item[id].set('style', 'display: block;');
			this.els.item[id].setStyle('width', this.els.item[id].getParent().getSize().x - this.els.item[id].getStyle('padding-left').toInt() - this.els.item[id].getStyle('padding-right').toInt() );

			this.els.item[this.current].set('style', 'display: block;');
			this.els.item[this.current].setStyle('width', this.els.item[id].getParent().getSize().x - this.els.item[id].getStyle('padding-left').toInt() - this.els.item[id].getStyle('padding-right').toInt() );
			
			var fxConfig = {};
			fxConfig[0] = {};
			if( this.options.autoWidth )
				$extend(fxConfig[0], {'width': this.els.item[id].getSize().x} );
			if( this.options.autoHeight )
				$extend(fxConfig[0], {'height': this.els.item[id].getSize().y} );
			
				
			fxConfig = this.options.effects[fx].call( this, fxConfig, this.current+1, id+1, this.els.item[this.current], this.els.item[id] );
			var tmp = {};
			if( $defined(fxConfig[id+1]) ) {
				$each( fxConfig[id+1], function(el, i) {
					tmp[i] = el[0];
				});
				this.els.item[id].setStyles(tmp);
			}

			this.itemWrap.grab( this.els.item[id] );
			
			this.fx.start(fxConfig);
			
			
			// if( $chk(this.els.description) && this.els.description.length > 0 ) {
				// this.descriptionWrap.grab( this.els.description[id] );
				// this.options.effects['fade'].call( this, this.els.description[this.current], this.els.description[id] );
			// }
			
			this.process(id);
		}
	},
	
	display: function(id) {
		this.current = id;
		this.show(id, 'display');
		// this.itemWrap.grab( this.els.item[id] );

		// this.prepare( this.els.item[id], 'setStyle' );
		// if( this.options.autoHeight === true ) {
			// this.itemWrap.setStyle('height', this.els.item[id].getSize().y);
		// }
		
		// if( $chk(this.els.description) && this.els.description.length > 0 ) {
			// this.prepare( this.els.description[id], 'setStyle' );
			// if( this.options.autoHeight === true ) {
				// this.descriptionWrap.setStyle('height', this.els.description[id].getSize().y);
			// }
		// }
		
		// this.process(id);
	},
	
	updateCounter: function(id) {
		if( this.counterWrap ) {
			this.counterWrap.set('html', this.options.counterTemplate.substitute({id: id+1, 'count': this.els.item.length}) );
		}
	},
	
	process: function(id) {
		if( $chk(this.els.select) ) {
			if( this.current >= 0 ) {
				this.els.select[this.current].removeClass( this.options.ui.activeClass );
			}
			this.els.select[id].addClass( this.options.ui.activeClass );
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
				next = $random(0, this.els.item.length-1);
			while ( next == this.current )
		} else {
			if ( this.current + step < this.els.item.length ) next = this.current + step;
			if ( this.current + step < 0 ) next = this.els.item.length-1;
		}
		this.show(next, (step > 0) ? this.options.effect.up : this.options.effect.down);
	},
	
	previous: function(step) {
		this.next( step * -1 );
	}
	
});