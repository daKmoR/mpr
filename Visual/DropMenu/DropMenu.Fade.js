$require('Core/Fx/Fx.Tween.js');
$require('Visual/DropMenu/DropMenu.js');

DropMenu.implement({
	options: {
		onOpen: function(el) {
			el.set('tween', { duration: 300 }).fade('in');
		},
		onClose: function(el) {
			el.set('tween', { duration: 600 }).fade('out');
		},
		onInitialize: function(el) {
			el.fade('hide');
		}
	}
});