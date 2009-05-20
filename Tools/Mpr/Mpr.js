/*
Script: MprCore.js
	Provides methods to dynamically load JavaScript and CSS.

	License:
		MIT-style license.

	Authors:
		Thomas Allmer
*/

var MPR = MPR || {};

// path can also be empty, so we can't use MPR.path = MPR.path || 'MPR/';
if ( typeof(MPR.path) === 'undefined' )
	MPR.path = 'MPR/';

MPR.files = MPR.files || [];

// create a dummy function so it won't throw errors
var Request = Request || function Request(){ alert('You need at least Core/Request/Request.js with it depences if you want to use the $require() function'); };

var Asset = Asset || {};
Asset.styles = Asset.styles || function() { alert('You need at least Tools/Asset.Styles/Asset.Styles.js if you want to include css inside js'); };
	
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