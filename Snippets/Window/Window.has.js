/*
	Window.has('Fx.Morph');
	// defaults to window scope, looks for Fx, if found looks for Morph within Fx.

	Window.has(['Drag','Move']); 
	// properties can be passed in as an array ofstrings rather then dot notation.

	Window.has('feed/entry',json_resp); 
	// alternative path notation, applied to ajson response obj.
*/

Window.implement({

	has: function(prop,scope) {
		var parts = ($type(prop) == 'array') ? prop : prop.split(/\.|\//);
		var obj = scope || window;
		for (var i = 0; i < parts.length; i++) {
			obj = obj[parts[i]];
			if (obj == undefined) return false;
		}
		return true;
	}
	
});