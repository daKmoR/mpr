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
* render          - (*array*: defaults to `['previous', 'item', 'description', 'next', 'select']`)  What Elements should be rendered and in what order
* ui              - (*object*: ) Here you can override the default names of the html-classes
		
		example: item: { 'class': ui-Item' }
* display         - (*number*: defaults to 0) which image should be shown on start
* auto		  	    - (*boolean*: defaults to 'true') do you want to use a times 
* autoHeight	    - (*boolean*: defaults to 'false') Show the 'Item' with automatical height
* autoCenter	    - (*boolean*: defaults to 'true') Show the 'Item' in the center of the Box (uses margin-top)
* duration	    	- (*number*: defaults to 1000) time in ms to the next image
* mode		      	- (*array*: default to 'continuous', 'reverse', 'random') mode to show the next image
* step		      	- (*number*: defaults to 0) how many steps to the next image
* selectTemplate	- (*array*: defaults to '{text}', '{id}') show a selector 
* counterTemplate	- (*array*: defaults to '{id}', '{count}') counter vor the selector
* effect		    	- (*object*: defaults to {}) here you can choose youre effects
	* up            - (*string*: default to 'random') effect to be used for the next or higher image (example switching vom image 2 to 4)
	* down          - (*string*: default to 'random') effect to be used for the previous or lower image (example switching vom image 6 to 1)
	* random        - (*array*: default to ['fade', 'slideLeftBounce', 'slideRightBounce']) array of effect that can be selected if using random 
	* globalOptions - (*object*: default to { duration: 1000, transition: Fx.Transitions.linear }) default options for all fx
	* options       - (*object*) you can define individual options for each effect


### Available effects:

 * fade: fade to the next Image
 * random: fade to the next random Image
 * display: show the next image without effect
 * slideLeft: slide to the image on the left
 * slideRight: slide to the image on the right
 * slideLeftBounce: slide tho the Image on the left with bounce effect
 * slideRightBounce: slide tho the Image on the right with bounce effect
 * slideLeftQuart: slide tho the Image on the left with quart effect
 * slideRightQuart: slide tho the Image on the right with bounce effect

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
				autoCenter: false,
				render: ['previous', 'item', 'description', 'next'],
				effect: {
					globalOptions: { duration: 600 },
					up: 'slideLeftQuart',
					down: 'slideRightQuart'
				}
			});
		});
	</script>




FlexSlide Method: display {#FlexSlide:display}
---------------------------------

* (*function*) Shows a image or a element without effect 

### Signature:

	display: function(id)

### Arguments:

1. id - (*integer*) Number of image (id) you want to show

### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.display(0);	});

FlexSlide Method: show {#FlexSlide:show}
---------------------------------

* (*function*) Shows a image or a element with fade effect

### Signature:

	show: function(id, [fx])

### Arguments:

1. id - (*integer*) Number of image (id) you want to show
2. fx - (*string*, optional) Effect howto display your image

### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.show(0);	});



FlexSlide Method: next {#FlexSlide:next}
----------------------------------

* (*function*) Shows the next image or element with an effect

### Signature:

	next: function([step])

### Arguments:

1. step - (*string* defaults to 1) show the next (n times) image (optional)


### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.next();	});


FlexSlide Method: previous {#FlexSlide:previous}
----------------------------------

* (*function*) Shows the previous image or element an effect

### Syntax:

	previous: function([step])

### Arguments:

1. step - (*string*) show the previous (n times) image (optional)


### Example:

	$('nextClick').addEvent('click', function(e) { 		e.stop(); 		myGallery.previous();	});