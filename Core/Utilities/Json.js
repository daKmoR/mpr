/*
---

script: JSON.js

description: JSON encoder and decoder.

license: MIT-style license.

See Also: <http://www.json.org/>

requires:
- /Array
- /String
- /Number
- /Function
- /Hash

provides: [JSON]

...
*/

$require('Core/Native/Array.js');
$require('Core/Native/Function.js');
$require('Core/Native/Hash.js');
$require('Core/Native/Number.js');
$require('Core/Native/String.js');

var JSON = new Hash(this.JSON && {
	stringify: JSON.stringify,
	parse: JSON.parse
}).extend({
	
	$specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	$replaceChars: function(chr){
		return JSON.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: function(obj){
		switch ($type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.$replaceChars) + '"';
			case 'array':
				return '[' + String(obj.map(JSON.encode).clean()) + ']';
			case 'object': case 'hash':
				var string = [];
				Hash.each(obj, function(value, key){
					var json = JSON.encode(value);
					if (json) string.push(JSON.encode(key) + ':' + json);
				});
				return '{' + string + '}';
			case 'number': case 'boolean': return String(obj);
			case false: return 'null';
		}
		return null;
	},

	decode: function(string, secure){
		if ($type(string) != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

});

Native.implement([Hash, Array, String, Number], {

	toJSON: function(){
		return JSON.encode(this);
	}

});
