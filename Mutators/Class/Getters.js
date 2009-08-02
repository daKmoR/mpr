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

Class.Mutators.Getters = function(secrets){
	secrets = $splat(secrets);
	
	this.implement('get', function(prop){
		if (!secrets.contains(prop)) return null;
		var getter = this['get' + prop.capitalize()];
		return (getter) ? getter.call(this) : this[prop];
	});
};