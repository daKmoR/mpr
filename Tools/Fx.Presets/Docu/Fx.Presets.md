Class: Fx.Presets {#FxPresets}
=============================

Fx.Presets can be used to clearly define and use groups of related animations on multiple elements.

### Syntax:

	var myFxPreset = new Fx.Preset(Fx.Presets, properties);

### Arguments:

1. Fx.Presets  - (*various*) See Fx.Presets below.
2. properties  - (*object*)  What properties should be modified.

### Fx.Presets:

* Fx.Presets.All               - fx on all elements in the group
* Fx.Presets.Unique            - fxOne for the selected element; fxTwo for the rest (*all without the selected one*)
* Fx.Presets.Solo              - fx only for the selected element
* Fx.Presets.Nothing           - just do nothing - use if an array is expected but you actually don't want to modify an element
* Fx.Presets.Arbitrary         - *fill out*
* Fx.Presets.ArbitrarySolo     - *fill out*
* Fx.Presets.ArbitraryUnique   - *fill out*


### Returns:

* (*object*) A new Fx.Preset instance.

Class: Fx.Elements.Preset {#FxElementsPreset}
=============================

Fx.Elements.Preset can be used to clearly define and use groups of related animations on multiple elements.

### Syntax:

	var myElementPreset = new Fx.Elements.Preset(elements[, options]);
	
Fx.Elements.Preset Method: start {#FxElementsPreset:start}
----------------------------------------------------

Outputs the stored element(s) either with the console or with alert.

### Syntax:

	myElementPreset.start(Fx.Preset, index);

### Arguments:

1. Fx.Preset - (*Fx.Preset*) an instance of Fx.Presets to set what elements to modify
2. index     - (*integer*)   index of the selected element

### Returns:

* nothing

### Examples:

	myElementPreset.start( myFxPreset, 5 );