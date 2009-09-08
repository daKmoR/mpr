/**
 * FlexBox Style LightBox - mimics the classic LighBox Layout
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require('Galleries/FlexBox/FlexBox.js');

$require('Galleries/FlexBox/Styles/LightBox/LightBox.css');

FlexBox.implement('options', {
	ui: { wrap: { 'class': 'flexBoxWrap lightBox' } },
	flexSlide: {
		render: [{'item': ['previous', 'next']}, { 'bottom': [{'description': ['counter']}, 'close'] } ],
		counterTemplate: 'Image {id} of {count}',
	}
});