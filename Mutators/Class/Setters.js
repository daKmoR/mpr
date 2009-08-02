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

Class.Mutators.Setters = function(secrets){
	secrets = $splat(secrets);
	
	this.implement('set', function(prop, value){
		switch ($type(prop)){
			case 'object':
				for (var p in prop) this.set(p, prop[p]);
				break;
			case 'string':
				if (secrets.contains(prop)){
					var setter = this['set' + prop.capitalize()];
					if (setter) setter.call(this, value);
					else this[prop] = value;
				}
		}
		return this;
	});
};