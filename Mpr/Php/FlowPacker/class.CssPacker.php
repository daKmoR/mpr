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
 
// functions appear in the order they are first called
 
compress_css();
 
function compress_css()
{
   // make these variables available locally
   global $file_selector;
   global $file_props;
   // first, get the css that was sent, referenced or uploaded
   $cssfile = get_sent_css();
 
   // check if the user wants to see statistics
   if ($_REQUEST['opt_output_stats'])
   {
       // save the size of the code
       $start_size = strlen($cssfile);
       // save the current time
       $start = explode(' ', microtime());
   }
   
   // check if no css was found
   if (!$cssfile)
       // just die
       exit ("/* You didn't upload anything or the stylesheet is empty - Ro" . "bson */");
   
   // temporarily change semicolons in web links
   $cssfile = str_replace('://', '[!semi-colon!]//', $cssfile);
   
   // remove html and css comments    
   kill_comments($cssfile);
   
   // trim whitespace from the start and end
   $cssfile = trim($cssfile);
   
   // turn all rgb values into hex
   if ($_REQUEST['opt_rgb2hex'])
       rgb2hex($cssfile);
   
   // shorten colours
   if ($_REQUEST['opt_colours2hex'])
       long_colours_to_short_hex($cssfile);
   if ($_REQUEST['opt_hex2colours'])    
       long_hex_to_short_colours($cssfile);
   
   // remove any extra measurements that aren't needed
   if ($_REQUEST['opt_remove_zeros'])
       remove_zero_measurements($cssfile);
       
   // seperate into selectors and properties
   sort_css($cssfile);
   
   // change font weight text into numbers
   if ($_REQUEST['opt_text_weights_to_numbers'])
       font_weight_text_to_numbers($cssfile);        
   
   // check if any selectors are used twice and combine the properties
   if ($_REQUEST['opt_combine_identical_selectors'])
       combine_identical_selectors();
   
   // remove any properties which are declared twice in one rule
   if ($_REQUEST['opt_remove_overwritten_properties'])
       remove_overwritten_properties();
       
   // check if properties should be combined
   if ($_REQUEST['opt_combine_props_list'])
   {
       // for each rule in the file
       for ($n = 0; $n < count($file_props); $n++)
           // attempt to combine the different parts
           combine_props_list($file_props[$n]);    
   }
   
   // for each rule in the file
   for ($n = 0; $n < count($file_props); $n++)
       // run all the individual functions to reduce their size
       array_walk($file_props[$n], 'reduce_prop');
       
   // remove all the properties that were blanked out earlier
   remove_empty_rules();
   
   // check if any rules are the same as other ones and remove the first ones
   if ($_REQUEST['opt_combine_identical_rules'])
       combine_identical_rules();
   
   // one final run through to remove all unnecessary parts of the arrays
   remove_empty_rules();
   
   $output = create_output();
   
   // turn back colons
   $output = str_replace('[!semi-colon!]//', '://', $output);
 
   $output = stripslashes($output);
   
   // check if the user wants to view stats
   if ($_REQUEST['opt_output_stats'])
   {
       echo '<h1>Statistics</h1><ul>';
       echo '<li>Original size: ' . round($start_size / 1024, 2) . ' kB (' . number_format($start_size) . ' B)</li>';
       echo '<li>Final size: ' . round(strlen(strip_tags($output)) / 1024, 2) . ' kB (' . number_format(strlen(strip_tags($output))) . ' B)</li>';
       echo '<li>Saved: ' . round(($start_size - strlen(strip_tags($output))) / 1024, 2) . ' kB (' . number_format(($start_size - strlen(strip_tags($output)))) . ' B)</li>';
       echo '<li>Reduction: ' . round(100 - ((strlen(strip_tags($output)) / $start_size) * 100), 2) . '%</li>';
       echo '</ul>';
       
       $finish = explode(' ', microtime());        
       
       // work out the differences between the times
       $seconds = $finish[1] - $start[1];
       $miliseconds = $finish[0] - $start[0];        
       
       $duration = round($seconds + $miliseconds, 5);
       
       echo '<ul>';
       echo '<li>Duration: ' . $duration . ' seconds</li>' ;
       echo '</ul>';
       
       echo '<ul>';
       echo '<li>Rules: ' . count($file_selector) . '</li>';
 
       for ($n = 0; $n < count($file_selector); $n++)
           $selectors += count($file_selector[$n]);
       
       for ($n = 0; $n < count($file_props); $n++)
           $props += count($file_props[$n]);
 
       echo '<li>Selectors: ' . $selectors . '</li>';
       echo '<li>Properties: ' . $props . '</li>';
       
       echo '</ul>';
       
       echo '<h1>CSS</h1>';
   }
 
   if ($_REQUEST['upload_link'])
   {
       $_REQUEST['upload_style'] = NULL;
       if (!$_POST['upload_link'])
           $_POST = $_GET;
       foreach ($_POST as $key => $value)
           if ($value)
               if (!$url)
                   $url .= '?' . $key . '=' . $value;
               else
                   $url .= '&' . $key . '=' . $value;
           echo '<ul><li><a href="http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . $url . '">Link to this output</a>.</ul>';
   }
   
   echo $output;
}
 
