/*
Script: Class.Refactor.js
	Specs for Class.Refactor.js

License:
	MIT-style license.
*/

$require(MPR.path + 'More/Class.Refactor/Class.Refactor.js');

(function(){
	var Test = new Class({
		options: {
			foo: 'bar',
			something: 'else'
		},
		untouched: function(){
			return 'untouched';
		},
		altered: function(){
			return 'altered';
		}
	});
	Test.static_method = function(){ return 'static';};
	Test = Class.Refactor(Test, {
		options: { foo: 'rab' },
		altered: function(){
			return 'this is ' + this.previous();
		}
	});
	var Test2 = new Class({
		altered: function(){
			return 'altered';
		}
	});
	Test2 = Class.Refactor(Test2, {
		altered: function(){
			return 'this is ' + this.previous();
		}
	});
	Test2 = Class.Refactor(Test2, {
		altered: function(){
			return this.previous() + ' for reals.';
		}
	});

	describe('Class.Refactor', {

		'should return a method that has been altered twice': function(){
			value_of(new Test2().altered()).should_be('this is altered for reals.');
		},

		'should return an unaltered method': function(){
			value_of(new Test().untouched()).should_be('untouched');
		},

		'should return an altered method': function(){
			value_of(new Test().altered()).should_be('this is altered');
		},

		'should return an altered property': function(){
			value_of(new Test().options.foo).should_be('rab');
		},

		'should return an unaltered property': function(){
			value_of(new Test().options.something).should_be('else');
		}

	});
})();