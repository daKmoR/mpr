/**
 * Singleton Mutator
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		N. White
 * @copyright Copyright belongs to the respective authors
 */

Class.Initializers = {};

Class.Mutators.initialize = function(initialize){
	
	return function(){
		this._init_ = initialize;
		
		for (var modifier in Class.Initializers) {
			if (!this[modifier]) continue;
			this[modifier] = Class.Initializers[modifier].call(this, this[modifier]);
		}
		
		return this._init_.apply(this, arguments);
	};
	
};