// retrieves the css sent by the user
// can handle uploaded stylesheets, url references and directly uploaded css
function get_sent_css()
{
   // check if they uploaded a file
   if ($_FILES['upload_file']['name'])
       // grab the uploaded file from it's temporary position
       // the temporary file is deleted at the end of the scripts execution
       // this implodes all the lines of the file into one simple variable
       return implode('', file($_FILES['upload_file']['tmp_name']));
   // the eregi check is for security, it ensures people don't request files on the local server
   else if($_REQUEST['upload_link'] != 'http://' && eregi('http:\/\/*', $_REQUEST['upload_link']))
   {
       // grab a remote file for compressing
       // the at symbol stops php from producing errors, because i've specified one
       $cssfile = @file($_REQUEST['upload_link']) or die("/* Error: Sorry, that URL couldn't be found. */");
       // implode the code
       return implode('', $cssfile);    
   }
   // check if they posted css
   else if($_REQUEST['upload_style'])
       // store the css into the css file variable
       return $_REQUEST['upload_style'];
   // the user wants to combine multiple uploaded files    
   else if ($_FILES['upload_file_1']['name'])
   {
       // add the first file to the current css code
       $file = implode('', file($_FILES['upload_file_1']['tmp_name']));
       // check if they added another file
       if ($_FILES['upload_file_2']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_2']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_3']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_3']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_4']['name'])
           // if so, add that one to the css code string        
           $file .= implode('', file($_FILES['upload_file_4']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_5']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_5']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_6']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_6']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_7']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_7']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_8']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_8']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_9']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_9']['tmp_name']));
       // check if they added another file            
       if ($_FILES['upload_file_10']['name'])
           // if so, add that one to the css code string
           $file .= implode('', file($_FILES['upload_file_10']['tmp_name']));
   
       return $file;
   }
   else
       return NULL;
}
 
// this removes html and css comments from the file
function kill_comments(&$css)
{
   // kill html comments
   $css = str_replace('<!--', '', $css);
   $css = str_replace('-->', '', $css);
   // kill css comments
   $css = preg_replace('/\/\*(.*?)\*\//si', '', $css);
}
 
