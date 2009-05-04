/**
 * allows to resize a image to it's parent size (mostly used to resize a background image to always "fill" the full window)
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Ryan Florence <rpflorence@gmail.com>
 * @copyright Copyright belongs to the respective authors
 */
 
var Resize = new Class({
	Implements : Options,
	
	options: {
		mode : 'fill',
		verticalAnchor : 'center',
		horizontalAnchor : 'center'
	},
	
	initialize : function(img, options){
		this.setOptions(options);
		this.img = $(img);
		this.container = this.img.getParent();
		this.container.setStyle('overflow', 'hidden');
		if(this.container.getStyle('position') != 'absolute' && this.container != document.body) this.container.setStyle('position', 'relative');
		this.resize = this.setDimensions.bind(this);
		this.resize();
		this.attach();
	},
	
	getDimensions : function(){
		this.dimensions = [this.img.getSize(), this.container.getSize()];
	},
	
	setDimensions : function(){
		this.getDimensions();
		switch (this.options.mode){
			case 'fill': this.fill(); break;
			case 'fit': this.fit(); break;
			case 'stretch': this.stretch();
		}
	},
	
	fill : function(){
		if(this.dimensions[0].x / this.dimensions[0].y >= this.dimensions[1].x / this.dimensions[1].y) { 
			this.img.setStyles({
				'height': this.dimensions[1].y,
				'width' : '',
				'left' : '',
				'top' : ''
			});
			this.getDimensions();
			switch(this.options.horizontalAnchor){
				case 'center': this.img.setStyle('left', -(this.dimensions[0].x - this.dimensions[1].x) / 2); break;
				case 'right': this.img.setStyle('left', -(this.dimensions[0].x - this.dimensions[1].x) );
			}			
		} else { 
			this.img.setStyles({
				'height': '',
				'width' : this.dimensions[1].x,
				'left' : '',
				'top' : ''
			});
			this.getDimensions();
			switch(this.options.verticalAnchor){
				case 'center': this.img.setStyle('top', -(this.dimensions[0].y - this.dimensions[1].y) / 2); break;
				case 'bottom': this.img.setStyle('top', -(this.dimensions[0].y - this.dimensions[1].y) );
			}
		}
	},
	
	stretch : function(){
		this.img.setStyles({
			'height' : this.dimensions[1].y,
			'width' : this.dimensions[1].x
		});
	},
	
	fit : function(){
		if(this.dimensions[0].x / this.dimensions[0].y >= this.dimensions[1].x / this.dimensions[1].y) { 
			this.img.setStyles({
				'height': '',
				'width' : this.dimensions[1].x,
				'left' : '',
				'top' : ''
			});
			this.getDimensions();
			switch(this.options.verticalAnchor){
				case 'center': this.img.setStyle('top', (this.dimensions[1].y - this.dimensions[0].y) / 2); break;
				case 'bottom': this.img.setStyle('top', this.dimensions[1].y - this.dimensions[0].y);
			}
		} else { 
			this.img.setStyles({
				'height': this.dimensions[1].y,
				'width' : '',
				'left' : '',
				'top' : ''
			});
			this.getDimensions();
			switch(this.options.horizontalAnchor){
				case 'center': this.img.setStyle('left', (this.dimensions[1].x - this.dimensions[0].x) / 2); break;
				case 'right': this.img.setStyle('left', this.dimensions[1].x-this.dimensions[0].x);
			}
		}
	},
	
	attach : function(){
		window.addEvent('resize', this.resize);
	},
	
	detach : function(){
		window.removeEvent('resize', this.resize);
	}
	
});