Class.Initializers.Singleton = function(){
	
	var init = this._init_;

	this._init_ = function(){
		var instance = init.apply(this, arguments) || this;
		
		this.constructor.prototype.initialize = function(){
			return instance;
		};
		
		return instance;
	};
	
};