// converts any rgb values to hex values
// i.e. rgb(255,170,0) -> #ffaa00
function rgb2hex(&$string)
{
   // loop only while there are rgb values in the string
   while (strpos($string, 'rgb'))
   {
       // find the location of the first rgb value
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
 
       // set colour to nothing so it doesn't use the previous value
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
   // return the new string with rgb values converted to hex values
   $string = $text . $string;
}
 
// turn long colour names into short hex codes
// for example: fuscia -> #ff00ff (which is then compressed later to #f0f)
function long_colours_to_short_hex(&$string)
{
   // first, change colour names into hex values
   // hex values are shortened later, so this is done now
   $colours = array(array('000000', 'black'), array('ff00ff', 'fuchsia'), array('ffff00', 'yellow'));
   // loop through each colour
   for ($n = 0; $n < count($colours); $n++)
       // replace all instances of this colour with the hex code
       $string = str_replace(":" . $colours[$n][1], ':#' . $colours[$n][0], $string);
   
}
   
// this converts hex colour codes to shorter text equivilants
// only the standard sixteen colours codes are used here
function long_hex_to_short_colours(&$string)
{    
   // the colours that are shorter than the hex representation of them
   $colours = array(
               array('808080', 'gray'), array('008000', 'green'), array('800000', 'maroon'),
               array('00080', 'navy'), array('808000', 'olive'), array('800080', 'purple'),
               array('ff0000', 'red'), array('c0c0c0', 'silver'), array('008080', 'teal')
                   );
                   
   // loop through each colour
   for ($n = 0; $n < count($colours); $n++)
       // replace hex with colour name
       // ie #808080 -> gray
       $string = str_replace('#' . $colours[$n][0], $colours[$n][1], $string);
}
 
// zero is always zero, so measurements don't matter
function remove_zero_measurements(&$string)
{
   // change 0 ems, 0 pixels and 0 percentages to 0
   // this wont change values like 10px, since those do need measurements
   $string = trim(eregi_replace('([^0-9])0(px|em|\%)', '\\10', ' ' . $string));
   $string = trim(eregi_replace('([^0-9])0\.([0-9]+)em', '\\1.\\2em', ' ' . $string));
}
 
// this seperates the css file into it's rules,
// which it then sends to another function to sort into each part
function sort_css($cssfile)
{
   // the first thing to do is seperate everything out in the file
   // so loop round each rule in the file
   while ($cssfile)
   {
       // check if there is some more code
       if (substr_count($cssfile, '}'))
       {
           // the next rule is everything up to the squiggly bracket
           $rule = substr($cssfile, 0, strpos($cssfile, '}')+1);
           // seperate out everything in this rule and add it to different global arrays
           parse_rules($rule);
           // remove that rule from the css file
           $cssfile = substr($cssfile, strlen($rule), strlen($cssfile));
       }    
       // no more rules?
       else
           // kill the css file variable to terminate this loop
           unset($cssfile);
   }
}
 
// turns font-weight text into numbers
// for example: font-weight:normal -> font-weight:400
function font_weight_text_to_numbers(&$string)
{
   // make these variables available to this function
   global $file_selector;
   global $file_props;
   
   for ($a = 0; $a < count($file_props); $a++)
   {
       for ($b = 0; $b < count($file_props[$a]); $b++)
       {
           if ($file_props[$a][$b] == 'font-weight:bold')
               $file_props[$a][$b] = 'font-weight:700';
           if ($file_props[$a][$b] == 'font-weight:normal')
               $file_props[$a][$b] = 'font-weight:400';
               
           $file_props[$a][$b] = str_replace('font:normal', 'font:400', $file_props[$a][$b]);
           $file_props[$a][$b] = str_replace('font:bold', 'font:700', $file_props[$a][$b]);    
       }
   }
}
 
// seperate the parts of each rule
function parse_rules($css)
{
   // make these variables available to this function
   global $file_selector;
   global $file_props;
 
   // get the selectors contained in this part of the sheet
   $selector = substr($css, 0, strpos($css, '{'));
   // get the css properties and values contained in this part of the sheet
   $props = trim(substr($css, strlen($selector)+1, -1));
   
   // remove extra space from before, between and after the selector(s)
   strip_space($selector);
   // remove any additional space
   $selector = trim(eregi_replace(', +', ',', $selector));    
   $selector = trim(eregi_replace(' +,', ',', $selector));    
   // seperate selector(s) and add to the global selector array    
   $file_selector[] = array_unique(explode(',', $selector));
   
   // shorten the css code
   strip_space($props);
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
   $file_props[] = explode(';', $props);
}
 
// removes white space from a string and returns the result
function strip_space(&$string)
{
   // kill whitespace on classes
   // kill new lines
   $string = str_replace(chr(10), '', $string);
   $string = str_replace(chr(13), '', $string);
   // change tabs into spaces
   $string = str_replace(chr(9), ' ', $string);
   // remove additional white space
   $string = eregi_replace(' +', ' ', $string);
}
 
// the following code combines rules with the same single selector
// currently it only works on rules which have one selector
function combine_identical_selectors()
{
   // make these arrays available to this function
   global $file_selector;
   global $file_props;
   
   // this will store which selectors have been used
   $cur_selectors = array();
   
   // loop through all the rules
   for ($a = 0; $a < count($file_selector); $a++)
   {
       // check there is only one selector
       if (count($file_selector[$a]) == 1)
       {
           // see if this selector has been used before
           if (in_array($file_selector[$a][0], $cur_selectors))
           {
               // if so, loop round until it can be found
               for ($b = 0; $b < count($cur_selectors); $b++)
               {
                   // check if this matches a previous rule
                   if ($cur_selectors[$b] == $file_selector[$a][0])
                   {
                       // combine the properties in this rule and the previous one
                       // they remian in the order they were in the file, so new rules override old ones
                       $new_props = array_merge($file_props[$b], $file_props[$a]);
                       // replace the current props with all of them
                       $file_props[$a] = $new_props;
                       // kill the old selector
                       $file_selector[$b] = NULL;
                       // kill the old properties
                       $file_props[$b] = array(NULL);
                       // remove from the selectors array
                       $cur_selector[$b] = NULL;
                   }
               }
           }
           // add the current selector to the selectors array
           $cur_selectors[] = $file_selector[$a][0];        
       }
       else
           // add nothing to maintain the selector index
           $cur_selectors[] = NULL;
   }
}
 
// this removes duplicates classes from rules
// if a property is repeated the last one is only used, so old oens can be safely removed
function remove_overwritten_properties()
{
   // make these arrays available to this function
   global $file_selector;
   global $file_props;
   
   // loop through rules
   for ($a = 0; $a < count($file_props); $a++)
   {
       // this will store the property list
       $cur_props = array();
       // loop through all the properties in the current rule
       for ($b = 0; $b < count($file_props[$a]); $b++)
       {
           // explode the property and the value
           $parts = explode(':', $file_props[$a][$b]);
           // check if this property has been used previously
           if (in_array($parts[0], $cur_props))
           {
               // if so, find where
               for ($c = 0; $c < count($cur_props); $c++)
               {
                   // check if it's the same as the old one
                   if ($cur_props[$c] == $parts[0])
                       // kill the old one, it's not needed
                       $file_props[$a][$c] = NULL;
               }
           }
           // add the type to the property array
           $cur_props[] = $parts[0];
       }
   }
}
 
// this is the list of properties that can be combined
function combine_props_list(&$props)
{
   // each call sends the current part of the stylesheet being worked on,
   // the combined property,
   // the parts which makes up this property
   
   combine_props($props, 'padding', array('padding-top', 'padding-right', 'padding-bottom', 'padding-left'));    
   
   combine_props($props, 'margin', array('margin-top', 'margin-right', 'margin-bottom', 'margin-left'));    
 
   combine_props($props, 'list-style', array('list-style-type', 'list-style-position', 'list-style-image'));
   combine_props($props, 'list-style', array('list-style-type', 'list-style-position'));
   
   combine_props($props, 'outline', array('outline-color', 'outline-style', 'outline-width'));    
   
   // to do: this might be improvable
   combine_props($props, 'background', array('background-color', 'background-image', 'background-repeat', 'background-attachment', 'background-position'));
 
   // to do: combine all border-[places] if they're the same (need a special function for that)
   combine_props($props, 'border-bottom', array('border-bottom-width', 'border-bottom-style', 'border-bottom-color'));
   combine_props($props, 'border-top', array('border-top-width', 'border-top-style', 'border-top-color'));
   combine_props($props, 'border-left', array('border-left-width', 'border-left-style', 'border-left-color'));
   combine_props($props, 'border-right', array('border-right-width', 'border-right-style', 'border-right-color'));
   
   // to do: this needs some checking
   combine_props($props, 'font', array('font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-variant', 'font-weight', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-weight', 'font-size', 'line-height', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-variant', 'font-size', 'line-height', 'font-family'));
   combine_props($props, 'font', array('font-variant', 'font-weight', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-weight', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-variant', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-variant', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-weight', 'font-size', 'font-family'));
   combine_props($props, 'font', array('font-style', 'font-size', 'font-family'));    
}
 
// this code is responsible for combining properties off rules
// example: margin-left, margin-right, margin-top, margin-bottom can be combined to just margin:
// the combined variable would be 'margin' and the parts would eb the properties before
function combine_props(&$props, $combined, $parts)
{
   // split the properties and values
   for ($n = 0; $n < count($props); $n++)
   {
       // add the type to an array
       $props_type[] = substr($props[$n], 0, strpos($props[$n], ':'));
       // add the values to an array, although those are just stored and not processed
       $props_values[] = substr($props[$n], strpos($props[$n], ':')+1, strlen($props[$n]));
   }
   // assume it's combinable
   $combinable = TRUE;
   // loop through all the different properties that can be combined in this instance
   for ($n = 0; $n < count($parts); $n++)
   {
       // check if this property isn't contained within the combinable array
       if (!in_array($parts[$n], $props_type))
           // if so, it can't be combined, so store that
           $combinable = FALSE;
   }
   // if any of the properties were contained in the combinable array
   if ($combinable)
   {
       // loop through all the parts
       for ($a = 0; $a < count($parts); $a++)
       {
           // loop through all the properties found here
           for ($b = 0; $b < count($props_type); $b++)
           {
               // check if it's the same
               if ($props_type[$b] == $parts[$a])
               {
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
}
 
// this function just calls other ones
function reduce_prop(&$item, $key)
{
   // reduces six hex codes to three (#ff0000 -> #f00)
   if ($_REQUEST['opt_short_hex'])
       short_hex($item);
   // removes useless values from padding and margins (margin: 4px 5px 4px 5px -> margin: 4px 5px)
   if ($_REQUEST['opt_short_margins_and_paddings']);
       compress_padding_and_margins($item);
}
 
// this code turns hex codes into short three-character hex codes when possible
// for example:
//  #ff0000 -> #f00
//  #aabbcc -> #abc
function short_hex(&$item)
{
   // check if this part of the code has some hex codes in it
   if (strstr($item, '#'))
   {
       // grab the next six characters
       $hex = substr($item, strpos($item, '#')+1, 6);
       // check if this is a hex code, so ids don't get picked up
       if (eregi('[0-9a-f]{6}', $hex))
       {
           // if the characters in each pair match
           if ($hex[0] == $hex[1] && $hex[2] == $hex[3] && $hex[4] == $hex[5])
               // it can be made shorter, so convert to the shorter version
               $item = eregi_replace('#' . $hex, '#' . $hex[0] . $hex[2] . $hex[4], $item);
       }
   }
}
 
// this removes the useless values from padding and margin properties
// this code is run after properties are combined (like margin-left, margin-top etc)
// for example
//  padding: 5px 5px 5px 5px -> padding: 5px
//  margin: 2px 4px 2px 4px -> margin: 2px 4px
//  padding: 3px 5px 9px 5px -> padding: 3px 5px 9px
function compress_padding_and_margins(&$item)
{
   // get the type and value of the property
   $item_parts = explode(':', $item);
 
   // check if this is a padding or margin property
   if ($item_parts[0] == 'padding' || $item_parts[0] == 'margin')
   {
       // place all the values into an array
       $values = explode(' ', $item_parts[1]);
       
       // switched based on the number of values found
       // no need to check if it's 1, because that can't be compressed
       switch (count($values))
       {
           // icey demonstrates the art of making pop corn:
           case 2:
               // example: margin: 4px 4px
               if ($values[0] == $values[1])
                   // example: margin: 4px
                   array_pop($values);
           break;            
           case 3:
               // example: margin: 5px 7px 5px
               if ($values[0] == $values[2])
               {
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
               if ($values[1] == $values[3])
               {
                   // example: 3px 7px 9px
                   array_pop($values);
                   // example: 3px 4px 3px
                   if ($values[0] == $values[2])
                   {
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
           $item = $item_parts[0] . ':' . implode(' ', $values);
   }
}
 
function remove_empty_rules()
{
   // make these arrays available to this function
   global $file_selector;
   global $file_props;
   // loop through each section of the css file and see if it contains no properties
   for ($a = 0; $a < count($file_selector); $a++)
   {
       // remove blank items from the array
       $file_props[$a] = array_values(array_diff($file_props[$a], array(NULL)));
       // check if this part has no properties
       if (!$file_props[$a][0])
       {
           // remove the empty prop part of the array and the class(es)
           array_splice($file_selector, $a, 1);
           array_splice($file_props, $a, 1);
           // decrease by one due to the decreased total
           $a--;
       }
   }
}
 
// now that the stylesheet has been compressed as much as possible,
// the code to combine identical classes is used
function combine_identical_rules()
{
   // make these variables available locally
   global $file_selector;
   global $file_props;
 
   // loop through each rule
   for ($a = 0; $a < count($file_props); $a++)
   {
       // loop from 0 up the current number, this ensures future processed properties aren't processed prematurely
       for ($b = 0; $b < $a; $b++)
       {
           if (substr($file_selector[$a][0], 0, 1) <> "@" && substr($file_selector[$b][0], 0, 1) <> "@")
           {
               // check if this rule is identical to an earlier one
               if (!array_diff($file_props[$a], $file_props[$b]) && !array_diff($file_props[$b], $file_props[$a]))
               {
                   // combine the selectors
                   $file_selector[$a] = array_unique(array_merge($file_selector[$a], $file_selector[$b]));
                   // remove the old properties
                   $file_props[$b] = array(NULL);
                   // remove the old selectors
                   $file_selector[$b] = array(NULL);
               }
           }
       }
   }
}
 
function create_output()
{
   global $file_selector;
   global $file_props;
   
   if ($_REQUEST['opt_output_colour'])
   {
       if ($_REQUEST['opt_output_compress'])
       {
           $css = '<span style="color:#000;font-family:monospace">';
           for ($a = 0; $a < count($file_selector); $a++)
           {
               for ($b = 0; $b < count($file_selector[$a]); $b++)
                   $file_selector[$a][$b] = '<span style="color:#685">' . $file_selector[$a][$b] . '</span>';
               for ($b = 0; $b < count($file_props[$a]); $b++)
               {
                   $parts = explode(':', $file_props[$a][$b]);
                   $file_props[$a][$b] = '<span style="color:#c86464">' . $parts[0] . '</span>:<span style="color:#369">' . $parts[1] . '</span>';        
               }    
               $css .= implode(',', $file_selector[$a]) . '{';
               $css .= implode(';', $file_props[$a]) . '}';
           }
           $css .= '</span>';        
       }
       else
       {
           $css = '<span style="color:#000;font-family:monospace">';
           for ($a = 0; $a < count($file_selector); $a++)
           {
               for ($b = 0; $b < count($file_selector[$a]); $b++)
                   $file_selector[$a][$b] = '<span style="color:#685">' . $file_selector[$a][$b] . '</span>';
               for ($b = 0; $b < count($file_props[$a]); $b++)
               {
                   $parts = explode(':', $file_props[$a][$b]);
                   $file_props[$a][$b] = '<span style="color:#c86464"> &nbsp; &nbsp; &nbsp;' . $parts[0] . '</span>: <span style="color:#369">' . $parts[1] . '</span>';        
               }    
               $css .= implode(', ', $file_selector[$a]) . ' {<br>';
               $css .= implode(';<br>', $file_props[$a]) . ';<br>}<br> <br>';
           }
           $css .= '</span>';
       }
   }
   else
   {
       if ($_REQUEST['opt_output_compress'])
       {    
           $css = '<span style="font-family:monospace">';
           for ($a = 0; $a < count($file_selector); $a++)
           {
               for ($b = 0; $b < count($file_selector[$a]); $b++)
                   $file_selector[$a][$b] = $file_selector[$a][$b];
               for ($b = 0; $b < count($file_props[$a]); $b++)
               {
                   $parts = explode(':', $file_props[$a][$b]);
                   $file_props[$a][$b] = '' . $parts[0] . ':' . $parts[1];        
               }    
               $css .= implode(',', $file_selector[$a]) . '{';
               $css .= implode(';', $file_props[$a]) . '}';
           }
           $css .= '</span>';    
       }
       else
       {
           $css = '<span style="font-family:monospace">';
           for ($a = 0; $a < count($file_selector); $a++)
           {
               for ($b = 0; $b < count($file_selector[$a]); $b++)
                   $file_selector[$a][$b] = $file_selector[$a][$b];
               for ($b = 0; $b < count($file_props[$a]); $b++)
               {
                   $parts = explode(':', $file_props[$a][$b]);
                   $file_props[$a][$b] = ' &nbsp; &nbsp; &nbsp;' . $parts[0] . ': ' . $parts[1];        
               }    
               $css .= implode(', ', $file_selector[$a]) . ' {<br>';
               $css .= implode(';<br>', $file_props[$a]) . ';<br>}<br> <br>';
           }
           $css .= '</span>';    
       }
   }
   
   return $css;
}    
 
?>