/*
 * Inspired from http://github.com/jeresig/sizzle/commit/7631f9c3f85e5fa72ac51532399cb593c2cdc71f
 * and this http://github.com/jeresig/sizzle/commit/5716360040a440041da19823964f96d025ca734b
 * and then http://dev.jquery.com/ticket/4512
 */

Element.implement({

	isHidden: function(){
		var w = this.offsetWidth, h = this.offsetHeight,
		force = (this.tagName === 'TR');
		return (w===0 && h===0 && !force) ? true : (w!==0 && h!==0 && !force) ? false : this.getStyle('display') === 'none';
	},

	isVisible: function(){
		return !this.isHidden();
	}

});