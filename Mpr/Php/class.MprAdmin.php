<?php

require_once('class.Options.php');
require_once('class.Helper.php');
require_once('class.Plugin.php');

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
		'categoryTitleWrap' => '<h4>|<span class="right"></span></h4>',
		'pluginListWrap' => '<div class="accordionContent"><div>|<span class="leftBottom"></span></div></div>',
		'plugin' => array(
			'stdWrap' => '<p>|</p>',
		),
		'path'				=> './',
		'admin' => false,
		'zipPath' => 'Mpr/MprZip/'
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
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function render() {
		$this->files = Helper::getFiles( $this->options->path, 1 );
		unset( $this->files['.git'] );
		unset( $this->files['Mpr'] );
	
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
	
	public function getDocu( $markdownString ) {
			// Get the classes:
		require_once 'Mpr/Php/mdocs/markdown.php';
		require_once 'Mpr/Php/mdocs/markdown.mdocs.php';
		require_once 'Mpr/Php/mdocs/geshi.php';
		require_once 'Mpr/Php/mdocs/geshi.mdocs.php';

		$markdown = new MarkdownExtra_Parser_mDocs();
		$markdown->maxlevel = 1;
		$markdown->minlevel = 2;
		$geshi = new GeSHi_mDocs();
		$geshi->default_language = 'javascript';
		$docu = $markdown->transform($markdownString);

		// Apply GeSHi Syntax Highlighting:
		return $geshi->parse_codeblocks($docu);
	}
	
	public function install( $path ) {
		if( $this->checkPermission() ) {
		
			$zip = new ZipArchive();
			if ( $zip->open($path) === TRUE ) {
				$zip->extractTo( $this->options->path );
				$zip->close();
				return true;
			}
			
		}
		return false;
	}
	
	public function uninstall( $path ) {
		if( $this->checkPermission() ) {
	
			if( !is_dir($this->options->zipPath) )
				mkdir( $this->options->zipPath );
				
			$pathArray = explode('/', $path);
				
			require_once 'Mpr/Php/class.AdvZipArchive.php';
			$myZip = new AdvZipArchive();
			if( $myZip->open( $this->options->zipPath . $pathArray[0] . '^' . $pathArray[1] . '.zip', ZIPARCHIVE::CREATE) === TRUE ) {
				$myZip->addDir( $path, $path );
				$myZip->close();
				
				Helper::removeDir( $path );
				return true;
			}
		
		}
		return false;
	}
	
	
	private function checkPermission() {
		if ( $this->options->admin )
			return true;
		else
			die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
		
		return false;
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

?>