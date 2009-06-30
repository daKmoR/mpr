$require(MPR.path + 'Core/Element.Dimensions/Element.Dimensions.js');
$require(MPR.path + 'Core/Fx.Transitions/Fx.Transitions.js');

Element.implement({
	beat: function(radius,rate){
		radius = radius || 2;
		rate = rate || 70;
		duration = (60000/(4*rate)).toInt();
		var parent = this.getParent();
		if(parent != $(document.body) && parent.getStyle('position')=='static'){
			parent.setStyle('position','relative');
		}
		var position = this.getStyle('position');
		if(position=='static'){
			this.setStyle('position','relative');
			position = 'relative';
		}
		if(Browser.Engine.trident){
			parent.setStyle('height',parent.getStyle('height'));
		}
		var coords = this.getCoordinates(parent);
		if(position == 'relative' && !Browser.Engine.presto){
			coords.left -= parent.getStyle('paddingLeft').toInt();
			coords.top -= parent.getStyle('paddingTop').toInt();
		}
		this.set('morph',{
			link:'chain',
			transition:Fx.Transitions.Back.easeOut,
			duration:duration
		}).store('coords',coords);
		var hr = function(){
			var coords = this.retrieve('coords');
			this.morph({
			top: coords.top - radius,
			left: coords.left - radius,
			width: coords.width + 2*radius,
			height : coords.height + 2*radius
			}).morph(coords);
		};
		hr.call(this);
		hr.periodical((60000/rate).toInt(),this);
		return this;
	}
});