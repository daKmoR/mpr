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
class Helper {

	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public static function wrap($string, $wrap) {
		$front = substr($wrap, 0, strpos($wrap, '|'));
		$end = substr($wrap, strrpos($wrap, '|')+1, strlen($wrap));
		return $front . $string . $end;		
	}
	
	/**
	 * $mode: 0 => dirs and files; 1 => only dirs;  2 => only files
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public static function getFiles($path, $mode = 0, $depth = 2) {
		if (! is_dir($path)) return array();
		$d = dir($path);
		$files = array();
		while (false !== ($dir = $d->read()) ) {
			if ( ( $dir != "." && $dir != ".." ) ) {
				if (is_dir($d->path . '/' . $dir) ) {
					if ( ($depth >= 1) && ($mode != 2) )
						$files[$dir] = Helper::getFiles($d->path . '/' . $dir, $mode, $depth-1);
				} else if ($mode != 1) {
					$files[] = $dir;
				}
			}
		}
		$d->close();
		ksort($files);
		
		return $files;
	}
	
}

?>