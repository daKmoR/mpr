<?php

/**
 * DESCRIPTION
 *
 * @package MPR
 * @subpackage Controller
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class Options {

	/**
	 * DESCRIPTION
	 *
	 * @var string
	 */
	public $options = array();
	
	/**
	* Description: The setOptions method should be called in the constructor of an extending class
	* @param array $options - The options array resets any default options present in the class
	* @return - $this
	*/
	protected function setOptions($options) {
		if ( is_array($options) || is_object($options) ) {
			foreach ($options as $key => $value)
				$this->options[$key] = $value;
		}
		if ( is_array($this->options) )
			$this->options = $this->arrayToObject($this->options);
		return $this;
	}
	
	/**
	* Description: Recursively returns an array as an object, for easier syntax
	* Credit: Mithras @ http://us2.php.net/manual/en/language.types.object.php#85237
	* @param array $array - The array to return as an object
	* @return - The object converted from the array
	*/
	public function arrayToObject(array $array){
		foreach ($array as $key => $value)
			if (is_array($value)) $array[$key] = $this->arrayToObject($value);
		return (object) $array;
	}

}

?>