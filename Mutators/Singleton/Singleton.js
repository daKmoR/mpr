/**
 * Singleton Mutator
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		N. White
 * @copyright Copyright belongs to the respective authors
 */

Class.Mutators.Singleton = function(self,flag){
	if(!flag) return;
	self.constructor.__instance = undefined;
	if($defined(self.initialize) && $type(self.initialize) == 'function') var init = self.initialize;
	self.initialize = function(){
		if(!$defined(this.constructor.__instance)){
			if($defined(init) && $type(init) == 'function') init.apply(this,arguments);
			this.constructor.__instance = this;
		}
		return this.constructor.__instance;
	}
}