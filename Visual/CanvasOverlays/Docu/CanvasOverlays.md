Class: AutoCanvasOverlays {#AutoCanvasOverlays}
=============================

Uses canvas to dynamically create overlays (with fill, border, glow) for Images with imagemaps

Just include the AutoCanvasOverlays and set the CSS-Class "CanvasOverlay" for images that should be used.
These images must have the "usemap" property. You can individiually override the display options for each area by defining them in the alt tag.

	//either require it or build a costum library for the page using it.
	//the AutoCanvasOverlays uses 'load' and not 'domready' as canvas might fail otherwise (sometimes)
	$require(MPR.path + 'Visual/CanvasOverlays/AutoCanvasOverlays.js');

Class: CanvasOverlay {#CanvasOverlay}
=============================

Uses canvas to dynamically create overlays (with fill, border, glow) for Images with imagemaps

### Syntax:

	var myCanvasOverlay = new CanvasOverlay(element[, options]);

### Arguments:

1. element   - (*element*) single image with an imagemap
2. options   - (*object*, optional) See options below.

#### Options:
* fill            - (*boolean*: defaults to *true*) do you want the overlay to be filled
* fillColor       - (*string*: default to #333) the hex color of the filling
* fillOpacity     - (*integer*: default to 0.2) opacity of the filling
* stroke          - (*boolean*: defaults to *true*) do you want the overlay to be stroked
* strokeColor     - (*string*: default to '#ff3333') the hex color of the stroke
* strokeOpacity   - (*integer*: default to 1) opacity of the stroke
* glow            - (*boolean*: default to *true*) activate an glow effect
* glowSize        - (*integer*: default to 8) size of the glow
* glowColor       - (*string*: default to '#ffffa8') color of the glow
* active          - (*boolean*: defaults to *true*) if active the area get's highlighted once hovered
* alwaysActive    - (*boolean*: defaults to *false*) the area is always highlighted

### Returns:

* (*object*) A new CanvasOverlay instance.

CanvasOverlay Method: attach {#CanvasOverlay:attach}
----------------------------------------------------

Attaches another area to the CanvasOverlay

### Syntax:

	myCanvasOverlay.attach(element);

### Arguments:

1. element - (*element*) an area from an imagemap that should be attached

### Returns:

* nothing

### Examples:

	myCanvasOverlay.attach( $('myArea') );
	
CanvasOverlay Method: attachShape {#CanvasOverlay:attachShape}
----------------------------------------------------

draws a specific area as overlay to the canvas

### Syntax:

	myCanvasOverlay.attachShape(shape, coords[, options, ctx]);

### Arguments:

1. shape   - (*string*) the type of the area [rect, circ, poly]
2. coords  - (*array*) the coordinates as an array [usually just string.split(',')]
3. options - (*object*, optional) you can override the default options if you want
4. ctx     - (*context*, optional) where to draw the Shape [default is this.ctx]

### Returns:

* nothing

### Examples:

	myCanvasOverlay.attachShape( 'circle', [23,12,12] );
	
CanvasOverlay Example: override options in html {#CanvasOverlay:Example}
----------------------------------------------------

You can override every option from CanvasOverlay within the alt tag. See some examples

	<img class="CanvasOverlay" src="../img.png" usemap="#mapping" alt="my Image" />
	<map name="mapping" id="mapping">
		<area shape="circ" alt="{glowColor: '#78BA91'}" href="#" coords="778,386,567" />
		<area shape="poly" alt="{alwaysActive: true}" href="#" coords="778,386, 783,386, 783,386" />
		<area shape="poly" alt="{active: false}" href="#" coords="157,27, 155,28, 150,28" />
		<area shape="circ" alt="{fillColor: '#fff', fillOpacity: 1}" href="#" coords="23,60,75" />
	</map>


	
Class: CanvasOverlays {#CanvasOverlays}
=============================

Allows you to create Multiple CanvasOverlays

### Syntax:

	var myCanvasOverlays = new CanvasOverlays(elements[, options]);

### Arguments:

1. elements  - (*elements*) array of images with an imagemap
2. options   - (*object*, optional) will be passed on to the options of CanvasOverlay.

### Returns:

* (*object*) A new MultiOverlays instance.

### Examples:

	var myCanvasOverlays = new CanvasOverlays( $$('.myImages') );
	
MultiOverlays Method: getCanvasOverlays {#MultiOverlays:getCanvasOverlays}
--------------------------------------

get all the CanvasOverlay instances as an array 

### Syntax:

	myCanvasOverlays.getCanvasOverlays();

### Array:

* (*array*) all the CanvasOverlay instances

### Example:

	var myOverlays = myCanvasOverlays.getCanvasOverlays();
	console.log( myOverlays );