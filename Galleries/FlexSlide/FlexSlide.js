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

// Lightbox needed
$require('More/Utilities/Assets.js');
$require('More/Native/URI.js');

$require('Core/Request/Request.Html.js');


var FlexSlide = new Class({
	Implements: [Options, Events],
	options: {
		selections: {}, /* item: '.myOtherItemClass' you can define your own css classes here */
		render: ['previous', 'item', 'description', 'next', 'select'],
		ui: {
			wrap: { 'class': 'ui-Wrap' },
			selectItem: { 'class': 'ui-SelectItem' },
			descriptionItem: { 'class': 'ui-DescriptionItem' },
			requestItem: { 'class': 'ui-RequestItem' },
			inlineItem: { 'class': 'ui-InlineItem' },
			loader: { 'class': 'ui-Loader ui-ItemItem' },
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
		autoHeight: false,
		autoWidth: false,
		centerImage: true,
		moveContainer: true,
		centerContainer: false,
		dynamicLoading: false,
		dynamicMode: '',  //image, request, inline
		preLoading: { previous: 2, next: 2 },
		duration: 4000,
		mode: 'continuous', /* [continuous, reverse, random] */
		step: 1,
		active: true,
		wheelListener: false,
		keyboardListener: false,
		selectTemplate: '{text}',
		counterTemplate: '{id}/{count}',
		descriptionTemplate: '<strong>{title}</strong><span>{text}</span>',
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			random: ['fade', 'slideLeftQuart', 'slideRightQuart'],
			globalOptions: { duration: 1000, transition: Fx.Transitions.linear },
			options: {
				display: { duration: 0 },
				slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
				slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
				slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut }
			},
			wrapFxOptions: { duration: 1000, transition: Fx.Transitions.Quart.easeInOut }
		},
		effects: {
			fade: function(current, next, currentEl, nextEl) {
				this.fxConfig[current] = { 'opacity': [1, 0] };
				this.fxConfig[next]    = { 'opacity': [0, 1] };
			},
			slideLeft: function(current, next, currentEl, nextEl) {
				this.fxConfig[current] = { 'left': [0, currentEl.getSize().x*-1] };
				this.fxConfig[next]    = { 'left': [currentEl.getSize().x, 0] };
			},
			slideRight: function(current, next, currentEl, nextEl) {
				this.fxConfig[current] = { 'right': [0, currentEl.getSize().x*-1] };
				this.fxConfig[next]    = { 'right': [currentEl.getSize().x, 0] };
			},
			display: function(current, next, currentEl, nextEl) {
				this.wrapFx.setOptions({ duration: 0 });
				currentEl.setStyle('display', 'none');
				nextEl.setStyle('display', 'block');
			},
			slideLeftBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
			slideRightBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
			slideLeftQuart:   function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
			slideRightQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); }
		},
		onShow: function(current, next) {
			if( $defined(this.els.description) ) {
				this.els.description[current].setStyle('display', 'block').fade(0);
				this.els.description[next].fade('hide').setStyle('display', 'block').fade(1);
			}
		}
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
		this.loader = new Element('div', this.options.ui.loader).fade('hide');
		this.loader.set('tween', { duration: 100 });
		
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
		
		if( $chk(this.els.description) && this.els.description.length <= 0 ) {
			this.els.item.each( function(el, i) {
				var description = new Element('div', this.options.ui.descriptionItem)
					.inject(this.descriptionWrap);
				
				var txt = el.get('title') || el.get('alt') || el.getElement('img').get('alt');
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
		
		if( this.options.wheelListener )
			document.addEvent('mousewheel', this.wheelListener.bindWithEvent(this));
		if( this.options.keyboardListener )
			document.addEvent('keydown', this.keyboardListener.bindWithEvent(this));		
		
		if( this.nextWrap ) {
			this.nextWrap.addEvent('click', this.next.bind(this, this.options.step) );
		}
		if( this.previousWrap ) {
			this.previousWrap.addEvent('click', this.previous.bind(this, this.options.step) );
		}
		
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
		$each( els, function(item) {
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
			if( this.options.dynamicLoading === true && this.els.item[id].get('tag') === 'a' ) {
				this.dynamicLoading(id, fx);
			} else {
				this._show(id, fx);
			}
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
			
			this.els.item[id].set('style', 'display: block;');
			this.els.item[this.current].set('style', 'display: block;');
			if( !this.options.autoWidth ) {
				var width = this.els.item[id].getParent().getSize().x - this.els.item[id].getStyle('padding-left').toInt() - this.els.item[id].getStyle('padding-right').toInt();
				this.els.item[id].setStyle('width', width );
				this.els.item[this.current].setStyle('width', width );
			}
			
			this.fxConfig = {};
			this.wrapFxConfig = {};
			this.options.effects[fx].call( this, this.current, id, currentEl, this.els.item[id] );

			if( this.options.centerImage === true ) {
				var margin = (this.els.item[this.current].getParent().getSize().y - this.els.item[this.current].getSize().y) / 2;
				this.els.item[this.current].setStyle('margin-top', margin);
				this.els.item[id].setStyle('margin-top', margin );
			}
			
			if( this.options.autoWidth || this.options.autoHeight )
				this.wrapFxConfig[0] = {};
			if( this.options.autoWidth )
				$extend(this.wrapFxConfig[0], {'width': this.els.item[id].getSize().x} );
			if( this.options.autoHeight )
				$extend(this.wrapFxConfig[0], {'height': this.els.item[id].getSize().y} );
			
			if( this.options.moveContainer && this.options.centerContainer )
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
			if( this.options.moveContainer )
				this.wrapFx.start(this.wrapFxConfig);
			
			// this.wrapFx.start(this.wrapFxConfig).chain( function() {
				// this.fx.start(this.fxConfig)
			// }.bind(this) );
			
			this.process(id);
		}
	},
	
	dynamicLoading: function(id, fx) {
		if( this.els.item[id].get('tag') === 'a' && this.options.dynamicLoading === true ) {
			var href = this.els.item[id].get('href');
			this.setMode( href );
			
			this.els.item[id].destroy();
			
			this.itemWrap.grab( this.loader );
			this.loader.fade(0.5);
			
			switch( this.options.dynamicMode ) {
				case 'image':
					var image = new Asset.image(href, {
						onload: function() {
							this.loader.fade(0);
							image.addClass( this.options.ui.itemItem['class'] );
							this.els.item[id] = this.fx.elements[id] = image;
							this.itemWrap.grab( image );
							this._show(id, fx);
						}.bind(this)
					});
					break;
				case 'request':
					var request = new Request.HTML({ method: 'get', noCache: true,	autoCancel: true, url: href,
						onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
							this.loader.fade(0);
							var div = new Element('div', {'class': this.options.ui.itemItem['class'] + ' ' + this.options.ui.requestItem['class']} );
							div.set('html', responseHTML);
							this.els.item[id] = this.fx.elements[id] = div;
							this.itemWrap.grab(div);
							this._show(id, fx);
						}.bind(this)
					}).send();
					break;
				case 'inline':
					this.loader.fade(0);
					var div = new Element('div', {'class': this.options.ui.itemItem['class'] + ' ' + this.options.ui.inlineItem['class']} );
					$$(href)[0].clone().setStyle('display', 'block').inject( div );
					this.els.item[id] = this.fx.elements[id] = div;
					this.itemWrap.grab(div);
					this._show(id, fx);
					break;
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
	
	display: function(id) {
		this.show(id, 'display');
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
	},
	
	keyboardListener: function(event){
		if(!this.options.active) return;
		if(event.key != 'f5') event.preventDefault();
		switch (event.key){
			case 'esc': case 'x': case 'q': this.close(); break;
			case 'p': case 'left': this.previous(); break;	
			case 'n': case 'right': this.next();
		}
	},

	wheelListener: function(event){
		if(!this.options.active) return;
		if(event.wheel > 0) this.previous();
		if(event.wheel < 0) this.next();
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
	},
	
	setMode: function(href) {
		var fileExt = href.substr(href.lastIndexOf('.') + 1).toLowerCase();
		
		switch( fileExt ) {
			case 'jpg':
			case 'gif':
			case 'png':
				this.options.dynamicMode = 'image';
				break;
			case 'swf':
				this.options.dynamicMode = 'flash';
				break;
			case 'flv':
				this.options.dynamicMode = 'flashVideo';
				//this.contentObj.xH = 70;
				break;
			case 'mov':
				this.options.dynamicMode = 'quicktime';
				break;
			case 'wmv':
				this.options.dynamicMode = 'windowsMedia';
				break;
			case 'rv':
			case 'rm':
			case 'rmvb':
				this.options.dynamicMode = 'real';
				break;
			case 'mp3':
				this.options.dynamicMode = 'flashMp3';
				// this.contentObj.width = 320;
				// this.contentObj.height = 70;
				break;
			default:
				if( href.charAt(0) === '#' ) {
					this.options.dynamicMode = 'inline'
				} else if( document.location.host === href.toURI().get('host') + (document.location.host.contains(':') ? ':' + href.toURI().get('port') : '') ) {
					this.options.dynamicMode = 'request'
				} else {
					this.options.dynamicMode = 'iframe';
				}
		}
	}
	
});