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
		$zip = new ZipArchive();
		if ( $zip->open($path) === TRUE ) {
			$zip->extractTo( $this->options->path );
			$zip->close();
			return true;
		} else {
			return false;
		}
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