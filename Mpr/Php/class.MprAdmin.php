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
		
		$this->files = Helper::getFiles( $this->options->path, 1 );
		unset( $this->files['.git'] );
		unset( $this->files['Mpr'] );
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

?>