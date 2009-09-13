Class: FlexSlide {#FlexSlide}
===================

Create your own Gallery/Tabs/Newsticker for HTML, Images with variable output order and effects.

### Implements:

- [Events][], [Options][]

FlexSlide Method: constructor {#FlexSlide:constructor}
--------------------------------------------

### Arguments:

* element - (*mixed*) A single elements, a string Selector where the FlexSlide should be placed
* options  - (*object*) An object to customize this FlexSlide instance.

### Options:
* selections      - (*object*: defaults to `{}`) Here you can override the default selection of objects
		example: item: '.myOtherItemClass'
* render          - (*array*: defaults to `['item']`) elements in this array will be rendered (in it's order)
* ui              - (*object*: ) Here you can override the default names of the html-classes
		example: item: { 'class': ui-Item' }
* show            - (*number*: defaults to 0) which image should be shown on start
* container       - (*object*: defaults to null) if defined this container will be used (if not defined it will be set to the wrap div)
* getSizeFromContainer - (*boolean*: defaults to 'true') use the width/height from the element and copy it to the ItemWrap; then reset width/height to auto
* initFx          - (*string*: defaults to 'display') effect to be used for the first show
* auto		  	    - (*boolean*: defaults to 'true') go automatically to the next image
* duration	    	- (*number*: defaults to 5000) time in ms when to switch to the next image
* autoItemSize    - (*object*: defaults to { x: true, y: false }) if true the width/height get's set to the same size as the itemContainer
* autoItemSizeSpecial - (*array*: default to ['img', 'a']) these tags will "ignore" autoItemSize and instead will set one side to auto (to fit into the gallery maintaining the aspect ratio)
* centerImage	    - (*boolean*: defaults to true) the item will be centered with margin
* centerContainer - (*boolean*: defaults to false) will center the whole gallery (will only show an effect if the gallery is absolute positioned)
* useScroller     - (*boolean*: default to false) use a scroller for the selection (Thumbnails) [needs a div with class="selectScroller"]
* scrollerMode:   - (*string*: default to 'horizontal') use the scroller horizontal or vertical
* scrollerOptions - (*object*: default to {area: 100, velocity: 0.1}) options for the scroller
* mode		      	- (*array*: default to 'continuous') how to select the next image [continuous, reverse, random]
* step		      	- (*number*: defaults to 1) steps to the next image
* selectTemplate	- (*string*: defaults to '{text}') text for the selects
* counterTemplate	- (*string*: defaults to '{id}/{count}') content for the counter
* descriptionTemplate - (*string*: default to '<strong>{title}</strong><span>{text}</span>') you can use alt="myTitle :: mySubText" to generate nice descriptions
* effect		    	- (*object*: defaults to {}) here you can choose your effects
	* up            - (*string*: default to 'random') effect to be used for the next or higher image (example switching vom image 2 to 4)
	* down          - (*string*: default to 'random') effect to be used for the previous or lower image (example switching vom image 6 to 1)
	* random        - (*array*: default to ['fade']) array of effects we can choose from if using random
	* globalOptions - (*object*: default to { duration: 1000, transition: Fx.Transitions.linear }) default options for all fx
	* options       - (*object*: defaults to { display: { duration: 0 }	} ) you can define individual options for each effect
	* wrapFxOptions - (*object*: defaults to { duration: 1000, transition: Fx.Transitions.Quart.easeInOut }) options for the container animation

### Available effects:

 * fade: fade to the next Image
 * random: fade to the next Image using a random effec
 * display: show the next image without effect

### Example:

#### HTML:

	<div id="example">
		<a class="item" href="#">
			<img src="img/example.jpg" alt="" />
		</a>
		<div class="description"><a href="#">EXAMPLE</a></div>
	</div>
	
	or
	
	<div id="example">
		<div class="item">
			<img src="img/example.jpg" alt="" />
			<div class="description">example</div>
		</div>
	</div>
	
	or
	
	<div id="example">
		<img class="item" src="img/example.jpg" alt="" />
		<img class="item" src="img/example.jpg" alt="" />
		<img class="item" src="img/example.jpg" alt="" />
		<img class="item" src="img/example.jpg" alt="" />
	</div>

#### JavaScript

	<script type="text/javascript">
		$require('Core/Utilities/DomReady.js');
		$require('Galleries/FlexSlide/FlexSlide.js');
		
		window.addEvent('domready', function() {
			var example = new FlexSlide( $('example'), { 
				duration: 16000,
				render: ['previous', 'item', 'description', 'next'],
				effect: {
					globalOptions: { duration: 600 },
					up: 'slideLeftQuart',
					down: 'slideRightQuart'
				}
			});
		});
	</script>

FlexSlide Method: show {#FlexSlide:show}
---------------------------------

* (*function*) Shows the item with an effect (either the up effect if the item to be shown has a higher index - otherwise the down effect)

### Signature:

	show: function(id, [fx])

### Arguments:

1. id - (*integer*) id of the item (id) you want to show
2. fx - (*string*, optional) effect howto display the item

### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.show(0);	});

	$('nextClick').addEvent('click', function(e) {
 		e.stop();
		// an instant show without an effect
 		myGallery.show(0, 'display');
	});
	
FlexSlide Method: next {#FlexSlide:next}
----------------------------------

* (*function*) Shows the next item with an effect

### Signature:

	next: function([step])

### Arguments:

1. step - (*string* defaults to 1) show the next (n times) item (optional)


### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.next();	});


FlexSlide Method: previous {#FlexSlide:previous}
----------------------------------

* (*function*) Shows the previous item with an effect

### Syntax:

	previous: function([step])

### Arguments:

1. step - (*string*) show the previous (n times) item (optional)


### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.previous(2);	});