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
	
	public static function removeDir($dir, $DeleteMe = TRUE) {
		if ( ! $dh = @opendir ( $dir ) ) return;
		while ( false !== ( $obj = readdir ( $dh ) ) ) {
			if ( $obj == '.' || $obj == '..') continue;
			if ( ! @unlink ( $dir . '/' . $obj ) ) Helper::removeDir ( $dir . '/' . $obj, true );
		}
		closedir ( $dh );
		if ( $DeleteMe ) 
			@rmdir ( $dir );
	}
	
	public static function getContent($content, $markerTop = '<!-- ### Mpr.Html.Start ### -->', $markerBottom = '<!-- ### Mpr.Html.End ### -->', $mode = 'cut') {
		$whereTop = 0;
		if ($whereTop = strpos($content, $markerTop))
		  $whereTop += strlen($markerTop);
		
		$length = strlen($content) - $whereTop;
		if ($whereBottom = strrpos($content, $markerBottom))
			$length = $whereBottom - $whereTop;
			
		if ($whereTop || $whereBottom) {
			if ($mode == "cut")
				return substr($content, $whereTop, $length);
			else if ($mode == "top")
				return substr($content, 0, $whereTop);
			else if ($mode == "bottom")
				return substr($content, $whereBottom, strlen($content));
		}
		
		return $content;
	}
	
	public static function getPageURL() {
		$pageURL = 'http';
		if ($_SERVER['HTTPS'] == 'on') {$pageURL .= 's';}
			$pageURL .= '://';
		if ($_SERVER['SERVER_PORT'] != '80')
			$pageURL .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $_SERVER['REQUEST_URI'];
		else
			$pageURL .= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
		return $pageURL;
	}

	public static function getPageDIR() {
		$pageURL = 'http';
		if ($_SERVER['HTTPS'] == 'on') {$pageURL .= 's';}
			$pageURL .= '://';
		if ($_SERVER['SERVER_PORT'] != '80')
			$pageURL .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . dirname($_SERVER['SCRIPT_NAME']);
		else
			$pageURL .= $_SERVER['SERVER_NAME'] . dirname($_SERVER['SCRIPT_NAME']);
		return $pageURL;
	}
	
	
	
	
}

?>