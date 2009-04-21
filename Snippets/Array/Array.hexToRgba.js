
$require(MPR.path + 'Core/Native.Array/Native.Array.js');

Array.implement({

	hexToRgba: function(opacity, array){
		rgba = this.hexToRgb(true);
		return (array) ? rgba : 'rgba(' + rgba + ', ' + opacity + ')';
	}

});