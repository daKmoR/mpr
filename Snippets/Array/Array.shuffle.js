Array.implement({
  shuffle: function() {
		var v = $unlink(this);
		for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
  }
}); 