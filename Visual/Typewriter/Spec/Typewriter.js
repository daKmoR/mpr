/*
Script: Element.Measure.js
	Specs for Element.Measure.js

License:
	MIT-style license.
*/

$require(MPR.path + 'Visual/Typewriter/Typewriter.js');

(function(){
	var div, writer;
	window.addEvent('domready', function(){
		div = new Element('div', {
			html: 'here comes some text'
		}).inject(document.body);
		writer = new Typewriter( div, {auto: false} );
	});
	
	describe('Typewriter', {

		'test if the text gets reset on start': function(){
			value_of(div.get('html')).should_be('');
			value_of(writer.options.cursor).should_be(0);
		},
		
		'test if the text is corretly cut': function() {
			writer.setLetter(4);
			value_of(div.get('html')).should_be('here');
		},
		
		'does the reset function work': function() {
			writer.setLetter(4);
			writer.reset();
			value_of(div.get('html')).should_be('');
			value_of(writer.options.cursor).should_be(0);
		}

	});

})();	