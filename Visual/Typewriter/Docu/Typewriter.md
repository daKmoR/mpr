Class: Typewriter {#Typewriter}
=============================

The *Typewriter* class creates a simple but effective typing effect on Text

### Syntax:

	var myTypewriter = new Typewriter(element[, options]);

### Arguments:

1. element   - (*array*) The Element that should be written with the style
4. options   - (*object*, optional) See options below.

#### Options:
* message     - (*string*: defaults to '') The message to display, if not defined it will get the html from the element passed.
* delay       - (*integer*: defaults to 150) The amount of time to wait for each new "typing".
* cursor      - (*integer*: default to 0) The position of the cursor on start. Set it to a positive value if you want to start with some text already displayed.
* auto        - (*boolean*: default to true) Should the typing start right at class creation
* step        - (*integer*: default to 1) How many chars should added on each circle.

### Returns:

* (*object*) A new *Typewriter* instance.

Typewriter Method: reset {#Typewriter:reset}
----------------------------------------------------

Allows you to restart the animation from the beginning.

### Syntax:

	myTypewriter.reset();
	
Typewriter Method: setLetter {#Typewriter:setLetter}
----------------------------------------------------

Allows to set the cursor of the message to a specific place

### Syntax:

	myTypewriter.setLetter([cursor]);

### Arguments:

1. cursor - (*integer*) You can optionally set the position of the cursor, by default the cursor will be increased by the defined option step.

### Returns:

* nothing

### Examples:

	//stored message is: here comes some text
	myTypewriter.setLetter(3); //will display "her"

[Fx]: /docs/core/Fx/Fx
[Fx.Elements]: /docs/more/Fx/Fx.Elements