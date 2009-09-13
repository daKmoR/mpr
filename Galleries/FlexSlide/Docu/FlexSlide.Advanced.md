Class: FlexSlide.Advanced {#FlexSlideAdvanced}
===================

Extends the FlexSlide class with advanced functions like dynamic loading an mouse/keyboard listener

### Extends:

- FlexSlide

FlexSlide.Advanced Method: constructor {#FlexSlideAdvanced:constructor}
--------------------------------------------

### Arguments:

* element - (*mixed*) A single elements, a string Selector where the FlexSlide.Advanced should be placed
* options  - (*object*) An object to customize this FlexSlide instance.

### Options:
* dynamicLoading  - (*boolean*: defaults to true) load link targets into the gallery
* dynamicMode     - (*string*: default to '') force a specific dynamic mode [image, request, inline] useful if images get generated and so can't be recogniced by it's file extension
* active          - (*boolean*: default to true) only an active FlexSlide will listen to mouse/keyboard events
* wheelListener   - (*boolean*: defaults to false) listen to the mousewheel to switch to the next image
* keyboardListener - (*object*: defaults to false) listen to keys for various events

### Example:

#### HTML:

	<div id="example">
		<a class="item" href="file/on/same/server.html"> <span class="select">my First Item</span> </a>
		<a class="item" href="file/on/same/server.gif"> <span class="select">my Second Item</span> </a>
		<a class="item" href="file/on/same/server.jpg"> <span class="select">my Third Item</span> </a>
		<a class="item" href="#myInlineContent"> <span class="select">my Fourth Item</span> </a>
	</div>
	
	<div id="myInlineContent" style="display: none;">
		<p>I will be placed inside the FlexSlide</p>
	</div>

#### JavaScript

	var example = new FlexSlide.Advanced( $('example'), { 
		wheelListener: true,
		keyboardListener: true
	});