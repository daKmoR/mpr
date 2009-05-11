/**
 * Singleton Mutator
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		N. White
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Mutators/Class/Initializers.js');

Class.Initializers.Binds = function(binds){
	
	if (binds === true) {
		for (var name in this) {
			if (this[name]._origin && name != 'initialize' && name != '_current')
				this[name] = this[name].bind(this);
		}
	} else {
		$splat(binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);
	}
	
};