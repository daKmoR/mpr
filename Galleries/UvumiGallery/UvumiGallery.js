/*
UvumiTools Gallery v1.0.2 http://tools.uvumi.com/gallery.html

Copyright (c) 2008 Uvumi LLC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

$require(MPR.path + 'Galleries/UvumiGallery/Resources/css/UvumiGallery.css');

$require(MPR.path + 'Core/Element/Element.Dimensions.js');
$require(MPR.path + 'Core/Fx/Fx.Tween.js');
$require(MPR.path + 'Core/Fx/Fx.Morph.js');

$require(MPR.path + 'More/Fx/Fx.Elements.js');
$require(MPR.path + 'More/Fx/Fx.Scroll.js');
$require(MPR.path + 'More/Utilities/Utilities.Assets.js');


var UvumiGallery = new Class({
	Implements : Options,
	
	options : {
		caption:true,							//if a caption must displayed on top of imges when mouseovered
		thumbSize:120,							//Maximum width/height of a thumbnail
		spacing:40,								//space between thumbnails in gallery view
		loadingImg:'css/ajax-loader.gif',		//path to image indicating picture is loading. Should be gif file. The path is relative to html document, not the javscript file
		missingThumbClass:'missing-thumbnail',	//CSS class assigned to the missing thumbnails. Style can then be modified in the css sheet by modifying the matching class
		progressClass:'progress-bar',			//CSS class assigned to the progress bar. Style can then be modified in the css sheet by modifying the matching class
		errorMessageClass:'error-message',		//CSS class assigned to the error message displayed when a picture can't be found. Style can then be modified in the css sheet by modifying the matching class
		captionClass:'caption'
	},
	
	initialize:function(options){
		this.setOptions(options);
		//we added a domready function for n00bs, so all the have to do is write one line of code.  if you are  familiar with mootools and already have a domready function on your site and put the class instantiation in it, you can edit this part so the code is imediatly excuted
		window.addEvent('domready',this.domReady.bind(this));},
	
	domReady : function(){
		//if no container id is specified (not recommended), the document body will be used. This is really only useful if your page contains nothing but the gallery
		this.container=$(this.options.container)||$$('body')[0];
		//this is a secutriy: the container requires its position to be set. If not done with the css, we force it here
		this.container.setStyles({
			'position': (this.container.getStyle('position')=='absolute'?'absolute':'relative'),
			'width':(this.container.getStyle('width')=='auto'?this.container.getSize().x:this.container.getStyle('width')),
			'height':(this.container.getStyle('height')=='auto'?this.container.getSize().y:this.container.getStyle('height'))
		});
		// extract the anchors, set the hashes, and call the building functions
		this.anchors = this.container.getElements('a').dispose();
		this.nbrImages = this.anchors.length;
		this.images = new Hash();
		if(this.options.caption){
			this.captions = new Hash();
		}
		this.anchors.each(this.getImageInfo,this);
		this.loaded=false;
		var loader = new Asset.image(this.options.loadingImg);
		//prepare new elements
		this.build();
		//load the thumbnails
		this.load();
	},
	
	getImageInfo:function(anchor){
		//for each anchor, we extract the target image and the thumbnail, and we associate them in a hash
		var fullImage = anchor.get('href');
		if(Browser.Engine.trident){
			//fix when dealing with local files in IE. Mostly for dev purpose
			fullImage = fullImage.replace('about:',''); 
		}
		var image = anchor.getFirst('img');
		var thumb = image.get('src');
		this.images.set(thumb,fullImage);
		// if the caption is required, we extract the alt property
		if(this.options.caption){
			var caption = image.get('alt');
			if ($defined(caption)){
				this.captions.set(fullImage,caption);
			}
		}
	},
	
	build:function(){
		// the pusher will be used in case the gallery fills more space then container can display.
		//The pusher also adds extra space bellow the last thumbnail, so when it's hovered and grows, it will still be fully visible 
		this.pusher = new Element('div',{
			'styles':{
				'position':'absolute',
				'width':1,
				'left':0
			}
		});
		// style for the loading indicator in the middle of the container
		this.container.setStyles({
			'background-repeat':'no-repeat',
			'background-position':'center center'
		});
		// the error message might never be displyed, but we build it anyway
		this.error = new Element('div',{
			'html':'the image cannot be loaded.',
			'class':this.options.errorMessageClass,
			'styles':{
				'top':0,
				'left':0,
				'padding-left':this.options.thumbSize
			}
		});
		//The resize function is called when window is resized, to update the dimmension values. But we need to call it at least once, to initialize those values.
		this.resize();
		this.originalHeight=this.windowSize.y;
		if(this.options.caption){
			this.caption = new Element('div',{
				'class':this.options.captionClass,
				'styles':{
					'position':'absolute',
					'top':0,
					'left':0,
					'padding':0,
					'height':0,
					'opacity':0.75,
					'z-index':99,
					'overflow':'hidden',
					'white-space':'nowrap'
				},
				'morph':{
					'link':'cancel'
				},
				'events':{
					'mouseenter':function(){
						$clear(this.captionDelay);
					}.bind(this),
					'mouseleave':function(){
						this.full.fireEvent('mouseleave');
					}.bind(this)
				}
			});
			this.directLink = new Element('a');
		}
		//outer progress bar
		this.progressContainer = new Element('div',{
			'class':this.options.progressClass,
			'styles':{
				'position':'absolute',
				'top':(this.extraSpace + this.options.spacing)/4,
				'height':(this.extraSpace + this.options.spacing)/2,
				'width' :this.windowSize.x/2,
				'left' : this.windowSize.x/4
			}
		}).inject(this.container);
		//inner progress bar
		this.progresser = new Element('div',{
			'styles':{
				'height':(this.extraSpace + this.options.spacing)/2 - 2,
				'position':'absolute',
				'top':0,
				'left':0,
				'width':0,
				'margin':'1px',
				'background-color':this.progressContainer.getStyle('border-top-color')
			},
			'tween':{
				'link':'cancel',
				'duration':'short'
			}
		}).inject(this.progressContainer);
		this.scrollArea = new Element('div',{
			styles:{
				position:'absolute',
				top:0,
				left:0,
				width:this.options.thumbSize+this.extraSpace/2,
				height:'100%'
			}
		}).inject(this.container);
		this.containerDefaultEvents();
		this.mode = "gallery";
	},
	
	//instead of calculating dimensions all the time, we set object global variable which are refreshed everytime the window is resized
	resize:function(){
		this.windowSize = this.container.getSize();
		this.perLine = (this.windowSize.x/(this.options.thumbSize+this.options.spacing)).toInt();
		this.extraSpace = ((this.windowSize.x-this.options.spacing-(this.options.thumbSize+this.options.spacing)*this.perLine)/2).toInt();
		this.mainImage = {x:this.windowSize.x-(this.options.thumbSize+10)-2*this.options.spacing,y:this.windowSize.y-2*this.options.spacing};
	},
	
	//assign resize envent to the container
	containerDefaultEvents: function(){
		//here we create a special function to assign it to the event so it can be referenced and detached later
		this.repositionImages2 = function(){
			$clear(this.resizeDelay);
			$clear(this.resizeDelay2);
			this.resizeDelay = this.repositionImages.delay(300,this);
			if(this.full&&this.loaded){
				this.resizeDelay2 =this.positionFullSize.delay(400,this);
			}
		}.bind(this);
		window.addEvent('resize',this.repositionImages2);
		this.scroll = new Fx.Scroll(this.container,{duration:'short'});
		this.grow = new Fx.Tween(this.container,{
			onStart:function(){window.removeEvent('resize',this.repositionImages2);}.bind(this),
			onComplete:function(){window.addEvent('resize',this.repositionImages2);}.delay(100,this)
		});
	},
	
	//load the thumbnail gallery
	load:function(){
		this.ready=false;
		this.loadedThumbs = new Asset.images(this.images.getKeys(),{
			onProgress:this.displayThumb.bind(this),
			onComplete:this.imagesLoaded.bind(this),
			onError:this.thumbMissing.bind(this)
		});
	},
	
	//when a thumbnail is loaded
	displayThumb:function(counter,index){
		//grab the image
		var image = this.loadedThumbs[index];
		//grow the progress bar
		this.progresser.tween('width',((this.windowSize.x*counter)/(2*this.nbrImages)).toInt()+'px');
		//calculate the image aspect ratio
		var imageRatio = image.width/image.height;
		//if it's portrait oriented
		if (imageRatio <1 ) {
			var turned=true;
			var tag_height = this.options.thumbSize;
			var tag_width = this.options.thumbSize*imageRatio;
			var add2left=((this.options.thumbSize-tag_width)/2).toInt();
			var add2top=0;
		}
		//if it's lanscape oriented
		else {
			var turned=false;
			var tag_width = this.options.thumbSize;
			var tag_height = (this.options.thumbSize/imageRatio).toInt();
			var add2top= ((this.options.thumbSize-tag_height)/2).toInt();
			var add2left=0;
		}
		//We store a bunch of data directly inside the image, so we can request them later for animations
		image.store('width',image.width);
		image.store('height',image.height);
		var top =  this.extraSpace + this.options.spacing + Math.floor(index/this.perLine)*(this.options.thumbSize+this.options.spacing) + add2top;
		var left = this.extraSpace + this.options.spacing + (index-this.perLine*Math.floor(index/this.perLine))*(this.options.thumbSize+this.options.spacing) + add2left;
		image.setStyles({
			'opacity':0,
			'width':tag_width,
			'height':tag_height,
			'position': 'absolute',
			'top':top,
			'left':left,
			'zIndex': 0,
			'cursor': 'pointer'
		}).inject(this.container);
		image.store('tag_width',tag_width);
		image.store('tag_height',tag_height);
		image.store('top',top);
		image.store('left',left);
		image.store('turned',turned);
		image.store('add2top',add2top);
		image.store('add2left',add2left);
		image.store('path',this.images.getKeys()[index]);
		image.set('morph',{link:'cancel'});
		image.get('morph').start({opacity:1}).chain(function(){this.attachDefaultEvents(image)}.bind(this));
	},
	
	// in case a thumb cannot load, we generate a dummy, because that doesn't mean the fullsize image doesn't exist, so we must be able to acces it
	thumbMissing:function(counter,index){
		//we still update the progress make
		this.progresser.tween('width',((this.windowSize.x*counter)/(2*this.nbrImages)).toInt()+'px');
		var top =  this.extraSpace + this.options.spacing + Math.floor(index/this.perLine)*(this.options.thumbSize+this.options.spacing) + this.options.thumbSize/4;
		var left = this.extraSpace + this.options.spacing + (index-this.perLine*Math.floor(index/this.perLine))*(this.options.thumbSize+this.options.spacing) + this.options.thumbSize/4;
		var url = this.images.getKeys()[index];
		var image = new Element('div',{
			'class':this.options.missingThumbClass,
			'styles':{
				'position':'absolute',
				'opacity':0,
				'width':this.options.thumbSize/2-2,
				'height':this.options.thumbSize/2-2,
				'top':top,
				'left':left,
				'zIndex': 0
			}
		}).inject(this.container);
		this.loadedThumbs[index] = image;
		image.store('width',this.options.thumbSize-2);
		image.store('height',this.options.thumbSize-2);
		image.store('tag_width',this.options.thumbSize/2-2);
		image.store('tag_height',this.options.thumbSize/2-2);
		image.store('top',top);
		image.store('left',left);
		image.store('turned',true);
		image.store('add2top',this.options.thumbSize/4);
		image.store('add2left',this.options.thumbSize/4);
		image.store('path',url);
		image.set('morph',{link:'cancel'});
		image.get('morph').start({opacity:1}).chain(function(){this.attachDefaultEvents(image)}.bind(this));
	},
	
	//all thumbnails are loaded
	imagesLoaded: function (){
		this.loaded=true;
		this.ready=true;
		//we remove the progress bar
		this.progressContainer.get('tween').start('opacity',0).chain(function(){this.progressContainer.destroy();}.bind(this));
		this.imageFx = new Fx.Elements(this.loadedThumbs,{link:'cancel'});
		this.animations = {};
		this.repositionImages();
	},
	
	//these are the event attached to a thumb in gallery mode : zoom when hovered, switch to slideshow mode when clicked
	attachDefaultEvents:function(image){
		image.removeEvents();
		image.addEvents({
			'mouseenter':this.zoom.bindWithEvent(this),
			'mouseleave':this.dezoom.bindWithEvent(this),
			'click':this.toMenu.bindWithEvent(this)
		});
	},
	
	//zoom an image when hoverd
	zoom:function(e) {
		var image = $(e.target);
		if (this.mouseDown){return;}
		image.store('zoomed',true);
		image.setStyle('zIndex', 2);
		var morph = image.get('morph');
		morph.clearChain();
		morph.start({'width': image.retrieve('width'), 'height': image.retrieve('height'), 'top': (image.retrieve('top')-(image.retrieve('height')-image.retrieve('tag_height'))/2).toInt(), 'left':  (image.retrieve('left')-(image.retrieve('width')-image.retrieve('tag_width'))/2).toInt()});
	},

	//thummb returns to default size
	dezoom:function(e) {
		var image = $(e.target);
		image.store('zoomed',false);
		image.setStyle('zIndex', 1);
		var morph = image.get('morph');
		morph.clearChain();
		morph.chain(function(){
			if (!this.retrieve('zoomed')){
				this.setStyle('zIndex', 0);
			}
		}.bind(image));
		morph.start({'width': image.retrieve('tag_width'), 'height': image.retrieve('tag_height'), 'top': image.retrieve('top'), 'left':  image.retrieve('left')});
	},
	
	//this function transform the gallery to slideshow
	toMenu:function(e){
		if(!this.ready){return false;}
		this.mode = 'menu';
		this.index = -1;
		this.mouseScroll=function(ev){
			this.scrolling=true;
			$clear(this.scrollDelay);
			this.scrollDelay = function(){
				this.scrolling=false;
				this.loadHiRez();
			}.delay(500,this);
			this.scrollSideBar(ev);
		}.bindWithEvent(this);
		this.scrollArea.addEvent('mousewheel',this.mouseScroll);
		this.loadedThumbs.each(this.attachScrollEvents,this);
		this.scrollSideBar(e);
	},
	
	//new event for thumbnails when in slideshow mode
	attachScrollEvents:function(image){
		image.removeEvents();
		var morph = image.get('morph');
		morph.cancel().clearChain();
		image.addEvents({
			'mouseenter':function(){
				morph.start({opacity:1});
				this.thumbOpacChain(image);
				image.store('timer',this.thumbOpacChain.periodical(1000,this,image));
			}.bind(this),
			'mouseleave':function(){
				$clear(image.retrieve('timer'));
				morph.start({opacity:this.retrieve('opa')});
			},
			'click':this.scrollSideBar.bindWithEvent(this)
		});
	},
	
	//function for loop opacity effect on thumbnail in slideshow mode
	thumbOpacChain: function(image) {
		var morph = image.get('morph');
		morph.start({opacity:1}).chain(function(){morph.start({opacity:image.retrieve('opa')});});
	},
	
	//scroll the sidebar up or down, depending on the event passed as argument, and load the corresponding fullsize picture
	scrollSideBar:function(e){
		this.mouseDown = false;
		e.stop();
		var thumbs = this.images.getKeys();
		var index = this.getImgForScroll(e,thumbs);
		if (index==this.index){return;}
		this.index=index;
		this.start = this.max(this.index-3,0);
		this.stop = this.min(this.index+3,thumbs.length-1);
		if(this.scrolling){
			this.repositionImages();
		}else{
			this.grow.start('height',this.originalHeight).chain(function(){
				
				this.repositionImages();
				this.loadHiRez();
			}.bind(this));
		}
		
	},
	
	//uses the event to find the slideshow index. Test if event is mousewheel up or down, or a click
	getImgForScroll:function(event,thumbs){
		if (event.wheel<0) {
			return this.min(thumbs.length-1,this.index+1);
		} else if (event.wheel>0) {
			return this.max(0,this.index-1);
		} else {
			return thumbs.indexOf($(event.target).retrieve('path'));
		}
	},

	//remove existing fullsize image and load the curret one
	loadHiRez:function(){
		this.mouseDown = false;
		var fullSource = this.images.getValues()[this.index];
		var img = this.loadedThumbs[this.index];
		this.loaded=false;
		if (this.full){
			this.full.fireEvent('mouseleave').destroy();
			this.full=false;
		}
		this.container.setStyle('background-image','url('+this.options.loadingImg+')');
		this.error.dispose();
		this.full = new Asset.image(fullSource, {
			onload:this.displayHiRez.bind(this,img),
			onerror:this.displayError.bind(this,fullSource)
		});
		this.full.store('turned',img.retrieve('turned'));
		this.full.store('path',fullSource);
	},
	
	//if fullsize iamge canot be loaded, display error message
	displayError:function(path){
		if(this.loaded){return;}
		this.full=false;
		this.error.set('html','The image '+ path + ' could not load.');
		this.error.setStyles({
			'top':this.windowSize.y/2
		}).inject(this.container);
		this.container.setStyle('background-image','');
	},
	
	//once the new fullsize has loaded, set its position where the source image was (gallery or slideshow thumbnail). Prepare caption, and call the positionning animation
	displayHiRez:function(sourceImage){
		this.container.setStyle('background-image','');
		var coords = sourceImage.getCoordinates(this.container);
		this.full.setStyles({
			'position':'absolute',
			'width':coords.width,
			'height':coords.height,
			'top':coords.top,
			'left':coords.left,
			'opacity':0,
			'cursor':'pointer',
			'z-index':90
		}).inject(this.container);
		if (this.caption){
			var caption = 'Direct Link : ';
			if(this.captions.has(this.full.retrieve('path'))){
				caption = this.captions.get(this.full.retrieve('path'))+'<br/>' + caption;
			}
			this.caption.set('html',caption);
			var link = decodeURI(this.full.get('src'));
			if(!link.contains('http')){
				link = 'http://'+location.hostname+link;
			}
			this.directLink.set({'href':link,'html':link}).inject(this.caption);
			
		}
		this.loaded=true;
		this.full.set('morph',{link:'ignore'});
		this.positionFullSize();
	},
	
	//function to turn back from slideshow to gallery mode
	toGallery:function(e){
		$clear(this.scrollDelay);
		this.scrolling=false;
		this.mode = 'gallery';
		var event = new Event(e).stop();
		var image = $(event.target);
		image.fireEvent('mouseleave');
		this.loadedThumbs.removeEvents();
		this.loadedThumbs.each(this.attachDefaultEvents,this);
		this.scrollArea.removeEvent('mousewheel',this.mouseScroll);
		this.container.setStyle('background-image','');
		this.repositionImages();
		if (this.full){
			this.full.fireEvent('mouseleave');
			this.full.get('morph').start({opacity:0}).chain(function(){
				if(this.caption){
					this.caption.dispose();
					this.full.destroy();
					this.full=false;
				}
			}.bind(this));
		}
	},
	
	//reposition all images. Test if gallery or slideshow mode
	repositionImages:function(){
		this.resize();
		this.ready=false;
		this.scroll.toTop();
		if(this.mode == "gallery"){
			if(!this.loaded){return;}
			this.loadedThumbs.each(function(image,index){
				var top =  (this.extraSpace + this.options.spacing + Math.floor(index/this.perLine)*(this.options.thumbSize+this.options.spacing) + image.retrieve('add2top')).toInt();
				var left = (this.extraSpace + this.options.spacing + (index-this.perLine*Math.floor(index/this.perLine))*(this.options.thumbSize+this.options.spacing) + image.retrieve('add2left')).toInt();
				image.store('top',top);
				image.store('left',left);
				this.animations[index]={
					'opacity':1,
					'width':image.retrieve('tag_width'),
					'height':image.retrieve('tag_height'),
					'top':top,
					'left':left,
					'zIndex': 0
				};
			},this);
			var push = true;
		}else{
			this.loadedThumbs.each(function(image,i){
				var z = i-this.index;
				var funct_val = 1/(1+1.2*(Math.abs(z)));
				var top_val = this.windowSize.y*(1+1.1*z/(2+(Math.abs(z))))/2-(this.options.thumbSize+this.options.spacing)/2;
				image.setStyles({
					'display':'block',
					'visibility':'visible',
					'z-index':this.loadedThumbs.length-Math.abs(z)
				});
				if ((i<this.start)||(i>this.stop)){
					var opacity = 0;
				}
				else{
					var opacity = funct_val;
				}
				image.store('opa',opacity);
				this.animations[i]={
					'top':(top_val+(this.options.thumbSize-image.retrieve('tag_height')*funct_val)/2).toInt(), 
					'left':(10+(this.options.thumbSize-image.retrieve('tag_width')*funct_val)/2).toInt(), 
					'width':(image.retrieve('tag_width')*funct_val).toInt(), 
					'height':(image.retrieve('tag_height')*funct_val).toInt(),
					'opacity':opacity
				};
			},this);
			var push = false;
		}
		this.imageFx.start(this.animations).chain(function(){
			this.ready=true;
			this.updatePusher(push);
		}.bind(this));
	},

	//reposition the full size image : this function is called when a new image has loaded, or when the window is resized
	//this function reassign events to the caption
	positionFullSize:function(){
		var origin = this.full.getSize();
		var clone = this.full.clone();
		clone.setStyles({
			visibility:'hidden',
			width:'auto',
			height:'auto'
		}).inject(this.container);
		var newSize = clone.getSize();
		clone.destroy();
		if (this.full.retrieve('turned')){
			var height = this.min(this.mainImage.y,newSize.y);
			var width = (newSize.x*height/newSize.y).toInt();
			if(width>this.mainImage.x){
				var width = this.mainImage.x;
				var height = (newSize.y*width/newSize.x).toInt();
				
			}
		}else{
			var width = this.min(this.mainImage.x,newSize.x);
			var height = (newSize.y*width/newSize.x).toInt();
			if(height>this.mainImage.y){
				var height = this.mainImage.y;
				var width = (newSize.x*height/newSize.y).toInt();
			}
		}
		
		var top = (this.options.spacing+(this.mainImage.y-height)/2).toInt();
		var left = (this.options.thumbSize + 10 + this.options.spacing+(this.mainImage.x-width)/2).toInt();
		this.full.get('morph').start({
			'opacity':1,
			'left':left,
			'top':top,
			'width':width,
			'height':height
		}).chain(function(){
			this.ready=true;
			this.updatePusher();
			if(this.caption){
				var coordinates = this.full.getCoordinates(this.container);
				this.caption.setStyles({
					'top':coordinates.bottom+'px',
					'height':0,
					'left':coordinates.left,
					'width':coordinates.width
				}).inject(this.container);
				this.full.removeEvents();
				this.full.addEvents({
					'mouseenter':function(){
						if(!this.ready){return;}
						$clear(this.captionDelay);
						var coords = this.full.getCoordinates(this.container);
						this.caption.get('morph').start({'top':coords.bottom-45,'height':45});
					}.bind(this),
					'mouseleave':function(){
						var coords = this.full.getCoordinates(this.container);
						this.captionDelay=(function(){this.caption.get('morph').start({'top':coords.bottom,'height':0})}).delay(100,this);
					}.bind(this),
					'mousemove':function(){
						this.removeEvents('mousemove');
						this.fireEvent('mouseenter');
					},
					'click':this.toGallery.bind(this)
				});
			}else{
				this.full.removeEvents();
				this.full.addEvent('click',this.toGallery.bind(this));
			}
		}.bind(this));
	},
	
	//repostion the pusher div if necessary
	updatePusher:function(push){
		this.container.setStyle('overflow','hidden');
		this.pusher.dispose();
		if(push){
			this.pusher.setStyles({
				'top':this.loadedThumbs[this.loadedThumbs.length-1].getCoordinates(this.container).bottom,
				'height':this.extraSpace+this.options.spacing
			}).inject(this.container);
			this.grow.start('height',this.pusher.getCoordinates(this.container).bottom);
			this.resize();
		}		
	},
	
	//in case you want to remove the gallery dynamcally.
	destroy:function(){
		this.container.empty();
		window.removeEvent('resize',this.repositionImages2);
		this.scrollArea.removeEvent('mousewheel',this.mouseScroll);
	},

	//utility function to return the minimum between two values
	min:function(a,b) {
		return( (a<b) ? a : b );	
	},
	
	//utility function to return the maximum between two values
	max:function(a,b){
		return( (a>b) ? a : b );	
	}
});