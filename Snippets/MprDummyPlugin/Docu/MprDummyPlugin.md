Class: MprDummyPlugin {#MprDummyPlugin}
=============================

A simple Dummy Package to start a new MPR Plugin. This line (line 4) will be displayed as a teaser text for the search.

### Syntax:

	var myMprDummyPlugin = new MprDummyPlugin(element[, options]);

### Arguments:

1. element   - (*various*) The element can either be a string or a single object or an array. If it is a string it will first search for an id and afterwards use the full selecter to get elements.
2. options   - (*object*, optional) See options below.

#### Options:
* console     - (*boolean*: defaults to true) Output to console or with alert?


### Returns:

* (*object*) A new MprDummyPlugin instance.

MprDummyPlugin Method: show {#MprDummyPlugin:show}
----------------------------------------------------

Outputs the stored element(s) either with the console or with alert.

### Syntax:

	myMprDummyPlugin.show();
