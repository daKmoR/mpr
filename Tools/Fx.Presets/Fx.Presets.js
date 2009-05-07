/*
	Fx.Presets: Clear definition and use of groups of related animations on multiple elements.
	Version: 0.05
	Copyright (c) 2009 Michal Charemza
	Released under MIT License http://www.opensource.org/licenses/mit-license.php
*/

$require(MPR.path + 'Core/Element/Element.Style.js');

$require(MPR.path + 'More/Fx/Fx.Elements.js');

Fx.Elements.Preset = new Class({
	Extends: Fx.Elements,
	
	initialize: function(elements, options) {
		this.subLengths = ($type(elements[0]) == 'array') ? elements.map(function(i) {return i.length}) : [elements.length];
		this.vars = [];
		return this.parent(elements.flatten(), options);
	},
	
	start: function(preset, variables) {
		if( $type(variables) === 'element' || $type(variables) === 'string')
			variables = this.elements.indexOf( $(variables) );
		
		var properties = {};
		var presetNum = 0;
		var total = 0;
		var vars = [];
		preset = $splat(preset);
		for (var i = 0; i < preset.length; i++) vars[i] = variables;
		this.elements.each(function(el, i) {
			if (i >= total + this.subLengths[presetNum]) {
				presetNum += 1;
				total += this.subLengths[presetNum - 1];
			}
			properties[i] = preset[presetNum].pass([i - total].concat($splat(vars[presetNum])))();
		},this);
		this.vars.push(variables);
		return this.parent(properties);
	},

	onComplete: function(){
		this.fireEvent('complete', this.vars.shift());
		if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
	}
});

Fx.Preset = function(preset, params) {
	return function() {
		return preset.pass($splat(params).concat($A(arguments)))();
	}	
};

Fx.Presets = new Hash({
	
	All: function(prop, i) {
		return prop;
	},
	
	Unique: function(propSolo, propRest, i, j) {
		return (i == j) ? propSolo : propRest;
	},
	
	Solo: function(propSolo, i, j) {
		return (i == j) ? propSolo : {};
	},
	
	Nothing: function() {
		return {};
	},
	
	Arbitrary: function(props, i, j) {
		return props[j];
	},

	ArbitrarySolo: function(props, i, j) {
		return (i == j) ? props[j] : {};
	},

	ArbitraryUnique: function(props, propDefault, i, j) {
		return (i == j) ? props[j] : propDefault;
	}
	
});

(function() {
	
	$findCoords = function(k, grid) {
		var x = k % grid[0];
		var y = (k - x) / grid[0];
		return [x, y];
	}
	
	Fx.Presets.extend({
		Grid: function(same, diff, grid, i, j) {
			var iCoords = $findCoords(i, grid);
			var jCoords = $findCoords(j, grid);

			var prop = {};
			for (var m = 0; m <= 1; m++) {
				prop = $merge(prop, (iCoords[m] == jCoords[m]) ? same[m] : diff[m]);
			}		

			return prop;
		}
	})
	
})();