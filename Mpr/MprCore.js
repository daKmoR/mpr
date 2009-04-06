/*
Script: MprCore.js
	Provides methods to dynamically load JavaScript and CSS.

	License:
		MIT-style license.

	Authors:
		Thomas Allmer
*/

var MPR = MPR || {};
if ( typeof(MPR.path) === 'undefined' )
	MPR.path = 'MPR/';

if ( typeof(MPR.files) === 'undefined' )
	MPR.files = [];
	
function $require(source) {
	if ( MPR.files[source] ) return true;
	MPR.files[source] = 1;
	
	switch ( source.match(/\.\w+$/)[0] ) {
		case '.js': {
			new Request({ url: source, async: false, evalResponse: true, method: 'get',
				onComplete: function() {
					return new Element('script', {src: source, type: 'text/javascript'}).inject(document.head);
				}
			}).send();
			return true;
		}
		case '.css': {
			return new Element('link', { rel: 'stylesheet', media: 'screen', type: 'text/css', href: source }).inject(document.head);
		}
	}
	
	alert('The required file "' + source + '" could not be loaded');
}