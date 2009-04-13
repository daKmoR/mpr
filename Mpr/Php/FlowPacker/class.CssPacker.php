<?php
/*
   CSS Compressor v0.9
   http://iceyboard.no-ip.org/projects/css_compressor
   Copyright (C) 2008 Robson
   
   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/**
 * DESCRIPTION
 *
 * @package MPR
 * @subpackage Controller
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class CssPacker {

	/**
	 * DESCRIPTION
	 *
	 * @var string
	 */
	protected $css;
	
	/**
	 * DESCRIPTION
	 *
	 * @var array
	 */
	protected $file_selector = array();
	
	/**
	 * DESCRIPTION
	 *
	 * @var array
	 */
	protected $file_props = array();

	public function __construct($css)	{
		$this->css = $css;
	}

	public static function compress($string) {
		$obj = new CssPacker($string);
		return $obj->pack();
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function pack() {
		// temporarily change semicolons in web links
		$this->css = str_replace('://', '[!semi-colon!]//', $this->css);

		$this->css = $this->kill_comments();
		$this->css = trim($this->css);

		// turn all rgb values into hex
		$this->css = $this->rgb2hex();
		
		$this->css = $this->long_colours_to_short_hex();
		$this->css = $this->long_hex_to_short_colours();
		$this->css = $this->remove_zero_measurements();
		
		/********************************************************************************
		* The following functions rely on $this->file_props and $this->file_selector
		* there Output need to be created afterwards with $this->render();
		*********************************************************************************/
		
		$this->sort_css(); // seperate into selectors($this->file_selector) and properties($this->file_props)
		$this->font_weight_text_to_numbers();
		$this->combine_identical_selectors();
		$this->remove_overwritten_properties();
		
		// for each rule in the file - attempt to combine the different parts
		for ($i = 0; $i < count($this->file_props); $i++)
			$this->file_props[$i] = $this->combine_props_list( $this->file_props[$i] );
			
		// for each rule - run all the individual functions to reduce their size
		for ($i = 0; $i < count($this->file_props); $i++)
			for ($j = 0; $j < count($this->file_props[$i]); $j++)
				$this->file_props[$i][$j] = $this->reduce_prop( $this->file_props[$i][$j] );

		// remove all the properties that were blanked out earlier
		$this->remove_empty_rules();

		// check if any rules are the same as other ones and remove the first ones
		$this->combine_identical_rules();
		
		// one final run through to remove all unnecessary parts of the arrays
		$this->remove_empty_rules();

		$this->css = $this->render();

		// turn back colons
		$this->css = str_replace('[!semi-colon!]//', '://', $this->css);

		$this->css = stripslashes($this->css);
		
		return $this->css;
	}
	
	// this removes html and css comments from the file
	function kill_comments($string = null) {
		if( !$string ) $string = $this->css;
		$string = str_replace( array('<!--', '-->'), null, $string);
		$string = preg_replace('/\/\*(.*?)\*\//si', '', $string);
		return $string;
	}
 
	// converts any rgb values to hex values
	// i.e. rgb(255,170,0) -> #ffaa00
	function rgb2hex($string = null) {
		if( !$string ) $string = $this->css;
		
		while (strpos($string, 'rgb')) {
			$where = strpos($string, 'rgb');
			// add everything before to the new string
			$text .= substr($string, 0, $where);
			// remove the before part from the original string
			$string = substr($string, $where, strlen($string));
			// find the end of the rgb value
			$where = strpos($string, ')');

			// get the rgb value, like 'rgb(255, 170, 0)'
			$rgb = substr($string, 0, $where+1);

			// remove spaces, like 'rgb(255,170,0)'
			$rgb = eregi_replace(' +', '', $rgb);
			// remove the parts that aren't values, like '255,170,0'
			$rgb = substr($rgb, 4, -1);

			// explode the values into an array, like 255|170|0
			$rgb = explode(',', $rgb);
			
			$colour = '';
			// loop through each rgb value, for red, green and blue
			for ($n = 0; $n < 3; $n++)
			// ff or 0f - always return two characters
			$colour .= strlen(dechex($rgb[$n])) == 1 ? '0' . dechex($rgb[$n]) : dechex($rgb[$n]) ;

			// 'ffaa00' - add the six-character hex value
			$text .= '#' . $colour;
			
			// remove the rgb property from the string
			$string = substr($string, $where+1, strlen($string));
		}
		// add the remaining parts of the file back to the original string
		return $text . $string;
	}
 
	// turn long colour names into short hex codes
	// for example: fuscia -> #ff00ff (which is then compressed later to #f0f)
	function long_colours_to_short_hex($string = null) {
		if( !$string ) $string = $this->css;
		$colours = array(array('000000', 'black'), array('ff00ff', 'fuchsia'), array('ffff00', 'yellow'));
		for ($n = 0; $n < count($colours); $n++)
			$string = str_replace(":" . $colours[$n][1], ':#' . $colours[$n][0], $string);
		return $string;
	}
   
	// this converts hex colour codes to shorter text equivilants
	// only the standard sixteen colours codes are used here
	function long_hex_to_short_colours($string = null) {
		if( !$string ) $string = $this->css;
		// the colours that are shorter than the hex representation of them
		$colours = array(
			array('808080', 'gray'), array('008000', 'green'), array('800000', 'maroon'),
			array('00080', 'navy'), array('808000', 'olive'), array('800080', 'purple'),
			array('ff0000', 'red'), array('c0c0c0', 'silver'), array('008080', 'teal')
		);
							 
		for ($n = 0; $n < count($colours); $n++)
			$string = str_replace('#' . $colours[$n][0], $colours[$n][1], $string);
		return $string;
	}
 
	// zero is always zero, so measurements don't matter
	// change 0 ems, 0 pixels and 0 percentages to 0
	// this wont change values like 10px, since those do need measurements
	function remove_zero_measurements($string = null) {
		if( !$string ) $string = $this->css;
		$string = trim(eregi_replace('([^0-9])0(px|em|\%)', '\\10', ' ' . $string));
		$string = trim(eregi_replace('([^0-9])0\.([0-9]+)em', '\\1.\\2em', ' ' . $string));
		return $string;
	}
	
	// removes white space from a string and returns the result
	function strip_space($string) {
		// kill whitespace on classes
		// kill new lines
		$string = str_replace(chr(10), '', $string);
		$string = str_replace(chr(13), '', $string);
		// change tabs into spaces
		$string = str_replace(chr(9), ' ', $string);
		// remove additional white space
		$string = eregi_replace(' +', ' ', $string);
		return $string;
	}
 
	// this seperates the css file into it's rules,
	// which it then sends to another function to sort into each part
	function sort_css($string = null) {
		if( !$string ) $string = $this->css;
		// the first thing to do is seperate everything out in the file
		// so loop round each rule in the file
		while ($string) {
			// check if there is some more code
			if (substr_count($string, '}')) {
				// the next rule is everything up to the squiggly bracket
				$rule = substr($string, 0, strpos($string, '}')+1);
				// seperate out everything in this rule and add it to different global arrays
				$this->parse_rules($rule);
				// remove that rule from the css file
				$string = substr($string, strlen($rule), strlen($string));
			}    
			// no more rules?
			else
				unset($string); // kill the css file variable to terminate this loop
		}
	}
	
	// seperate the parts of each rule
	function parse_rules($css) {
		// get the selectors contained in this part of the sheet
		$selector = substr($css, 0, strpos($css, '{'));
		// get the css properties and values contained in this part of the sheet
		$props = trim(substr($css, strlen($selector)+1, -1));

		// remove extra space from before, between and after the selector(s)
		$selector = $this->strip_space($selector);
		// remove any additional space
		$selector = trim(eregi_replace(', +', ',', $selector));    
		$selector = trim(eregi_replace(' +,', ',', $selector));    
		// seperate selector(s) and add to the global selector array    
		$this->file_selector[] = array_unique(explode(',', $selector));

		// shorten the css code
		$props = $this->strip_space($props);
		// remove any additional space
		$props = trim(eregi_replace('(:|;) +', '\\1', $props));
		$props = trim(eregi_replace(' +(:|;)', '\\1', $props));
		$props = trim(eregi_replace('\( +', '(', $props));
		$props = trim(eregi_replace(' +\)', ')', $props));
		// if the last character is a semi-colon
		if (substr($props, strlen($props)-1, 1) == ';')
			 // remove it
			 $props = substr($props, 0, -1);
		// seperate properties and add to the global props array
		$this->file_props[] = explode(';', $props);
	}
 
	// turns font-weight text into numbers
	// for example: font-weight:normal -> font-weight:400
	function font_weight_text_to_numbers() {
		for ($a = 0; $a < count($this->file_props); $a++) {
			for ($b = 0; $b < count($this->file_props[$a]); $b++) {
				if ($this->file_props[$a][$b] == 'font-weight:bold')
					$this->file_props[$a][$b] = 'font-weight:700';
				if ($this->file_props[$a][$b] == 'font-weight:normal')
					$this->file_props[$a][$b] = 'font-weight:400';

				$this->file_props[$a][$b] = str_replace('font:normal', 'font:400', $this->file_props[$a][$b]);
				$this->file_props[$a][$b] = str_replace('font:bold', 'font:700', $this->file_props[$a][$b]);    
			}
		}
	}
 
	// the following code combines rules with the same single selector
	// currently it only works on rules which have one selector
	function combine_identical_selectors() {
		// this will store which selectors have been used
		$cur_selectors = array();

		// loop through all the rules
		for ($a = 0; $a < count($this->file_selector); $a++) {
			// check there is only one selector
			if (count($this->file_selector[$a]) == 1) {
				// see if this selector has been used before
				if (in_array($this->file_selector[$a][0], $cur_selectors)) {
					// if so, loop round until it can be found
					for ($b = 0; $b < count($cur_selectors); $b++) {
						// check if this matches a previous rule
						if ($cur_selectors[$b] == $this->file_selector[$a][0]) {
							// combine the properties in this rule and the previous one
							// they remian in the order they were in the file, so new rules override old ones
							$new_props = array_merge($this->file_props[$b], $this->file_props[$a]);
							// replace the current props with all of them
							$this->file_props[$a] = $new_props;
							// kill the old selector
							$this->file_selector[$b] = NULL;
							// kill the old properties
							$this->file_props[$b] = array(NULL);
							// remove from the selectors array
							$cur_selector[$b] = NULL;
						}
					}
				}
				// add the current selector to the selectors array
				$cur_selectors[] = $this->file_selector[$a][0];        
			} else
				$cur_selectors[] = NULL; // add nothing to maintain the selector index
		}
	}
 
	// this removes duplicates classes from rules
	// if a property is repeated the last one is only used, so old ones can be safely removed
	function remove_overwritten_properties() {
		for ($a = 0; $a < count($this->file_props); $a++) {
			// this will store the property list
			$cur_props = array();
			// loop through all the properties in the current rule
			for ($b = 0; $b < count($this->file_props[$a]); $b++) {
				// explode the property and the value
				$parts = explode(':', $this->file_props[$a][$b]);
				// check if this property has been used previously
				if (in_array($parts[0], $cur_props)) {
					// if so, find where
					for ($c = 0; $c < count($cur_props); $c++) {
						// check if it's the same as the old one
						if ($cur_props[$c] == $parts[0])
						// kill the old one, it's not needed
						$this->file_props[$a][$c] = NULL;
					}
				}
				// add the type to the property array
				$cur_props[] = $parts[0];
			}
		}
	}
 
	// this is the list of properties that can be combined
	function combine_props_list($props) {
		// each call sends the current part of the stylesheet being worked on,
		// the combined property,
		// the parts which makes up this property

		$props = $this->combine_props($props, 'padding', array('padding-top', 'padding-right', 'padding-bottom', 'padding-left'));

		$props = $this->combine_props($props, 'margin', array('margin-top', 'margin-right', 'margin-bottom', 'margin-left'));

		$props = $this->combine_props($props, 'list-style', array('list-style-type', 'list-style-position', 'list-style-image'));
		$props = $this->combine_props($props, 'list-style', array('list-style-type', 'list-style-position'));

		$props = $this->combine_props($props, 'outline', array('outline-color', 'outline-style', 'outline-width'));

		// to do: this might be improvable
		$props = $this->combine_props($props, 'background', array('background-color', 'background-image', 'background-repeat', 'background-attachment', 'background-position'));

		// to do: combine all border-[places] if they're the same (need a special function for that)
		$props = $this->combine_props($props, 'border-bottom', array('border-bottom-width', 'border-bottom-style', 'border-bottom-color'));
		$props = $this->combine_props($props, 'border-top', array('border-top-width', 'border-top-style', 'border-top-color'));
		$props = $this->combine_props($props, 'border-left', array('border-left-width', 'border-left-style', 'border-left-color'));
		$props = $this->combine_props($props, 'border-right', array('border-right-width', 'border-right-style', 'border-right-color'));

		// to do: this needs some checking
		$props = $this->combine_props($props, 'font', array('font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-variant', 'font-weight', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-weight', 'font-size', 'line-height', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-variant', 'font-size', 'line-height', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-variant', 'font-weight', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-weight', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-variant', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-variant', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-weight', 'font-size', 'font-family'));
		$props = $this->combine_props($props, 'font', array('font-style', 'font-size', 'font-family'));
		
		return $props;
	}
 
	// this code is responsible for combining properties off rules
	// example: margin-left, margin-right, margin-top, margin-bottom can be combined to just margin:
	// the combined variable would be 'margin' and the parts would eb the properties before
	function combine_props($props, $combined, $parts) {
		// split the properties and values
		for ($n = 0; $n < count($props); $n++) {
			// add the type to an array
			$props_type[] = substr($props[$n], 0, strpos($props[$n], ':'));
			// add the values to an array, although those are just stored and not processed
			$props_values[] = substr($props[$n], strpos($props[$n], ':')+1, strlen($props[$n]));
		}
		// assume it's combinable
		$combinable = TRUE;
		// loop through all the different properties that can be combined in this instance; if we can't find all it's not combineable
		for ($n = 0; $n < count($parts); $n++) {
			if (!in_array($parts[$n], $props_type))
				$combinable = FALSE;
		}
		// if any of the properties were contained in the combinable array
		if ($combinable) {
			// loop through all the parts
			for ($a = 0; $a < count($parts); $a++) {
				// loop through all the properties found here
				for ($b = 0; $b < count($props_type); $b++) {
					// check if it's the same
					if ($props_type[$b] == $parts[$a]) {
						// add the current values to the combined values
						// this must be done in the correct order
						$combined_values[] = $props_values[$b];
						// no longer need the property since it's been added to the combined part, so remove it
						$props[$b] = NULL;
					}
				}
			}
			// add the new combined property with all the values of the individual propertys
			$props[] = $combined . ':' . implode(' ', $combined_values);
		}
		return $props;
	}
 
	// this function just calls other ones
	public function reduce_prop($item) {
		$item = $this->short_hex($item);
		$item = $this->compress_padding_and_margins($item);
		return $item;
	}
 
	// this code turns hex codes into short three-character hex codes when possible
	// for example:
	//  #ff0000 -> #f00
	//  #aabbcc -> #abc
	function short_hex($item) {
		// check if this part of the code has some hex codes in it
		if (strstr($item, '#')) {
			// grab the next six characters
			$hex = substr($item, strpos($item, '#')+1, 6);
			// check if this is a hex code, so ids don't get picked up
			if (eregi('[0-9a-f]{6}', $hex)) {
				// if the characters in each pair match - it can be made shorter, so convert to the shorter version
				if ($hex[0] == $hex[1] && $hex[2] == $hex[3] && $hex[4] == $hex[5])
					$item = eregi_replace('#' . $hex, '#' . $hex[0] . $hex[2] . $hex[4], $item);
			}
		}
		return $item;
	}
 
	// this removes the useless values from padding and margin properties
	// this code is run after properties are combined (like margin-left, margin-top etc)
	// for example
	//  padding: 5px 5px 5px 5px -> padding: 5px
	//  margin: 2px 4px 2px 4px -> margin: 2px 4px
	//  padding: 3px 5px 9px 5px -> padding: 3px 5px 9px
	function compress_padding_and_margins( $item ) {
		// get the type and value of the property
		$item_parts = explode(':', $item);

		// check if this is a padding or margin property
		if ($item_parts[0] == 'padding' || $item_parts[0] == 'margin') {
			// place all the values into an array
			$values = explode(' ', $item_parts[1]);

			// switched based on the number of values found
			// no need to check if it's 1, because that can't be compressed
			switch (count($values)) {
				// icey demonstrates the art of making pop corn:
			case 2:
				// example: margin: 4px 4px
				if ($values[0] == $values[1])
				// example: margin: 4px
				array_pop($values);
				break;
			case 3:
				// example: margin: 5px 7px 5px
				if ($values[0] == $values[2]) {
					// example: margin: 5px 7px
					array_pop($values);
					// example: margin: 4px 4px
					if ($values[0] == $values[1])
					// example: 4px
					array_pop($values);
				}
				break;
			case 4:
				// example: margin: 3px 7px 9px 7px
				if ($values[1] == $values[3]) {
					// example: 3px 7px 9px
					array_pop($values);
					// example: 3px 4px 3px
					if ($values[0] == $values[2]) {
						// example: 3px 4px
						array_pop($values);
						// example: 7px 7px
						if ($values[0] == $values[1])
						// example: 7px
						array_pop($values);
					}
				}
				break;
			}
			// check if any changes were made by comparing the original values to the current values
			if (implode(' ', $values) != $item_parts[1])
			// if so, change the item in the array to the shorter version
			$item = $item_parts[0].':'.implode(' ', $values);
		}
		return $item;
	}
 
	function remove_empty_rules() {
		// loop through each section of the css file and see if it contains no properties
		for ($a = 0; $a < count($this->file_selector); $a++) {
			// remove blank items from the array
			$this->file_props[$a] = array_values(array_diff($this->file_props[$a], array(NULL)));
			// check if this part has no properties
			if (!$this->file_props[$a][0]) {
				// remove the empty prop part of the array and the class(es)
				array_splice($this->file_selector, $a, 1);
				array_splice($this->file_props, $a, 1);
				// decrease by one due to the decreased total
				$a--;
			}
		}
	}
 
	// now that the stylesheet has been compressed as much as possible,
	// the code to combine identical classes is used
	function combine_identical_rules() {
		// loop through each rule
		for ($a = 0; $a < count($this->file_props); $a++) {
			// loop from 0 up the current number, this ensures future processed properties aren't processed prematurely
			for ($b = 0; $b < $a; $b++) {
				if (substr($this->file_selector[$a][0], 0, 1) <> "@" && substr($this->file_selector[$b][0], 0, 1) <> "@") {
					// check if this rule is identical to an earlier one
					if (!array_diff($this->file_props[$a], $this->file_props[$b]) && !array_diff($this->file_props[$b], $this->file_props[$a])) {
						// combine the selectors
						$this->file_selector[$a] = array_unique(array_merge($this->file_selector[$a], $this->file_selector[$b]));
						// remove the old properties
						$this->file_props[$b] = array(NULL);
						// remove the old selectors
						$this->file_selector[$b] = array(NULL);
					}
				}
			}
		}
	}
	
	function render() {
		for ($a = 0; $a < count($this->file_selector); $a++) {
			for ($b = 0; $b < count($this->file_selector[$a]); $b++)
				$this->file_selector[$a][$b] = $this->file_selector[$a][$b];
			for ($b = 0; $b < count($this->file_props[$a]); $b++) {
				$parts = explode(':', $this->file_props[$a][$b]);
				$this->file_props[$a][$b] = '' . $parts[0] . ':' . $parts[1];        
			}
			$css .= implode(',', $this->file_selector[$a]) . '{';
			$css .= implode(';', $this->file_props[$a]) . '}';
		}
		return $css;
	}

}
?>