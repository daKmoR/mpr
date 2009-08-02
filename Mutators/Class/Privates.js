/**
 * Singleton Mutator
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		N. White
 * @copyright Copyright belongs to the respective authors
 */

$require('Mutators/Class/Initializers.js');

Class.Initializers.Privates = function(privates){
	var Private = function(){};
	Private.prototype = this;
	var internal = new Private;		// internal inherits public properties
	internal.Public = this;
	
	// bind a method to the private object
	var publicize = function(original){
		return function(){
			var result = original.apply(internal, arguments);
			
			// return public object instead of internal if called from outside
			return (result == internal && internal.caller == null) ? internal.Public : result;
		};
	};
	
	// copy private properies into internal
	for (var name in privates){
		var item = privates[name];
		internal[name] = ($type(item) == 'function') ? item.bind(internal) : $unlink(item);
	}
	
	// bind public methods to internal object
	for (var name in this){
		if (this[name]._origin && name != 'initialize' && name != '_current')
			this[name] = publicize(this[name]);
	}
};