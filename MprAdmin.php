<?php
	require_once('Mpr/Php/FirePHPCore/fb.php');
	
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

/**
 * DESCRIPTION
 *
 * @package MPR
 * @subpackage Controller
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class Plugin extends Options {
	
	public $options = array(
		'path' => '',
		'name' => '',
		'doc' => '',
		'demo' => '',
		'display' => array('name', 'doc', 'demo'),
		'stdWrap' => '<div>|</div>',
		'itemWrap' => '<td>|</td>',
		'version' => '0'
	);
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function Plugin( $name, $path, $options ) {
		$this->setOptions($options);
		$this->options->name = $name;
		$this->options->path = $path;
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getData() {
		$metaPath = $this->options->path . '/Meta/Plugin.xml';
		$demoPath = $this->options->path . '/Demos/index.html';
		$docPath  = $this->options->path . '/Doc/index.md';
		
		// right now I'm skipping to read the xml file
		// if( is_file($metaPath) )
			// fb( file_get_contents( $metaPath ) );
			
		$this->options->demo = is_file($demoPath) ? '<a href="' . $demoPath . '"><span>demo</span></a>' : '';
		$this->options->doc = is_file($docPath) ? '<a href="?mode=doc&file=' . $docPath . '"><span>doc</span></a>' : '';
		
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function render() {
		$this->getData();
		
		$content = '';
		
		foreach( $this->options->display as $display )
			$content .= Helper::wrap( $this->options->$display, $this->options->itemWrap );
		
		return Helper::wrap( $content, $this->options->stdWrap );
	}
	
}

/**
 * DESCRIPTION
 *
 * @package MPR
 * @subpackage Controller
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class MprAdmin extends Options {

	public $options = array(
		'categoryWrap' => '<div>|</div>',
		'categoryTitleWrap' => '<h2>|</h2>',
		'pluginListWrap' => '<table>|</table>',
		'plugin' => array(
			'stdWrap' => '<tr>|</tr>',
		),
		'path'				=> './'
	);
	
	private $files = array();
	private $plugin = array();

	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function MprAdmin($options = null) {
		$this->setOptions($options);
		
		$this->files = Helper::getFiles( $this->options->path, 1 );
		unset( $this->files['.git'] );
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function render() {
		$content = '';
		foreach( $this->files as $dir => $subdir ) {
			$category = '';
			$category .= Helper::wrap( $dir, $this->options->categoryTitleWrap );
			if ( is_array($subdir) ) {
				$plugin = '';
				foreach( $subdir as $subdirdir => $subsubdir ) {
					$this->plugins[] = new Plugin( $subdirdir, $this->options->path . $dir . '/' . $subdirdir, $this->options->plugin );
					$plugin .= end($this->plugins)->render();
				}
				$category .= Helper::wrap( $plugin, $this->options->pluginListWrap );
				
			}
			
			$content .= Helper::wrap( $category, $this->options->categoryWrap );
		}
		return $content;
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function renderPluginData( $plugin ) {
		Helper::wrap( $this->getPluginData($this->options->path . $dir . '/' . $subdirdir), $this->options->pluginWrap );
	  return;
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getPluginData( $path ) {
		return $path;
	}

}

if ($_REQUEST['mode'] === 'doc') {

	// Get the classes:
	require_once 'Mpr/Php/mdocs/markdown.php';
	require_once 'Mpr/Php/mdocs/markdown.mdocs.php';
	require_once 'Mpr/Php/mdocs/toc.php';
	require_once 'Mpr/Php/mdocs/menu.php';
	require_once 'Mpr/Php/mdocs/geshi.php';
	require_once 'Mpr/Php/mdocs/geshi.mdocs.php';

	$file = $_REQUEST['file'];
	$doc = file_get_contents($file);
	
	// Initialize Markdown
	$markdown = new MarkdownExtra_Parser_mDocs();
	$markdown->maxlevel = 1;
	$markdown->minlevel = 2;
	
	// Initialize GeSHi (Syntax Highlighting)
	$geshi = new GeSHi_mDocs();
	$geshi->default_language = 'javascript';	
	
	// Apply Markdown Syntax:
	$doc = $markdown->transform($doc);

	// Apply GeSHi Syntax Highlighting:
	$doc = $geshi->parse_codeblocks($doc);	

	echo $doc;
	
} else {

	$bla = new MprAdmin();
	echo $bla->render();
	
}


?>