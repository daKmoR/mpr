/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

$require(MPR.path + 'Tabs/FlowTabs/FlowTabs.js');

FlowTabs.inline = new Class({
	Implements: [Events, Options],
	options: {
		ui: {
			tab: { 'class': 'ui-tab' },
			content: { 'class': 'ui-tabContent' },
			container: { 'class': 'ui-tabsContainer clearfix' }
		},
		onlyOneTab: true,
		defaultTab: 0,
		onOpen: function(tabContent, tab) {
			tabContent.setStyle('display', 'block');
			tab.addClass('act');
		},
		onClose: function(tabContent, tab) {
			tabContent.setStyle('display', 'none');
			tab.removeClass('act');
		}
	},
	
	tabs: [],
	tabsContent: [],
	
	initialize: function(tabs, content, options) {
		this.setOptions(options);
		
		this.tabsContainer = new Element('div', this.options.ui.container).inject( $$(tabs)[0], 'before' );
		this.attach(tabs, content);
		
		this.openTab( this.options.defaultTab );
		this.registerUi();
	},
	
	attach: function(tabs, content) {
		if ( $type(tabs) == 'string' ) tabs = $$(tabs);
		if ( $type(tabs) == 'element' ) tabs = [tabs];
		if ( $type(content) == 'string' ) content = $$(content);
		if ( $type(content) == 'element' ) content = [content];
		
		if ( tabs.length != content.length ) return;
		
		tabs.each( function(el, i) {
			var j = this.tabs.push(el); this.tabsContent.push( content[i] );
			el.set(this.options.ui.tab);
			content[i].set(this.options.ui.content);
			
			el.addEvent('click', function(e) { 
				e.stop(); 
				this.openTab(i);
			}.bind(this) );
			this.tabsContainer.grab( el );
			
			this.fireEvent('onUiAttach', [el, j-1, content[i], this.tabsContainer]);
		}, this);
	},
	
	openTab: function(index) {
		this.fireEvent('onOpen', [ this.tabsContent[index], this.tabs[index] ] );
		if ( this.options.onlyOneTab ) {
			this.tabsContent.each( function(el, allIndex) {
			  if (allIndex != index) 
					this.closeTab(allIndex)
			}, this );
		}
	},
	
	closeTab: function(index) {
		this.fireEvent('onClose', [ this.tabsContent[index], this.tabs[index] ] );
	},
	
	registerUi: function() {
		if ( typeof(UI) !== 'undefined' )
			UI.registerClass({ 'Tabs': { 'param': '.' + this.options.ui.tab['class'], 'name': 'FlowTabs.inline', 'class': this } });
	}

});

if ( typeof(UI) !== 'undefined' ) UI.registerClass({ 'Tabs': { 'param': '.ui-tab', 'name': 'FlowTabs.inline' } });