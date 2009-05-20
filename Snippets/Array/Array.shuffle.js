Array.implement({
  shuffle: function() {
		var v = $unlink(this);
		for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
  }
}); 

// differnt implementation?
/*
Array.implement({
	shuffle:function() {
		this.sort(function (x,y) { return Math.floor(Math.random()*3)-1; });
		return this;
	}
});
*/