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
		'zipPath' => 'Mpr/MprZip/',
		'indexPath' => 'Mpr/MprIndex/',
		'cachePath' => 'Mpr/MprCache/'
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
		$this->files = Helper::getFiles( $this->options->path, 'dirs' );
		unset( $this->files['.git'] );
		unset( $this->files['Mpr'] );
	
		$content = '';
		foreach( $this->files as $dir => $subdir ) {
			$category = '';
			$category .= Helper::wrap( $dir, $this->options->categoryTitleWrap );
			if ( is_array($subdir) ) {
				$plugin = '';
				foreach( $subdir as $subdirdir => $subsubdir ) {
					$this->plugins[$dir . '/' . $subdirdir] = new Plugin( $subdirdir, $this->options->path . $dir . '/' . $subdirdir, $this->options->plugin );
					$plugin .= $this->plugins[$dir . '/' . $subdirdir]->render();
				}
				$category .= Helper::wrap( $plugin, $this->options->pluginListWrap );
			}
			$content .= Helper::wrap( $category, $this->options->categoryWrap );
		}
		return $content;
	}
	
	public function showPluginDetails( $path ) {
		return $this->plugins[$path]->renderDetail();
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
	
	public function highlight( $source, $language = 'javascript' ) {
		require_once 'Mpr/Php/mdocs/geshi.php';
		
		$geshi = new GeSHi($source, $language);
		return $geshi->parse_code();		
	}
	
	public function createZip( $path ) {
		if( !is_dir($this->options->zipPath) )
			mkdir( $this->options->zipPath );
			
		$pathArray = explode('/', $path);
			
		require_once 'Mpr/Php/class.AdvZipArchive.php';
		$myZip = new AdvZipArchive();
		if( $myZip->open( $this->options->zipPath . $pathArray[0] . '^' . $pathArray[1] . '.zip', ZIPARCHIVE::CREATE) === TRUE ) {
			$myZip->addDir( $path, $path );
			$myZip->close();
			return true;
		}
		
		return false;
	}

	
	public function getZip( $path ) {
		if( $this->createZip( $path ) ) {
			$pathArray = explode('/', $path);
			header('Location: ' . Helper::getPageDIR() . '/' . $this->options->zipPath . $pathArray[0] . '^' . $pathArray[1] . '.zip');
			die();
		}
		return false;
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
		
			if( $this->createZip($path) ) {
				Helper::removeDir( $path );
				return true;
			}
		
		}
		return false;
	}
	
	public function restore( $path ) {
		if( $this->checkPermission() ) {
		
			$fileInfo = explode('^', $path);
			if( is_dir($fileInfo[0] . '/' . basename($fileInfo[1], '.zip')) )
				Helper::removeDir( $path );
			
			$this->install( $path );
		
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
	
	public function clearCache() {
		if( $this->checkPermission() ) {
	
			if( is_dir($this->options->cachePath . 'css/') )
				Helper::removeDir( $this->options->cachePath . 'css/' );
			if( is_dir($this->options->cachePath . 'js/') )
				Helper::removeDir( $this->options->cachePath . 'js/' );
			if( is_dir($this->options->cachePath . 'jsInlineCss/') )
				Helper::removeDir( $this->options->cachePath . 'jsInlineCss/' );
				
		}
	}
	
	public function search( $query, $mode = 'html' ) {
		ini_set('include_path', 'Mpr/Php/');
		require_once('Zend/Search/Lucene.php');
 
		$index = Zend_Search_Lucene::open( $this->options->indexPath );

		if( (strpos($query, '*') === false) AND (strpos($query, '"') === false) )
			$query .= '*';
		
		try {
			$hits = $index->find( $query );
		} catch (Exception $e) {
			return 'Error: ' .  $e->getMessage();
		}
		
		if(count($hits) === 0)
			return 'No Results';
			
		$content = '';
		if ( $mode === 'html' ) {
			foreach ($hits as $hit) {
				$content .= '<h3><a href="'. htmlspecialchars( $hit->url ) . '">' . $hit->category . ' / ' . $hit->title . ' <span class="' . $hit->type . '">(' . $hit->type . ')</span></a></h3>';
				$teaser = $hit->teaser;
				if( strlen($teaser) > 100 )
					$teaser = substr($teaser, 0, 100) . '...';
				$content .= '<p>' . $teaser . '</p>';
			}
		} elseif( $mode === 'json' ) {
			$array = array();
			foreach ($hits as $hit)
				$array[] = array('title' => $hit->title, 'category' => $hit->category, 'teaser' => $teaser, 'url' => $hit->url);
				
			$content = json_encode($array);
		}
		
		return $content;
		
	}
	
	public function newIndex() {
		ini_set('include_path', 'Mpr/Php/');
		require_once('Zend/Search/Lucene.php');
		require_once('class.MprIndexedDocument.php');
		
		$index = Zend_Search_Lucene::create( $this->options->indexPath );
	
		$files = Helper::getFiles( './', 'dirs' );
		unset( $files['.git'] );
		unset( $files['Mpr'] );
		
		foreach($files as $category => $subdir) {
			foreach( $subdir as $dir => $items ) {
				$path = './' . $category . '/' . $dir . '/Docu/';
				if( is_dir($path) ) {
					$docuFiles = Helper::getFiles( $path, 'files' );
					if( count($docuFiles) ) {
						foreach( $docuFiles as $docu ) {
							$text = file_get_contents($path . $docu);
							$teaser = explode("\n", substr($text, 0, 300) );
							$teaser = str_replace( array('[', ']'), NULL, $teaser[3]);
							$id = 'MprAdmin.php?mode=docu&file=' . $path . $docu;
						
							$curDoc = array('doc_id' => $id, 'url' => $id, 'teaser' => $teaser, 'category' => $category, 'type' => 'docu', 'title' => $docu , 'content' => $text);
							
							$doc = new MprIndexedDocument($curDoc);
							$index->addDocument($doc);
						}
					}
				}
					
				$path = './' . $category . '/' . $dir . '/Demos/';
				if( is_dir($path) ) {
					$demoFiles = Helper::getFiles( $path, 'files' );
					if( count($demoFiles) ) {
						foreach( $demoFiles as $demo ) {
							$demoCode = file_get_contents( $path . $demo );
							$text = Helper::getContent($demoCode, '<!-- ### Mpr.Html.Start ### -->', '<!-- ### Mpr.Html.End ### -->');
							$teaser = explode("\n", substr($text, 0, 300) );
							$teaser = str_replace( array('[', ']'), NULL, $teaser[4]);
							$id = 'MprAdmin.php?mode=demo&file=' . $path . $demo;
							$text .= Helper::getContent($demoCode, '/* ### Mpr.Css.Start ### */', '/* ### Mpr.Css.End ### */');
							$text .= Helper::getContent($demoCode, '/* ### Mpr.Js.Start ### */', '/* ### Mpr.Js.End ### */');

							$curDoc = array('doc_id' => $id, 'url' => $id, 'teaser' => $teaser, 'category' => $category, 'type' => 'demo', 'title' => $demo, 'content' => $text);
							$doc = new MprIndexedDocument($curDoc);
							$index->addDocument($doc);
						}
					
					}
				}
				
			}
		}
		$index->commit();
	}
	
}

?>