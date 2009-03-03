/**
 * Binds for Function
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Aaron N.
 * @copyright Copyright belongs to the respective authors
 */

Class.Mutators.Binds = function(self, binds) {
	if (!self.Binds) return self;
	delete self.Binds;
	var oldInit = self.initialize;
	self.initialize = function() {
		Array.flatten(binds).each(function(binder) {
			var original = this[binder];
			this[binder] = function(){
				return original.apply(this, arguments);
			}.bind(this);
			this[binder].parent = original.parent;
		}, this);
		return oldInit.apply(this,arguments);
	};
	return self;
};