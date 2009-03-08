/**
 * Allows to create Tabs with progressive Enhancement
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		Thomas Allmer <at@delusionworld.com>
 * @copyright Copyright belongs to the respective authors
 */

var FlowTabs = {};

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
		this.tabs.extend( $$(tabs) );
		this.tabsContent.extend( $$(content) );
		
		$$(content).set(this.options.ui.content);
		
		$$(tabs).each( function(el, index) {
			el.set(this.options.ui.tab);
			el.addEvent('click', function(e) { 
				e.stop(); 
				this.openTab(index);
			}.bind(this) );
			this.tabsContainer.grab( el );
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
		// if ( typeof(UI) !== 'undefined' )
			// UI.registerClass({ 'Tabs': { 'param': '.' + this.options.ui.tab['class'] } });
	}

});

if ( typeof(UI) !== 'undefined' ) UI.registerClass({ 'Tabs': { 'param': '.ui-tab' } });