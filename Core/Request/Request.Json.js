/*
---

script: Request.JSON.js

description: Extends the basic Request Class with additional methods for sending and receiving JSON data.

license: MIT-style license.

requires:
- /Request JSON

provides: [Request.HTML]

...
*/

$require('Core/Request/Request.js');
$require('Core/Utilities/Json.js');

Request.JSON = new Class({

	Extends: Request,

	options: {
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		this.headers.extend({'Accept': 'application/json', 'X-Request': 'JSON'});
	},

	success: function(text){
		this.response.json = JSON.decode(text, this.options.secure);
		this.onSuccess(this.response.json, text);
	}

});
