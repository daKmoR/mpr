Array.implement({
	insensitiveSort: function() {
		var result = [], tmp = [], tmpH = $H();
		this.each(function(val) {
			tmp.push(val.toString().toLowerCase());
			tmpH.include(val, val.toString().toLowerCase());
		});
		tmp = tmp.sort();
		tmp.each(function(val) {
			result.push(tmpH.keyOf(val));
		});
		return result;
	}
});