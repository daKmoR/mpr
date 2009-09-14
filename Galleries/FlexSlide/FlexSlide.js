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
$require('Core/Fx/Fx.Transitions.js');

$require('More/Fx/Fx.Elements.js');
$require('Snippets/Array/Array.getCombinedSize.js');
$require('More/Interface/Scroller.js');

var FlexSlide = new Class({
	Implements: [Options, Events],
	options: {
		selections: {}, /* item: '.myOtherItemClass' you can define your own css classes here */
		render: ['item'],
		ui: {
			wrap: { 'class': 'ui-Wrap' },
			selectItem: { 'class': 'ui-SelectItem' },
			descriptionItem: { 'class': 'ui-DescriptionItem' },
			activeClass: 'ui-active'
		},
		show: 0,
		container: null,
		getSizeFromContainer: true,
		initFx: 'display',
		fixedSize: false, // {x: 640, y: 640}
		resizeFactor: 0.95,
		resizeLimit: false, // {x: 640, y: 640}
		auto: true,
		duration: 5000,
		autoItemSize: { x: true, y: false },
		autoItemSizeSpecial: ['img', 'a'],
		centerItemTags: ['img', 'a'],
		autoContainerSize: { x: false, y: false },
		centerItem: true,
		centerContainer: false,
		useScroller: false,
		scrollerMode: 'horizontal',
		scrollerOptions: {area: 100, velocity: 0.1},
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		selectTemplate: '{text}',
		counterTemplate: '{id}/{count}',
		descriptionTemplate: '<strong>{title}</strong><span>{text}</span>',
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			random: ['fade'],
			globalOptions: { duration: 1000, transition: Fx.Transitions.linear },
			options: { display: { duration: 0 }	},
			wrapFxOptions: { duration: 1000, transition: Fx.Transitions.Quart.easeInOut }
		},
		effects: {
			fade: function(current, next, currentEl, nextEl) {
				this.fxConfig[current] = { 'opacity': [1, 0] };
				this.fxConfig[next]    = { 'opacity': [0, 1] };
			},
			display: function(current, next, currentEl, nextEl) {
				this.wrapFx.setOptions({ duration: 0 });
				currentEl.setStyle('display', 'none');
				nextEl.setStyle('display', 'block');
			}
		},
		onShow: function(current, next) {
			if( $defined(this.els.description) ) {
				this.els.description[current].setStyle('display', 'block').fade(0);
				this.els.description[next].fade('hide').setStyle('display', 'block').fade(1);
			}
		}
		/*onBuild, onSelectChange(currentEl, nextEl) */
	},
	
	current: -1,
	running: false,
	autotimer: $empty,
	els: {},
	fxConfig: {},
	wrapFxConfig: {},
	
	initialize: function(wrap, options) {
		this.setOptions(options);

		this.wrap = $(wrap);
		if( !$defined(this.options.container) ) this.options.container = this.wrap.getParent();

		if( this.options.show >= 0 )
			this.show( this.options.show, this.options.initFx );
	},
	
	build: function() {
		this.builder( this.options.render, this.wrap );
		
		//automatically build the select if no costum select items are found
		if( $chk(this.els.select) && this.els.select.length <= 0 ) {
			this.els.item.each( function(el, i) {
				var select = new Element('div', this.options.ui.selectItem)
					.addEvent('click', this.show.bind(this, i))
					.inject(this.selectWrap);
				
				select.set('html', this.options.selectTemplate.substitute({id: i+1}) );
				this.els.select.push(select);
			}, this);
		}
		
		if( this.options.useScroller == true ) {
			if( this.options.scrollerMode === 'horizontal' )
				this.selectWrap.setStyle('width', this.selectWrap.getChildren().getCombinedSize().x);
			if( this.options.scrollerMode === 'vertical' )
				this.selectWrap.setStyle('height', this.selectWrap.getChildren().getCombinedSize().y);
			this.scroller = new Scroller( this.selectWrap.getParent(), this.options.scrollerOptions).start();
		}
		
		if( $chk(this.els.description) && this.els.description.length <= 0 ) {
			this.els.item.each( function(el, i) {
				var description = new Element('div', this.options.ui.descriptionItem)
					.inject(this.descriptionWrap);
				
				var txt = el.get('title') || el.get('alt') || '';
				if( el.getElement('img') && txt === '' )
					txt = el.getElement('img').get('alt');
				var parts = txt.split('::');
				if( parts.length === 2 )
					txt = this.options.descriptionTemplate.substitute( {'title': parts[0], 'text': parts[1]} );
				if( txt.charAt(0) === '#' ) 
					txt = $$(txt)[0].get('html');
				description.set('html', txt);
				
				this.els.description.push(description);
			}, this);
			
		}		
		
		this.fx = new Fx.Elements( this.els.item );
		this.wrapFx = new Fx.Elements( [this.itemWrap, this.wrap] );
		
		this.updateCounter(0);
		
		this.wrap.addClass( this.options.ui.wrap['class'] );
		
		if( this.options.getSizeFromContainer ) {
			this.itemWrap.setStyle('height', this.wrap.getStyle('height') );
			this.itemWrap.setStyle('width', this.wrap.getStyle('width') );
			this.wrap.setStyles({
				width: 'auto',
				height: 'auto'
			});
		}
		
		if( this.nextWrap ) {
			this.nextWrap.addEvent('click', this.next.bind(this, this.options.step) );
		}
		if( this.previousWrap ) {
			this.previousWrap.addEvent('click', this.previous.bind(this, this.options.step) );
		}
		
		this.fireEvent('onBuild');
	},
	
	buildElement: function(item, wrapper) {
		if( !$chk(this.options.ui[item]) )
			this.options.ui[item] = { 'class': 'ui-' + item.capitalize() };
		if( !$chk(this.options.selections[item]) )
			this.options.selections[item] = '.' + item;
		this.els[item] = this.wrap.getElements( this.options.selections[item] );
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject( wrapper );
		
		if( this.els[item].length > 0 ) {
			this.els[item].each( function(el, i) {
				if( item == 'select' ) {
					el.addEvent('click', this.show.bind(this, i) );
					if( el.get('tag') !== 'img' ) {
						el.set('html', this.options.selectTemplate.substitute({id: i+1, text: el.get('html')}) );
					}
				}
				if( !$chk(this.options.ui[item + 'Item']) )
					this.options.ui[item + 'Item'] = { 'class': 'ui-' + item.capitalize() + 'Item' };
				el.addClass( this.options.ui[item + 'Item']['class'] );
				this[item + 'Wrap'].grab(el);
			}, this);
		}
	},
	
	builder: function(els, wrapper) {
		$each( els, function(item, i) {
			if (item === 'advSelect') {
				els[i] = item = {'selectScroller' : ['select']};
				this.options.useScroller = true;
			}
			if( $type(item) !== 'object' ) {
				this.buildElement(item, wrapper);
			} else {
				$each( item, function(el, i) {
					this.buildElement(i, wrapper);
					this.builder(el, this[i + 'Wrap']);
				}, this);
			}
		}, this);
	},
	
	show: function(id, fx) {
		if( this.itemWrap ) {
			this._show(id, fx);
		} else {
			this.build();
			this.show(id, fx);
		}
	},
	
	_show: function(id, fx) {
		if( (id != this.current || this.current === -1) && this.running === false ) {
			var fx = fx || ( (id > this.current) ? this.options.effect.up : this.options.effect.down);
			if(fx === 'random') fx = this.options.effect.random.getRandom();
			
			var currentEl = this.els.item[this.current];
			if( this.current === -1 ) {
				this.current = id;
				currentEl = fx !== 'display' ? this.itemWrap : this.els.item[this.current];
			}
			
			var newOptions = $unlink(this.options.effect.globalOptions);
			$extend( newOptions, this.options.effect.options[fx] );
			this.fx.setOptions( newOptions );
			this.wrapFx.setOptions( this.options.effect.wrapFxOptions );
			
			this.adjustElement(this.els.item[this.current]);
			this.adjustElement(this.els.item[id]);
			
			this.fxConfig = {};
			this.wrapFxConfig = {};
			this.options.effects[fx].call( this, this.current, id, currentEl, this.els.item[id] );

			if( this.options.autoContainerSize.x || this.options.autoContainerSize.y )
				this.wrapFxConfig[0] = {};
			if( this.options.autoContainerSize.x )
				$extend(this.wrapFxConfig[0], {'width': this.els.item[id].getSize().x} );
			if( this.options.autoContainerSize.y )
				$extend(this.wrapFxConfig[0], {'height': this.els.item[id].getSize().y} );
			
			if( this.options.centerContainer )
				this.centerContainer(id);
				
			var tmp = {'display' : 'block'};
			if( $defined(this.fxConfig[id]) ) {
				$each( this.fxConfig[id], function(el, i) {
					tmp[i] = el[0];
				});
				this.els.item[id].setStyles(tmp);
			}
			
			this.itemWrap.grab( this.els.item[id] );
			
			this.running = true;
			this.fireEvent('onShow', [this.current, id]);
			this.fx.start(this.fxConfig).chain( function() {
				this.running = false;
				this.fireEvent('onShowEnd');
			}.bind(this) );
			this.wrapFx.start(this.wrapFxConfig);
			
			// this.wrapFx.start(this.wrapFxConfig).chain( function() {
				// this.fx.start(this.fxConfig)
			// }.bind(this) );
			
			this.process(id);
		}
	},
	
	adjustElement: function(el) {
		if( !el.retrieve('FlexSlide:ElementStyle') ) {
			el.setStyle('display', 'block');
			el.store('FlexSlide:ElementStyle', el.get('style'));
		}
		el.set('style', el.retrieve('FlexSlide:ElementStyle') );
	
		var parent = el.getParent(), parentSize = parent.getSize(), elSize = el.getSize();
		var width = parentSize.x - el.getStyle('padding-left').toInt() - el.getStyle('padding-right').toInt() - parent.getStyle('padding-left').toInt() - parent.getStyle('padding-right').toInt();
		var height = parentSize.y - el.getStyle('padding-top').toInt() - el.getStyle('padding-bottom').toInt() - parent.getStyle('padding-top').toInt() - parent.getStyle('padding-bottom').toInt();
		var diffHeight = parentSize.y - elSize.y, diffWidth = parentSize.x - elSize.x;
		var autoItemSize = this.options.autoItemSize;
		
		if( this.options.autoItemSizeSpecial.contains(el.get('tag')) ) {
			autoItemSize = { x: false, y: false };
			if ( diffHeight > diffWidth ) //quer
				autoItemSize.x = true;
			else
				autoItemSize.y = true;
		}

		if( this.options.autoContainerSize.y && this.options.autoContainerSize.x )
			autoItemSize = { x: false, y: false };
		else if ( this.options.autoContainerSize.y )
			autoItemSize = { x: true, y: false };
		else if ( this.options.autoContainerSize.x )
			autoItemSize = { x: false, y: true };
			
		var childs = el.getElements('*');
		if( autoItemSize.x ) {
			el.setStyle('width', width);
			if( childs.length === 1 && childs[0].get('tag') === 'img' )
				childs[0].setStyle('width', '100%');
		}
		if( autoItemSize.y ) {
			el.setStyle('height', height);
			if( childs.length === 1 && childs[0].get('tag') === 'img' )
				childs[0].setStyle('height', '100%');
		}
		
		elSize = el.getSize();
		
		if( this.options.centerItem === true && this.options.centerItemTags.contains(el.get('tag')) ) {
			if( diffHeight > diffWidth ) { //quer
				el.setStyle('margin', (height - elSize.y) / 2 + 'px 0' );
			} else {
				el.setStyle('margin', '0 ' + (width - elSize.x) / 2 + 'px' );
			}
		}
	},
	
	centerContainer: function(id) {
		var diff = this.wrap.getSize().x - this.itemWrap.getSize().x;
		this.wrapFxConfig[1] = this.wrapFxConfig[1] || {};
		$extend(this.wrapFxConfig[1], {
			'left': (this.options.container.getSize().x - this.els.item[id].getSize().x - diff) / 2,
			'top': (this.options.container.getSize().y - this.els.item[id].getSize().y - diff) / 2
		});
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
			this.fireEvent('onSelectChange', [this.els.select[this.current], this.els.select[id]]);
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
	},
	
	// fixSizes: function() {
		// var scale = this.options.resizeLimit;
		// if (!scale) {
			// scale = this.container.getSize();
			// scale.x *= this.options.resizeFactor;
			// scale.y *= this.options.resizeFactor;
		// }
		// for (var i = 2; i--;) {
			// if (to.x > scale.x) {
				// to.y *= scale.x / to.x;
				// to.x = scale.x;
			// } else if (to.y > scale.y) {
				// to.x *= scale.y / to.y;
				// to.y = scale.y;
			// }
		// }
		// return this.zoomTo({x: to.x.toInt(), y: to.y.toInt()});
	// }
	
	toElement: function() {
		return this.wrap;
	}
	
});