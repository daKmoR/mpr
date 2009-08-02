
$require('Core/Native.String/Native.String.js');
$require('Snippets/Array/Array.hexToRgba.js');

String.implement({

	hexToRgba: function(opacity, array) {
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgba(opacity, array) : null;
	}
	
});