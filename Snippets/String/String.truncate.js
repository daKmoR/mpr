/**
* String.truncate(max, atChar, trail)
*
* ++All parameters are optional.
* @param max = (integer) maximum length of truncated string. Defaults to 100 chars.
* @param atChar = (string) truncate at the last index of this string. If not found, just truncates to max length.
*                 If null, does not search and truncates to max length.
* @param trail = (string) what you want appended to the end of the returned string
*
* @author Michael Fuery, Fuery Solutions, Inc. http://www.fuerysolutions.com/
*
* +Requires MooTools Core 1.2.2
*/

String.implement({
	truncate: function(max, atChar, trail) {
		var s = this.trim();
		if(s.length < 1) return '';
		if( !$defined(max) )
			var max = 100;
		else 
			max = max.toInt();
		if(!$defined(atChar)) 
			var atChar=' '; // break at space
		else if(atChar == null) 
			var atChar=false;
		if(!$defined(trail)) var trail = '...';

		if(s.length > max) {
			var i=0;
			if(atChar){
				if((i = s.lastIndexOf(atChar)) != -1){
					s = s.substring(0, i);
				} else {
					s = s.substring(0, max);
				}
			}
			s += trail;
		}
		return s;
	}
});