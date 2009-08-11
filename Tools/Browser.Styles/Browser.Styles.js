$require('Core/Core/Browser.js');

Browser.styles = function(rules, media) {

	var media = media || 'screen';
	if( Browser.Engine.trident ) {
		if( !Browser.Engine.trident4 ) {
			var obj = new Element('style', { type: 'text/css', media: media }).inject( document.head );
			obj.styleSheet.cssText = rules;
		} else {
			window.addEvent('domready', function() {
				var obj = new Element('style', { type: 'text/css', media: media }).inject( document.head );
				obj.styleSheet.cssText = rules;
			});
		}
	} else {
		new Element('style', {type: 'text/css', media: media, text: rules}).inject( document.head );
	}
	
}