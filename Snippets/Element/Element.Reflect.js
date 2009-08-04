Element.implement({
	reflect: function(arg){
		i = arg.img.clone();
		//forces absolute urls - needed for canvas
		i.src = i.src;
		if(Browser.Engine.trident){
			i.style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity=40, style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+100*arg.ref+')';
			i.setStyles({'width':'100%', 'height':'100%'});
			return new Element('div').adopt(i);
		} else {
			var can = new Element('canvas').setProperties({'width':arg.width, 'height':arg.height});
			if(can.getContext){
				var ctx = can.getContext('2d');
				ctx.save();
				ctx.translate(0,arg.height-1);
				ctx.scale(1,-1);
				ctx.drawImage(i, 0, 0, arg.width, arg.height);
				ctx.restore();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillStyle = arg.color;
				ctx.fillRect(0, arg.height*0.5, arg.width, arg.height);
				var gra = ctx.createLinearGradient(0, 0, 0, arg.height*arg.ref);					
				gra.addColorStop(1, 'rgba(255, 255, 255, 1.0)');
				gra.addColorStop(0, 'rgba(255, 255, 255, '+(1-arg.ref)+')');
				ctx.fillStyle = gra;
				ctx.rect(0, 0, arg.width, arg.height);
				ctx.fill();
				delete ctx, gra;
			}
			return can;
		}
	}
});