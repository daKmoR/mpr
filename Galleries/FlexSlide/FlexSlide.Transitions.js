/**
 * FlexSlide Transitions - gives you multiple Transition effects
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexSlide/FlexSlide.js'); 

FlexSlide.implement('options', {

	effect: {
		options: {
			slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideTopQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideBottomQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideTopBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideBottomBounce: { transition: Fx.Transitions.Bounce.easeOut }
		}
	},
	effects: {
		slideLeft: function(current, next, currentEl, nextEl) {
			var width = currentEl.getSize().x + currentEl.getStyle('margin-left').toInt() + currentEl.getStyle('margin-right').toInt();
			this.fxConfig[current] = { 'left': [0, width*-1] };
			this.fxConfig[next]    = { 'left': [width, 0] };
		},
		slideRight: function(current, next, currentEl, nextEl) {
			var width = currentEl.getSize().x + currentEl.getStyle('margin-left').toInt() + currentEl.getStyle('margin-right').toInt();
			this.fxConfig[current] = { 'right': [0, width*-1] };
			this.fxConfig[next]    = { 'right': [width, 0] };
		},
		slideLeftQuart:   function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideRightQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideLeftBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideRightBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideTop: function(current, next, currentEl, nextEl) {
			var height = currentEl.getSize().y + currentEl.getStyle('margin-top').toInt() + currentEl.getStyle('margin-bottom').toInt();
			this.fxConfig[current] = { 'top': [0, height*-1] };
			this.fxConfig[next]    = { 'top': [height, 0] };
		},
		slideBottom: function(current, next, currentEl, nextEl) {
			var height = currentEl.getSize().y + currentEl.getStyle('margin-top').toInt() + currentEl.getStyle('margin-bottom').toInt();
			this.fxConfig[current] = { 'bottom': [0, height*-1] };
			this.fxConfig[next]    = { 'bottom': [height, 0] };
		},
		slideTopQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call(this, current, next, currentEl, nextEl); },
		slideBottomQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); },
		slideTopBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call (this, current, next, currentEl, nextEl); },
		slideBottomBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); }
	}

});