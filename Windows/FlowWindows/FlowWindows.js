/**
 * Creating Window Funktionality with Drag and Resize (heavily inspired by MochUI)
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */
 
$require(MPR.path + 'Windows/FlowWindows/FlowWindow.inline.js');
 
var FlowWindows = new Class({
	Implements: [Events, Options],
	options: {
		ui: {
			window: { 'class': 'ui-window' },
		}
	},
	
	windows: [],
	titles: [],
	contents: [],
	
	initialize: function(titles, contents, options) {
		this.setOptions(options);
		
		this.attach(titles, contents);
		this.registerUi();
	},
	
	attach: function(titles, contents) {
		var titles = $$(titles);
		var contents = $$(contents);
		
		if (titles.length != contents.length) return;
			
		titles.each( function(el, i) {
			this.titles.push(el); this.contents.push( contents[i] );
			var j = this.windows.push( new FlowWindow.inline(el, contents[i], this.options) );
			this.fireEvent('onUiAttach', [this.windows[j-1], j-1]);
		}, this);
		
	},
	
	registerUi: function() {
		if ( typeof(UI) !== 'undefined' )
			UI.registerClass({ 'Windows': { 'param': '.' + this.options.ui.window['class'], 'name': 'FlowWindows', 'class': this } });
	}
	
});

// register default class for UI
if ( typeof(UI) !== 'undefined' ) UI.registerClass({ 'Windows': { 'param': '.ui-tab', 'name': 'FlowWindows' } });