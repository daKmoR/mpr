<?php

require_once('class.Options.php');
require_once('class.Helper.php');

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
		'display' => array('name', 'doc', 'spec'),
		'stdWrap' => '<div>|</div>',
		'itemWrap' => '',
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
		$specPath = $this->options->path . '/Spec/index.js';
		
		// right now I'm skipping to read the xml file
		// if( is_file($metaPath) )
			// fb( file_get_contents( $metaPath ) );
		
		//$this->options->demo = is_file($demoPath) ? '<a href="?mode=demo&amp;file=' . $demoPath . '"><span>demo</span></a>' : '';
		$this->options->doc = is_file($docPath) ? '<a class="doc" href="?mode=doc&amp;file=' . $docPath . '"><span>doc</span></a>' : '';
		$this->options->name = is_file($demoPath) ? '<a href="?mode=demo&amp;file=' . $demoPath . '"><span>' . $this->options->name . '</span></a>' : $this->options->name;
		$this->options->spec = is_file($specPath) ? '<a class="spec" href="?mode=spec&amp;file=' . $specPath . '"><span>spec</span></a>' : '';
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

?>