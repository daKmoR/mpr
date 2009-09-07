Array.implement({
	getCombinedSize: function(margin){
		var margin = margin || true;
		var elsWidth = 0, elsHeight = 0, size;
		for (var i = 0, l = this.length; i < l; i++){
			size = this[i].getSize();
			elsWidth += size.x + (margin ? this[i].getStyle('margin-left').toInt() + this[i].getStyle('margin-right').toInt() : 0);
			elsHeight += size.y + (margin ? this[i].getStyle('margin-top').toInt() + this[i].getStyle('margin-bottom').toInt() : 0);
		}
		return {x: elsWidth, y: elsHeight};
	}
});