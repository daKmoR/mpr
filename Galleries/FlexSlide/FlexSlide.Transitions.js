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
			slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut }
		},
	},
	effects: {
		slideLeft: function(current, next, currentEl, nextEl) {
			this.fxConfig[current] = { 'left': [0, currentEl.getSize().x*-1] };
			this.fxConfig[next]    = { 'left': [currentEl.getSize().x, 0] };
		},
		slideRight: function(current, next, currentEl, nextEl) {
			this.fxConfig[current] = { 'right': [0, currentEl.getSize().x*-1] };
			this.fxConfig[next]    = { 'right': [currentEl.getSize().x, 0] };
		},
		slideLeftBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideRightBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideLeftQuart:   function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideRightQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); }
	}

});