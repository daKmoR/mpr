/**
 * FlexBox - allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexBox/Resources/css/FlexBox.css');
$require('Galleries/FlexSlide/FlexSlide.js');

$require('Core/Element/Element.Dimensions.js');
$require('Core/Element/Element.Style.js');
$require('Core/Utilities/Selectors.js');

$require('Core/Fx/Fx.Tween.js');
$require('Core/Fx/Fx.Morph.js');

$require('Core/Fx/Fx.Transitions.js');
$require('More/Fx/Fx.Elements.js');

$require('More/Utilities/Assets.js');
$require('More/Native/URI.js');

$require('Core/Request/Request.html.js');

var FlexBox = new Class({

	Implements: [Options, Events],

	options: {
		defaultSize: { x: 500, y: 500 },
		margin: 0,
		resizeFactor: 0.95,
		opacityResize: 0.5,
		resizeLimit: false, // {x: 640, y: 640}
		fixedSize: false, // {x: 640, y: 640}
		counterTemplate: 'Image {id} of {count}',
		descriptionTemplate: '<h5>{title}</h5><div>{text}</div>',
		render: ['content'],
		centered: false,
		ui: {
			wrap: { 'class': 'flexBoxWrap' },
			content: { 'class': 'content' }
		}
	},

	initialize: function(anchor, options){
		this.setOptions(options);
		
		this.anchor = $(anchor);
		this.container = $(document.body);
		
		this.anchor.addEvent('click', function(e) {
			e.stop();
			this.show();
			
		}.bind(this) );

	},
	
	show: function() {
		if( $defined(this.flexSlide) ) {
			this.coords = this.anchor.getElement('img').getCoordinates();
			this.wrap.setStyles({
				'left': this.coords.left,
				'top': this.coords.top
			});
			this.flexSlide.itemWrap.setStyles({
				'width': this.coords.width,
				'height': this.coords.height
			});
			this.wrap.setStyle('display', 'block');
			
			this.flexSlide.setOptions({
				autoHeight: true,
				autoWidth: true,
				autoCenter: false,
				auto: false,
				dynamicLoading: true,
				centerContainer: true,
				show: -1,
				render: ['item'],
				effect: { random: ['zoom'] }
			});
		
			this.flexSlide.current = -1;
			this.flexSlide.show(0);
		} else {
			this.build();
		}
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap).inject(document.body);
		this.wrap.grab( this.anchor.clone().addClass('item') );
		
		this.flexSlide = new FlexSlide( this.wrap, {
			show: -1,
			render: ['item']
		});
		this.show();
	},
	
	close: function() {
		var width = this.coords.width;
		var height = this.coords.height;
		
		var localCoords = this.coords;
		
		this.flexSlide.setOptions({
			autoWidth: false,
			autoHeight: false,
			centerContainer: false,
			effect: { 
				random: ['dezoom'],
			},
			effects: {
				dezoom: function(current, next, currentEl, nextEl) {
					this.wrapFx.setOptions({ transition: Fx.Transitions.Quart.easeOut, duration: 600 });
					this.wrapFxConfig[0] = {
						'width': localCoords.width,
						'height': localCoords.height
					};
					this.wrapFxConfig[1] = {
						'left': localCoords.left,
						'top': localCoords.top
					};
					this.fxConfig[current] = {
						'width': [currentEl.getSize().x, localCoords.width],
						'height': [currentEl.getSize().y, localCoords.height]
					};
					(function() { this.wrap.setStyle('display', 'none'); }).delay(600, this);
				}
			}
		});
		this.flexSlide.current = -1;
		this.flexSlide.show(0);
	},
	
	buildElement: function(item, wrapper) {
		if( !$chk(this.options.ui[item]) ) {
			this.options.ui[item] = { 'class' : item };
		}
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject( wrapper );
		if( item === 'close' ) {
			this[item + 'Wrap'].addEvent('click', function() {
				this.close();
			}.bind(this) );
		} else if( item === 'description' ) {
			var txt = this.anchor.get('title') || this.anchor.getElement('img').get('alt');
			var parts = txt.split('::');
			if( parts.length === 2 )
				txt = this.options.descriptionTemplate.substitute( {'title': parts[0], 'text': parts[1]} );
			if( txt.charAt(0) === '#' ) 
				txt = $$(txt)[0].get('html');
			this[item + 'Wrap'].set('html', txt);
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
	
	zoomRelativeTo: function(to) {
		var scale = this.options.resizeLimit;
		if (!scale) {
			scale = this.container.getSize();
			scale.x *= this.options.resizeFactor;
			scale.y *= this.options.resizeFactor;
		}
		for (var i = 2; i--;) {
			if (to.x > scale.x) {
				to.y *= scale.x / to.x;
				to.x = scale.x;
			} else if (to.y > scale.y) {
				to.x *= scale.y / to.y;
				to.y = scale.y;
			}
		}
		return this.zoomTo({x: to.x.toInt(), y: to.y.toInt()});
	},

	zoomTo: function(to) {
		to = this.options.fixedSize || to;
		var box = this.container.getSize(), scroll = this.container.getScroll();
		var pos = (!this.options.centered) ? {
			x: (this.coords.left + (this.coords.width / 2) - to.x / 2).toInt()
				.limit(scroll.x + this.options.margin, scroll.x + box.x - this.options.margin - to.x),
			y: (this.coords.top + (this.coords.height / 2) - to.y / 2).toInt()
				.limit(scroll.y + this.options.margin, scroll.y + box.y - this.options.margin - to.y)
		} :  {
			x: scroll.x + ((box.x - to.x) / 2).toInt(),
			y: scroll.y + ((box.y - to.y) / 2).toInt()
		};
		var vars = {left: pos.x, top: pos.y};
		var vars2 = {width: to.x, height: to.y, margin: 10};
		if (this.options.opacityResize != 1) 
			vars.opacity = [this.options.opacityResize, 1];
		else 
			this.wrap.set('opacity', 1);
		
		this.fx.start({
			'0': vars,
			'1': vars2
		}).chain( this.finishOpen.bind(this) );
			
		this.fireEvent('onOpen');
	},

	keyboardListener: function(event){
		if(!this.active) return;
		if(event.key != "f5") event.preventDefault();
		switch (event.key){
			case "esc": case "x": case "q": this.close(); break;
			case "p": case "left": this.changeImage(event, -1); break;	
			case "n": case "right": this.changeImage(event, 1);
		}
	},

	mouseWheelListener: function(event){
		if(!this.active) return;
		if(event.wheel > 0) this.changeImage(event, -1);
		if(event.wheel < 0) this.changeImage(event, 1);
	},

	changeImage: function(event, step){
	
		event.preventDefault();
		var link = this.anchors[this.currentIndex+step];
		if(!link) return false;
		for(var f in this.fx) this.fx[f].cancel();
		this.startLoad(link);
	}
	

});