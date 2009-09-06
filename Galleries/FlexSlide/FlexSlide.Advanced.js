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
$require('Galleries/FlexSlide/FlexSlide.js'); 

$require('Core/Request/Request.Html.js');
$require('More/Utilities/Assets.js');
$require('More/Native/URI.js');

FlexSlide.Advanced = new Class({
	Extends: FlexSlide,
	Implements: [Options, Events],
	options: {
		ui: {
			requestItem: { 'class': 'ui-RequestItem' },
			inlineItem: { 'class': 'ui-InlineItem' },
			loader: { 'class': 'ui-Loader ui-ItemItem' },
		},
		container: null,
		dynamicLoading: true,
		dynamicMode: '',  //image, request, inline
		preLoading: { previous: 2, next: 2 },
		active: true,
		wheelListener: false,
		keyboardListener: false,
	},
	
	build: function() {
		this.loader = new Element('div', this.options.ui.loader).fade('hide');
		this.loader.set('tween', { duration: 100 });
		
		this.parent();
		
		if( this.options.wheelListener )
			document.addEvent('mousewheel', this.wheelListener.bindWithEvent(this));
		if( this.options.keyboardListener )
			document.addEvent('keydown', this.keyboardListener.bindWithEvent(this));		
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