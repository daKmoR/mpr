Element.implement({
	
	getNearestParent: function(a, b){
		var a = this.getParent(a), b = this.getParent(b);
		return (!a || !b) ? a || b : (a.hasChild(b) ? b : a);
	}
	
});