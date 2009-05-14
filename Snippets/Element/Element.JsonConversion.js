
$require(MPR.path + 'Core/Utilities/Json.js');

Element.extend({
	fromJSON: function(o){
		var b = new Element(o.type, o.props);
		if (o.kids)
			for(var i=0;i<o.kids.length;i++)
				b.grab(Element.fromJSON(o.kids[i]));
		return b;
	}
});
	
Element.implement({
	getJSONProperties: function() {
		var r = {};
		var t = this.attributes;
		for (j=0;j<t.length;j++)
			r[t[j].name] = t[j].value;
		return r;
	},

	toJSON: function(){
		var b = { type: this.get('tag'), props: this.getJSONProperties() };
		var kids = this.getChildren();
		if (kids.length>0) {
			b.kids = [];
			for(var i=0;i<kids.length;i++)
				b.kids.include(kids[i].toJSON());
		}
		return b;
	}
});