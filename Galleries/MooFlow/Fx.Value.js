Fx.Value = new Class({
	Extends: Fx,
	compute: function(from, to, delta){
		this.value = Fx.compute(from, to, delta);
		this.fireEvent('motion', this.value);
		return this.value;
	},
	get: function(){
		return this.value || 0;
	}
});