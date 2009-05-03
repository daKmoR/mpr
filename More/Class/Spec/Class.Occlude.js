/*
Script: Class.Occlude.js
	Specs for Class.Occlude.js

License:
	MIT-style license.
*/

$require(MPR.path + 'More/Class.Occlude/Class.Occlude.js');

(function(){
	var testDiv = new Element('div');
	var Tester = new Class({
		Implements: Class.Occlude,
		property: "Tester",
		initialize: function(element){
			this.element = $(element);
			if (this.occlude()) return this.occluded;
		}
	});

	var t1 = new Tester(testDiv);
	var t2 = new Tester(testDiv);
	describe('Class.Occlude', {

		'verifies that occluded classes equate': function(){
			value_of(t1).should_be(t2);
		}

	});
})();
