Array.implement({
	getCombinedSize: function(){
		var elsWidth = 0, elsHeight = 0;
		for (var i = 0, l = this.length; i < l; i++){
			elsWidth += this[i].getSize().x;
			elsHeight += this[i].getSize().y;
		}
		return {x: elsWidth, y: elsHeight};
	}
});