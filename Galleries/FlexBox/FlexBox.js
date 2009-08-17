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

$require('More/Utilities/Assets.js');
$require('More/Native/URI.js');

var FlexBox = new Class({

	Implements: [Options, Events],

	options: {
		resizeDuration: 600,
		resizeTransition: Fx.Transitions.Circ.easeOut,
		initialWidth: 250,
		initialHeight: 250,
		defaultSize: { x: 500, y: 500 },
		padding: 10,
		margin: 20,
		animateCaption: true,
		resizeFactor: 0.95,
		opacityResize: 1,
		resizeLimit: false, // {x: 640, y: 640}
		counter: "Image {NUM} of {TOTAL}",
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
		
		this.wrap = new Element('div', this.options.ui.wrap).inject(document.body);
		
		this.build();
		
		this.setMode();
		
		this.anchor.addEvent('click', function(e) {
			e.stop();
			
			this.coords = this.anchor.getElement('img').getCoordinates();
			
			this.wrap.setStyles( this.coords );
			this.wrap.setStyle('display', 'block');
			//if( this.contentWrap.get('html') == '' )
				this.showContent();
				
			
		}.bind(this) );

	},

	close: function() {
		this.bottomWrap.tween('top', -45).get('tween').chain( function() {
			this.nextWrap.setStyle('display', 'none');
			this.previousWrap.setStyle('display', 'none');
		
			this.wrap.morph( this.anchor.getElement('img').getCoordinates() ).get('morph').chain( function() {
				this.wrap.setStyle('display', 'none');
			}.bind(this) );
		}.bind(this) );
		
	},
	
	showContent: function() {
		if( this.mode == 'image' ) {
			var image = new Asset.image(this.anchor.get('href'), {
				onload: function() {
					image.inject( this.contentWrap );
					var size = image.getSize();
					image.setStyles({ width: '100%', height: '100%' });
					
					this.zoomRelativeTo( {x: size.x, y: size.y} );
				}.bind(this)
			});
			
		} else if( this.mode == 'iframe') {
			new Element('iframe', {
				id: 'iFrame'+new Date().getTime(), 
				width: 300,
				height: 500,
				src: this.anchor.get('href'),
				frameborder: 0,
				scrolling: 'auto'
			}).inject( this.contentWrap );
			this.zoomRelativeTo( this.options.defaultSize );
			
		} else if( this.mode == 'inline' ) {
			$$(this.anchor.get('href'))[0].clone().setStyle('display', 'block').inject( this.contentWrap );
			
		} else if( this.mode == 'request') {
			new Request.HTML(this.anchor.get('href'), {
				method: 'get',
				update: this.contentWrap,
				evalScripts: true,
				autoCancel: true
			}).send();
			
		} else {
			// var obj = this.createEmbedObject().injectInside(this.contentContainer);
			// if(this.str != ''){
				// $('MultiBoxMediaObject').innerHTML = this.str;
			// }
		}
		
	},
	
	build: function() {
		this.builder( this.options.render, this.wrap );
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
				this.contentObj.xH = 70;
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
				this.contentObj.width = 320;
				this.contentObj.height = 70;
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
		//to = this.options.fixedSize || to;
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
		var vars = {left: pos.x, top: pos.y, width: to.x, height: to.y};
		if (this.options.opacityResize != 1) 
			vars.opacity = [this.options.opacityResize, 1];
		else 
			this.wrap.set('opacity', 1);
			
		this.wrap.morph( vars ).get('morph').chain( this.finishOpen.bind(this)  );
		//this.tweens.box.start(vars).chain(this.finishOpen.bind(this));
		this.fireEvent('onOpen');
	},
	
	finishOpen: function() {
		this.nextWrap.setStyle('display', 'block');
		this.previousWrap.setStyle('display', 'block');
	
		this.bottomWrap.setStyles({
			'display': 'block',
			'top': '-45px'
		});
		this.bottomWrap.tween('top', 0);
	},

	open: function(event, link){
	
		this.active = true;
						
		var size = window.getSize();
		var scroll = window.getScroll();
		var scrollSize = window.getScrollSize();
		
		/* The images should be 640x480(max). They're easily clipped at 1024x768,
		 * so we get them as close as possible to the top of the window. */
		var offset = Math.round((size.y < 768) ? size.y / 36 : size.y / 10);
		
		var top = scroll.y + offset;
		
		this.overlay.setStyles({
			opacity: 0,
			display: "block",
			width: scrollSize.x,
			height: scrollSize.y
		});
		this.wrap.setStyles({
			display: "block",
			top: top
		});
		this.fx.overlay.start(0.8);
		this.startLoad(link);
		return false;
	},
	
	startLoad: function(link, preload){
	
		if(!link) return;
		var image = new Asset.image(link.get("href"), {
			onload: function(){
				if(!preload) this.nextEffect();
			}.bind(this)
		});
		if(!preload){
			this.stage.addClass("loading");
			this.stage.empty();
			this.bottom.setStyle("opacity", 0);
			this.prevLink.setStyle("display", "none");
			this.nextLink.setStyle("display", "none");
			this.currentCaption = link.retrieve("caption");
			this.currentImage = image;
			this.currentIndex = this.anchors.indexOf(link);
			this.step = 1;
		}
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
	},
	
	nextEffect: function(){
	
		switch(this.step++){
		
			case 1:
				var w = this.currentImage.width + this.options.padding * 2;
				var h = this.currentImage.height + this.options.padding * 2;
				this.fx.resize.start({
					width: w,
					height: h,
					marginLeft: -(this.currentImage.width/2)
				});
				break;
			case 2:
			
				this.stage.removeClass("loading");
				this.stage.setStyle("opacity", 0);
				this.currentImage.setStyle("margin", this.options.padding);
				this.currentImage.inject(this.stage);
				this.fx.show.start(1);
				break;
			case 3:
			
				this.prevLink.setStyle("display", "block");
				this.nextLink.setStyle("display", "block");
				if(this.options.animateCaption){
					if(this.options.counter){
						var total = this.anchors.length;
						var num = this.currentIndex + 1;
						var counterText = this.options.counter;
						counterText = counterText.replace(/\{NUM\}/, num);
						counterText = counterText.replace(/\{TOTAL\}/, total);
						this.counter.set("text", counterText);
					}
					this.caption.set("text", this.currentCaption);
					var height = this.bottom.getStyle("height").toInt();
					this.bottom.setStyles({
						opacity: 1,
						top: -height
					});
					this.fx.bottom.start(0);
				}
				break;
			case 4:
				this.startLoad(this.anchors[this.currentIndex-1], true);
				this.startLoad(this.anchors[this.currentIndex+1], true);
				break;
		}
	}

});