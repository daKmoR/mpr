Class: Fx.Reveal {#Fx-Reveal}
=============================

Transitions the height, opacity, padding, and margin (but not border) from and to their current height from and to zero, then sets display to none or block and resets the height, opacity, etc. back to their original values.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/05-fx/02-fx.reveal

### Extends

- [Fx.Morph][]

### Syntax ###

	new Fx.Reveal(element[, options]);

### Arguments

1. element - (*mixed*) A string of the id for an Element or an Element reference to reveal or hide.
2. options  - (*object*, optional) a key/value object of options

### Options {#Fx-Reveal:options}

* all the options passed along to [Fx.Morph][] (transition, duration, etc.); (optional); PLUS
* styles - (*array*) css properties to transition in addition to width/height;  defaults to *['padding','border','margin']*
* mode - (*string*) "vertical", 2horizontal", or "both" to describe how the element should slide in; defaults to *"vertical"*
* heightOverride - (*integer*) height to open to; overrides the default offsetHeight
* widthOverride - (*integer*) width to open to; overrides the default offsetWidth
* display - (*string*) the property for the display style when your reveal the element. Defaults to *block* but could be, for isntance, *list-style* or whatever.

### Events

* All the events found in [Fx.Morph][], PLUS
* onShow - (*function*) The function to apply when the element is displayed.
* onHide - (*function*) The function to apply when the element is hidden.

### Returns

* (*object*) A new instance of [Fx.Reveal][].

### Example

	new Fx.Reveal($('myElement'), {duration: 500, mode: 'horizontal'});

Fx.Reveal Method: dissolve {#Fx-Reveal:dissolve}
------------------------------------------------

Transitions the height, opacity, padding, and margin (but not border) from their current height to zero, then sets display to none and resets the height, opacity, etc. back to their original values.
### Syntax

	myRevealFx.dissolve();

### Returns

* (*object*) This [Fx.Reveal][] instance.

### Note

* After the effect reveals the element, its display will be set block and its height or width to *auto* unless *heightOverride* and/or *widthOverride* (depending on the *mode* option) is specified.

Fx.Reveal Method: reveal {#Fx-Reveal:reveal}
------------------------------------------------

Sets the display of the element to opacity: 0 and display: block, then transitions the height, opacity, padding, and margin (but not border) from zero to their proper height.

### Syntax

	myRevealFx.reveal();

### Returns

* (*object*) This [Fx.Reveal][] instance.

Fx.Reveal Method: toggle {#Fx-Reveal:toggle}
------------------------------------------------

Toggles the element from shown to hidden.

### Syntax

	myRevealFx.toggle();

### Returns

* (*object*) This [Fx.Reveal][] instance.

Native: Element {#Element}
==========================

Extends the native Element object with [Fx.Reveal][] methods.

Element Property: reveal {#Element-Properties:reveal}
---------------------------------------------------

### Setter

Sets a default [Fx.Reveal][] instance for an Element.

#### Syntax:

	el.set('reveal'[, options]);

#### Arguments

1. options - (*object*, optional) The [Fx.Reveal][] options.

#### Returns

* (*element*) This Element.

#### Examples

	el.set('reveal', {duration: 'long', transition: 'bounce:out'});
	el.reveal(); //show the element
	el.dissolve(); //hide it

### Getter

Gets the default [Fx.Reveal][] instance for the Element.

#### Syntax

	el.get('reveal'[, options]);

#### Arguments

1. name - (*string*) - this should always be "reveal".
2. options - (*object*, optional) The [Fx.Reveal][] options. If these are passed in, a new instance will be generated.

#### Returns

* (*object*) The Element's internal [Fx.Reveal][] instance.

#### Examples

	el.set('reveal', {duration: 'long', transition: 'bounce:out'});
	el.reveal(); //show the element
	el.get('reveal'); //The Fx.Reveal instance.

Native: Element {#Element}
==========================

Adds [Fx.Reveal][] shortcuts to the [Element][] class.

Element Method: reveal {#Element:reveal}
----------------------------------------

Retrieves the "build-in" instance of [Fx.Reveal][] and calls its *reveal* method.

### Syntax

	$('myElement').reveal(options);

#### Arguments

	1. options - (*object*, optional) The [Fx.Reveal][] options. If these are passed in, a new instance will be generated.

### Returns

* (*element*) This Element

Element Method: dissolve {#Element:dissolve}
--------------------------------------------

Retrieves the "build-in"  instance of [Fx.Reveal][] and calls its *dissolve* method.

### Syntax

	$('myElement').dissolve();

### Returns

* (*element*) This Element

Element Method: nix {#Element:nix}
----------------------------------

Retrieves the "build-in" instance of [Fx.Reveal][] and calls its *dissolve* method, then either removes or destroys the element.

### Syntax

	$('myElement').nix([options, destroy]);
	$('myElement').nix([destroy]);

### Arguments

Note that either or both of these may be specified and in any order.

* options - (*object*) The options object to pass to the "built-in" instance of Fx.Reveal.
* destroy - (*boolean*) If (*true*) the element will be destroyed entirely after the effect (using *Element.destroy*), otherwise it will only be removed from the DOM (using *Element.erase*). Defaults to (*false* - i.e. erase).

### Examples

	$('myElement').nix(true); //destroy
	$('myElement').nix(); //erase
	$('myElement').nix({duration: 1000}); //dissolve over 1 second, then erase
	$('myElement').nix({duration: 1000}, true); //dissolve over 1 second, then destroy

### Returns

* (*element*) This Element

Element Method: wink {#Element:wink}
----------------------------------

Retrieves the "build-in" instance of [Fx.Reveal][] and calls its *reveal* method, then pauses the specified duration, and then calls its *dissolve* method.

### Syntax

	$('myElement').wink([duration]);

### Arguments

* duration - (*integer*, optional) The duration that the element should remain visible before it hides again. Defaults to 2000 (ms).

### Examples

	$('myElement').wink(); //2 second pause
	$('myElement').wink(500); //.5 second pause

### Returns

* (*element*) This Element

[Fx.Reveal]: #Fx-Reveal
[Fx.Reveal:options]: #Fx-Reveal:options
[Fx.Morph]: /docs/core/Fx/Fx.Morph
[Element]: /docs/core/Element/Element
