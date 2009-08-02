/*
Script: Element.Measure.js
	Specs for Element.Measure.js

License:
	MIT-style license.
*/

$require('Snippets/MprDummyPlugin/MprDummyPlugin.js');

(function(){
	var div, p, dummy;
	window.addEvent('domready', function(){
		p = new Element('p', {
			html: 'here comes some text',
			id: 'text'
		}).inject(document.body);
		div = new Element('div', { id: 'log' }).inject(document.body);
		dummy = new MprDummyPlugin( p );
	});
	
	describe('Typewriter', {

		'test if nothing is changed on start': function(){
			value_of(div.get('html')).should_be('');
			value_of(p.get('html')).should_be('here comes some text');
		},
		
		'test if content is cloned if a parameter is given': function() {
			dummy.show( div );
			value_of(div.get('html')).should_be('<p>here comes some text</p>');
		}
		
	});

})();	