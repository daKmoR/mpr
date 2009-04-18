Class: AutoMultiOverlays {#AutoMultiOverlays}
=============================

Allows you to create multiple image overlays for an image with imagemap by defining the overlay images in the title tag. All used images should have the same size.

Just include the AutoMultiOverlay and set the CSS-Class "MultiOverlay" for images that should be used.
These images must have the "usemap" property. In the title tag of the areas for the map give the url to the overlay image.

	//either require it or build a costum library for the page using it.
	$require(MPR.path + 'Visual/MultiOverlays/AutoMultiOverlays.js');

Class: MultiOverlay {#MultiOverlay}
=============================

Allows you to create multiple image overlays for an image with imagemap by defining the overlay images in the title tag. All used images should have the same size.

### Syntax:

	var myMultiOverlay = new MultiOverlay(element[, options]);

### Arguments:

1. element   - (*element*) single image with an imagemap
2. options   - (*object*, optional) See options below.

#### Options:
* activeClass     - (*string*: defaults to "active") the class that can be set to active an area by default
* onInit          - (*function*: default to *see below*) fires once an element (area) gets attached
* onShow          - (*function*: default to *see below*) fires when an area is hovered and not active
* onHide          - (*function*: default to *see below*) fires when an area is left and not set to active

### Events:
These are the default settings for the events
	
	onInit: function(overlay, active) {
		if ( active )
			overlay.addClass( this.options.activeClass );
		else
			overlay.fade('hide');
	}
	
	onShow: function(overlay) {
		overlay.fade(1);
	}
	
	onHide: function(overlay) {
		overlay.fade(0);
	}

### Returns:

* (*object*) A new MultiOverlay instance.

MultiOverlay Method: attach {#MultiOverlay:attach}
----------------------------------------------------

Attaches another area to the MultiOverlay

### Syntax:

	myMultiOverlay.attach(element);

### Arguments:

1. element - (*element*) an area from an imagemap that should be attached

### Returns:

* nothing

### Examples:

	myMultiOverlay.attach( $('myArea') );
	
MultiOverlay Example: html {#MultiOverlay:html}
----------------------------------------------------

	<img id="source" usemap="#MultiOverlayMap" src="MultiOverlay.bg.gif" alt="MultiOverlay" />
	<map name="MultiOverlayMap" id="MultiOverlayMap">
		<area href="#" shape="rect" title="MultiOverlay.A.gif" alt="A" coords="226,81,320,178" />
		<area href="#" shape="poly" title="MultiOverlay.B.gif" alt="B" coords="262,36,280,33,288" />
	</map>
	
	
Class: MultiOverlays {#MultiOverlays}
=============================

Allows you to create Multiple MultiOverlays

### Syntax:

	var myMultiOverlays = new MultiOverlays(elements[, options]);

### Arguments:

1. elements  - (*elements*) array of images with an imagemap
2. options   - (*object*, optional) will be passed on to the options of MultiOverlay.

### Returns:

* (*object*) A new MultiOverlays instance.

### Examples:

	var myMultiOverlays = new MultiOverlays( $$('.myImages') );
	
MultiOverlays Method: getMultiOverlays {#MultiOverlays:getMultiOverlays}
--------------------------------------

get all the MultiOverlay instances as an array 

### Syntax:

	myMultiOverlays.getMultiOverlays();

### Array:

* (*array*) all the MultiOverlay instances

### Example:

	var myOverlays = myMultiOverlays.getMultiOverlays();
	console.log( myOverlays );