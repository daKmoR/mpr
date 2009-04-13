<?php

require_once 'class.JsPacker.php';
require_once 'class.CssPacker.php';

/**
 * DESCRIPTION
 *
 * @package MPR
 * @subpackage Controller
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class FlowPacker {

	public static function compress($string, $type = null) {
		$obj = new FlowPacker();
		return $obj->compressJs($string);
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function compressJs($string, $options = null) {
		return JsPacker::compress($string);
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function compressCss($string) {
		return CssPacker::compress($string);
	}

}

?>