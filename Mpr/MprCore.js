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
			// new Request({ url: source, async: false, evalResponse: true, method: 'get',
				// onComplete: function() {
					// return new Element('script', {src: source, type: 'text/javascript'}).inject(document.head);
				// }
			// }).send();
			return true;
		}
		case '.css': {
			//return new Element('link', { rel: 'stylesheet', media: 'screen', type: 'text/css', href: source }).inject(document.head);
			return true;
		}
	}
	
	alert('The required file "' + source + '" could not be loaded');
}

var Asset = Asset || {};
Asset.styles = function(rules, media) {
	var media = media || 'screen';
	if( Browser.Engine.trident ) {
		var obj = new Element('style', { type: 'text/css', media: media }).inject( document.head );
		obj.styleSheet.cssText = rules;
	} else 
		new Element('style', {type: 'text/css', media: media, text: rules}).inject( document.head );
}
MPR.files[MPR.path + 'Tools/Asset.Styles/Asset.Styles.js'] = 1;