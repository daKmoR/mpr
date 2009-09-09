/**
 * FlexBox Style LightBox - mimics the classic LighBox Layout
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexSlide/FlexSlide.js');

$require('Galleries/FlexSlide/Styles/Simple/Simple.css');

FlexSlide.implement('options', {
	ui: { wrap: { 'class': 'ui-Wrap simpleSlide' } },
	autoItemSize: { x: true, y: true },
	getSizeFromContainer: false,
	render: ['description', 'previous', 'item', 'next', 'advSelect'],
	auto: false,
	effect: { random: ['fade'] }
});