Array.implement({
	getCombinedSize: function(){
		var elsWidth = 0, elsHeight = 0, size;
		for (var i = 0, l = this.length; i < l; i++){
			size = this[i].getSize();
			elsWidth += size.x;
			elsHeight += size.y;
		}
		return {x: elsWidth, y: elsHeight};
	}
});