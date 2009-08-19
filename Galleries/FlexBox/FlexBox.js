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
		opacityResize: 0,
		resizeLimit: false, // {x: 640, y: 640}
		fixedSize: false, // {x: 640, y: 640}
		counterTemplate: 'Image {id} of {count}',
		render: ['previous', 'next', 'content', { 'bottom' : ['description', 'counter', 'close'] }],
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
		this.setMode();
		if( !$chk(this.contentWrap) || this.contentWrap.get('html') == '' ) {
			this.build();
		} else {
			this.open();
		}
	},
	
	open: function() {
		var size = this.anchor.retrieve('zoomSize');
		this.wrap.setStyle('display', 'block');
		this.zoomRelativeTo( {x: size.x, y: size.y} );
	},

	close: function() {
		this.bottomWrap.tween('bottom', 0).get('tween').chain( function() {
		
			this.nextWrap.setStyle('display', 'none');
			this.previousWrap.setStyle('display', 'none');
			if( this.mode == 'iframe' ) {
				this.contentWrap.getElement('*').setStyle('display', 'none');
			}
			if( this.mode != 'image') {
				//this.contentWrap.setStyle('opacity', 0);
				this.contentWrap.fade(0);
			}
			var vars = {left: this.coords['left'], top: this.coords['top']};
			if (this.options.opacityResize != 1) 
				vars.opacity = [1, this.options.opacityResize];
			
			this.fx.start({
				'0': vars,
				'1': {width: this.coords['width'], height: this.coords['height'], margin: 0}
			}).chain( function() {
				this.wrap.setStyle('display', 'none');
			}.bind(this) );
			
		}.bind(this) );
	},
	
	buildContent: function() {
		if( this.mode == 'image' ) {
			var image = new Asset.image(this.anchor.get('href'), {
				onload: function() {
					image.inject( this.contentWrap );
					var size = image.getSize();
					this.anchor.store('zoomSize', size);
					image.setStyles({ width: '100%', height: '100%' });
					
					this.open();
				}.bind(this)
			});
			
		} else if( this.mode == 'iframe') {
			this.anchor.store('zoomSize', this.options.defaultSize);
			this.open();
			
		} else if( this.mode == 'inline' ) {
			this.anchor.store('zoomSize', this.options.defaultSize);
			this.open();
			
		} else if( this.mode == 'request') {
			
			this.anchor.store('zoomSize', this.options.defaultSize);
			this.open();
			
		} else {
			// var obj = this.createEmbedObject().injectInside(this.contentContainer);
			// if(this.str != ''){
				// $('MultiBoxMediaObject').innerHTML = this.str;
			// }
		}
		
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap).inject(document.body);
		this.builder( this.options.render, this.wrap );
		
		this.coords = this.anchor.getElement('img').getCoordinates();
		this.coords.left += 1;
		
		this.wrap.setStyles({
			left: this.coords['left'], 
			top: this.coords['top'],
			display: 'block'
		});
		
		this.contentWrap.setStyles( {width: this.coords['width'], height: this.coords['height']} );
		
		this.fx = new Fx.Elements( $$(this.wrap, this.contentWrap) );
		this.buildContent();
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
	
	setMode: function() {
		var href = this.anchor.get('href')
		var str = href.substr(href.lastIndexOf('.') + 1).toLowerCase();
		
		switch( str ) {
			case 'jpg':
			case 'gif':
			case 'png':
				this.mode = 'image';
				break;
			case 'swf':
				this.mode = 'flash';
				break;
			case 'flv':
				this.mode = 'flashVideo';
				//this.contentObj.xH = 70;
				break;
			case 'mov':
				this.mode = 'quicktime';
				break;
			case 'wmv':
				this.mode = 'windowsMedia';
				break;
			case 'rv':
			case 'rm':
			case 'rmvb':
				this.mode = 'real';
				break;
			case 'mp3':
				this.mode = 'flashMp3';
				// this.contentObj.width = 320;
				// this.contentObj.height = 70;
				break;
			default:
				if( href.charAt(0) === '#' ) {
					this.mode = 'inline'
				} else if( document.location.host === href.toURI().get('host') ) {
					this.mode = 'request'
				} else {
					this.mode = 'iframe';
				}
		}
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
		//if (this.options.cutOut) this.element.setStyle('visibility', 'hidden');
		//this.box.removeClass('remooz-loading');
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
	
	finishOpen: function() {
		this.nextWrap.setStyle('display', 'block');
		this.previousWrap.setStyle('display', 'block');
		
		if( this.mode != 'image' )
			this.contentWrap.fade(1);
	
		this.bottomWrap.setStyles({
			'display': 'block',
			'bottom': '0'
		});
		this.bottomWrap.tween('bottom', -45);
		
		if( this.contentWrap.get('html') == '' ) {
			switch( this.mode ) {
				case 'iframe':
					new Element('iframe', {
						id: 'iFrame'+new Date().getTime(), 
						width: 300,
						height: 500,
						src: this.anchor.get('href'),
						frameborder: 0,
						scrolling: 'auto'
					}).inject( this.contentWrap );
					break;
				case 'inline':
					$$(this.anchor.get('href'))[0].clone().setStyle('display', 'block').fade('hide').inject( this.contentWrap ).fade(1);
					break;
				case 'request':
					this.request = new Request.HTML({
						url: this.anchor.get('href'),
						method: 'get',
						noCache: true,
						update: this.contentWrap,
						evalScripts: true,
						autoCancel: true
					}).send();
					break;
				
				
				default:
			}
		} else {
			if( this.mode == 'iframe' ) {
				this.contentWrap.getElement('*').setStyle('display', 'block');
			} else {
				this.contentWrap.fade(1);
			}
			
			
			
		}
		
		this.fireEvent('onOpenFinish');
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