$require(MPR.path + 'Core/Core.Small.js');
$require(MPR.path + 'Core/Request/Request.js');
$require(MPR.path + 'More/Fx.Accordion/Fx.Accordion.js');
$require(MPR.path + 'Core/Fx/Fx.Tween.js');

window.addEvent('domready', function() {
	var current = 0;
	$$('#menu h4').each( function(el, i) {
		if( el.get('text') == MenuPath )
			current = i;
	});

	var accordionStruc = new Fx.Accordion( $$('#menu h4'), $$('div.accordionContent'), {
		alwaysHide: true,
		show: current,
		onActive: function(toggler, element){
			toggler.setStyle('color', '#FD5C01');
			toggler.setStyles( { 'border-width' : '1px 1px 0' } );
			toggler.getElement('span').setStyle('background-position', '-25px');
		},
		onBackground: function(toggler, element){
			toggler.setStyle('color', '#000');
			toggler.setStyles( { 'border-width' : '1px' } );
			toggler.getElement('span').setStyle('background-position', '0');
		}
	});
	
	var SearchResult = $('searchResult');
	
	SearchResult.fade('hide');
	var SearchRequest = new Request({
		url: 'MprAdmin.php',
		onRequest: function() {
			SearchResult.set('html', '<img src="Mpr/Resources/css/img/ajax-loader.gif" alt="loading..." class="spinner" />');
			SearchResult.fade(1);
		},
		onComplete: function(els) {
			SearchResult.set('html', els);
			if( SearchResult.getStyle('opacity') == 1 )
				SearchResult.highlight();
		}
	});
	
	$('searchForm').addEvent('submit', function(e) {
		e.stop();
		SearchRequest.get( {ajax: 1, mode: 'search', query: $('searchInput').get('value')} );
	});
	
	document.addEvent('click', function(e){
		if (e.target != SearchResult && !SearchResult.hasChild(e.target) ) 
			SearchResult.fade(0);
	});
	
});