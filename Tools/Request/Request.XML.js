/*
Script: Request.XML.js
	Allows to properly process XML even in IE 

	License:
		MIT-style license.

	Authors:
		Vigvari, 
*/

Request.XML = new Class({
	Extends: Request,

	success: function(text, xml){
		if(Browser.Features.xpath) {
			xml.selectNodes = function(xpath){
				var nodes = []; 
				var result = this.evaluate(xpath, this, this.createNSResolver(xml.documentElement), XPathResult.ORDERED_NODE_ITERATOR_TYPE, null) ;
				if (result){
					var node = result.iterateNext() ;
					while(node){
						nodes.push(node);
						node = result.iterateNext();
					}
				} 
				return nodes;
			}   
			xml.selectSingleNode = function(xpath){
				var result = this.evaluate(xpath, this, this.createNSResolver(this.documentElement), 9, null);
				if (result && result.singleNodeValue) return result.singleNodeValue ;
				else return [] ;
			}
		} else { // ie
			xml = { documentElement: this.createXML(xml.documentElement) };
		}
		this.onSuccess(xml, text);
	},

	createXML : function(xml, parent) {
		if (! parent) parent = new Element(xml.nodeName);

		var tmp;
		for(var j = 0; j < xml.attributes.length; j++) {
			tmp = xml.attributes[j];
			parent.setProperty(tmp.nodeName, tmp.nodeValue);
		}

		if (! xml.childNodes.length) return parent;

		var i, j, currChildNode;
		for(i = 0; i < xml.childNodes.length; i++) {
			currChildNode = xml.childNodes[i];

			if (currChildNode.nodeType == 1) { // Element type
				// NodeName
				var el = new Element(currChildNode.nodeName);

				// Attributes
				if(currChildNode.attributes.length) {
					for(j = 0; j < currChildNode.attributes.length; j++) {
						tmp = currChildNode.attributes[j];
						el.setProperty(tmp.nodeName, tmp.nodeValue);
					}
				}

				// Value
				el.set({'text' : currChildNode.firstChild.nodeValue});

				parent.adopt(el);

				if (currChildNode.childNodes.length) this.createXML(currChildNode, el);
			}
		}

		return parent;
	}

});