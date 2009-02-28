function MPRNotAvailable(plugin) {
	new StickyWinModal({
		content: $('info').get('html').substitute( { 'plugin' : plugin } ) ,
		position: 'center'
	});
}
var UvumiGallery = new Class({ 
	initialize: function() {
		MPRNotAvailable('Galleries/UvumiGallery/UvumiGallery.js'); 
	} 
});

Element.implement({
	beat: function(radius,rate){
		MPRNotAvailable('Visual/Element.beat/Element.beat.js'); 
	}
});