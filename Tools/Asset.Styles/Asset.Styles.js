var Asset = Asset || {};
Asset.styles = function(rules, media) {
	var media = media || 'screen';
	if( Browser.Engine.trident ) {
		var obj = new Element('style', { type: 'text/css', media: media }).inject( document.head );
		obj.styleSheet.cssText = rules;
	} else 
		new Element('style', {type: 'text/css', media: media, text: rules}).inject( document.head );
}