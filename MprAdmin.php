<?php

	require_once 'Mpr/Php/MprConfig.php';
	
	$dir = dirname( realpath(__FILE__) );
	if( $dir !== substr( realpath($_REQUEST['file']), 0, strlen($dir) ) )
		die('you can only use files within MPR');

	require_once('Mpr/Php/FirePHPCore/fb.php');
	require_once('Mpr/Php/class.MprAdmin.php');
		
	$path = explode('/', $_REQUEST['file']);
	
	if ( $_REQUEST['mode'] === 'install' && $_REQUEST['file'] != '' ) {
		if( !is_file('USE_ADMIN_FUNCTIONS') ) die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
	
		$zip = new ZipArchive();
		if ($zip->open( $_REQUEST['file'] ) === TRUE) {
			$zip->extractTo('./');
			$zip->close();
			$_REQUEST['mode'] = 'admin_general';
			unset($_REQUEST['file']);
		} else {
			$center .= 'Install failed';
		}
	} elseif ( $_REQUEST['mode'] === 'uninstall' && $_REQUEST['file'] != '' ) {
		if( !is_file('USE_ADMIN_FUNCTIONS') ) die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
	
		if( !is_dir($zipPath) )
			mkdir($zipPath);
			
		require_once 'Mpr/Php/class.AdvZipArchive.php';
		$myZip = new AdvZipArchive();
		if( $myZip->open($zipPath . $path[0] . '^' . $path[1] . '.zip', ZIPARCHIVE::CREATE) === TRUE ) {
			$myZip->addDir( $_REQUEST['file'], $_REQUEST['file'] );
			$myZip->close();
			
			Helper::removeDir( $_REQUEST['file'] );
			$_REQUEST['mode'] = 'admin_uninstall';
			
			unset($_REQUEST['file']);
		}
	} elseif ( $_REQUEST['mode'] === 'restore' && $_REQUEST['file'] != '') {
		if( !is_file('USE_ADMIN_FUNCTIONS') ) die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
	
		$fileInfo = explode('^', $_REQUEST['file']);
		if( is_dir($fileInfo[0] . '/' . basename($fileInfo[1], '.zip')) )
			Helper::removeDir( $_REQUEST['file'] );
		
		$zip = new ZipArchive();
		if ($zip->open( $_REQUEST['file'] ) === TRUE) {
			$zip->extractTo('./');
			$zip->close();
			$_REQUEST['mode'] = 'admin_general';
			unset($_REQUEST['file']);
		} else {
			$center .= 'Restore failed';
		}
		
	} elseif ( $_REQUEST['mode'] === 'clear_cache' ) {
		if( !is_file('USE_ADMIN_FUNCTIONS') ) die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
	
		Helper::removeDir( $MprOptions['cachePath'] . 'css/' );
		Helper::removeDir( $MprOptions['cachePath'] . 'js/' );
		
		$_REQUEST['mode'] = 'admin_general';
	}
	
	$MprAdmin = new MprAdmin();
	$left = $MprAdmin->render();
		
	if ( $_REQUEST['mode'] === 'demo' && $_REQUEST['file'] != '' ) {
		$demoCode = file_get_contents( $_REQUEST['file'] );
		
		$center .= str_replace('../', $path[1] . '/' . $path[2] . '/', Helper::getContent($demoCode, '<!-- ### Mpr.Html.Start ### -->', '<!-- ### Mpr.Html.End ### -->') );
		
		$codeHeader = Helper::getContent($demoCode, '<!-- ### Mpr.Header.Start ### -->', '<!-- ### Mpr.Header.End ### -->');
		if( $codeHeader ) $header .= $codeHeader;
		
		$css = Helper::getContent($demoCode, '/* ### Mpr.Css.Start ### */', '/* ### Mpr.Css.End ### */');
		if( $css ) $header .= Helper::wrap($css, '<style type="text/css">|</style>');
		
		$js = Helper::getContent($demoCode, '/* ### Mpr.Js.Start ### */', '/* ### Mpr.Js.End ### */');
		if( $js ) $header .= Helper::wrap($js, '<script type="text/javascript">|</script>');
		
	
	} elseif ( $_REQUEST['mode'] === 'docu' && $_REQUEST['file'] != '' ) {
		$header = '<link rel="stylesheet" href="Mpr/Resources/css/docs.css" type="text/css" media="screen" />';

		// Get the classes:
		require_once 'Mpr/Php/mdocs/markdown.php';
		require_once 'Mpr/Php/mdocs/markdown.mdocs.php';
		require_once 'Mpr/Php/mdocs/geshi.php';
		require_once 'Mpr/Php/mdocs/geshi.mdocs.php';

		$doc = file_get_contents( $_REQUEST['file'] );
		$markdown = new MarkdownExtra_Parser_mDocs();
		$markdown->maxlevel = 1;
		$markdown->minlevel = 2;
		$geshi = new GeSHi_mDocs();
		$geshi->default_language = 'javascript';
		$doc = $markdown->transform($doc);

		// Apply GeSHi Syntax Highlighting:
		$doc = $geshi->parse_codeblocks($doc);
		$center = $doc;
		
		
	} elseif ($_REQUEST['mode'] === 'spec')  {
				$header = '
			<link rel="stylesheet" href="Mpr/Resources/css/specs.css" type="text/css" media="screen" />
			<script src="Mpr/Resources/js/JSSpec.js" type="text/javascript"></script>
			<script src="Mpr/Resources/js/DiffMatchPatch.js" type="text/javascript"></script>
			<script src="' . $_REQUEST['file'] . '" type="text/javascript"></script>
		';
		$center = '<div id="jsspec_container"></div>';
		
		
	} elseif ($_REQUEST['mode'] === 'indexing') {
		if( !is_file('USE_ADMIN_FUNCTIONS') ) die('if you want to use admin functionality pls create a file "USE_ADMIN_FUNCTIONS" in this Mpr folder (just an empty file)');
		ini_set('include_path', 'Mpr/Php/');
		require_once('Zend/Search/Lucene.php');
		require_once('Mpr/Php/class.MprIndexedDocument.php');
		
    $index = Zend_Search_Lucene::create($indexPath);
	
		$files = Helper::getFiles( './', 1 );
		unset( $files['.git'] );
		unset( $files['Mpr'] );
		
		foreach($files as $category => $subdir) {
			foreach( $subdir as $dir => $empty ) {
				// docu indexing
				$path = './' . $category . '/' . $dir . '/Docu/' . $dir . '.md';
				if( is_file($path) ) {
					$text = file_get_contents($path);
					$teaser = explode("\n", substr($text, 0, 300) );
					$teaser = str_replace( array('[', ']'), NULL, $teaser[3]);
					$id = 'MprAdmin.php?mode=docu&file=' . $path;
				
					$curDoc = array('doc_id' => $id, 'url' => $id, 'teaser' => $teaser, 'category' => $category, 'type' => 'docu', 'title' => $dir, 'content' => $text);
					
					$doc = new MprIndexedDocument($curDoc);
					$index->addDocument($doc);
				}
				
				// demo indexing
				$path = './' . $category . '/' . $dir . '/Demos/' . $dir . '.html';
				if( is_file($path) ) {
					$demoCode = file_get_contents( $path );
					$text = Helper::getContent($demoCode, '<!-- ### Mpr.Html.Start ### -->', '<!-- ### Mpr.Html.End ### -->');
					$teaser = explode("\n", substr($text, 0, 300) );
					$teaser = str_replace( array('[', ']'), NULL, $teaser[4]);
					$id = 'MprAdmin.php?mode=demo&file=' . $path;
					$text .= Helper::getContent($demoCode, '/* ### Mpr.Css.Start ### */', '/* ### Mpr.Css.End ### */');
					$text .= Helper::getContent($demoCode, '/* ### Mpr.Js.Start ### */', '/* ### Mpr.Js.End ### */');

					$curDoc = array('doc_id' => $id, 'url' => $id, 'teaser' => $teaser, 'category' => $category, 'type' => 'demo', 'title' => $dir, 'content' => $text);
					$doc = new MprIndexedDocument($curDoc);
					$index->addDocument($doc);
				}
				
			}
		}
		$index->commit();
		
		
	} elseif ( $_REQUEST['mode'] === 'search' && $_REQUEST['query'] != '' ) {
		ini_set('include_path', 'Mpr/Php/');
    require_once('Zend/Search/Lucene.php');
 
    $index = Zend_Search_Lucene::open($indexPath);
		$query = $_REQUEST['query'];

		if( (strpos($query, '*') === false) AND (strpos($query, '"') === false) )
			$query .= '*';
		
		try {
			$hits = $index->find( $query );
		} catch (Exception $e) {
			echo 'Error: ' .  $e->getMessage();
			die();
		}
		
		if(count($hits) === 0) {
			echo 'No Results';
			die();
		}
		
		$array = array();
		if( $_REQUEST['json'] ) {
			foreach ($hits as $hit)
				$array[] = array('title' => $hit->title, 'category' => $hit->category, 'teaser' => $teaser, 'url' => $hit->url);
				
			echo json_encode($array);
			die();
		}
		
		foreach ($hits as $hit) {
			$center .= '<h3><a href="'. htmlspecialchars( $hit->url ) . '">' . $hit->category . ' / ' . $hit->title . ' <span class="' . $hit->type . '">(' . $hit->type . ')</span></a></h3>';
			$teaser = $hit->teaser;
			if( strlen($teaser) > 100 )
				$teaser = substr($teaser, 0, 100) . '...';
			$center .= '<p>' . $teaser . '</p>';
		}
		
		if( $_REQUEST['ajax'] ) {
			echo $center;
			die();
		}
		
	} elseif ( $_REQUEST['mode'] === 'zip' && $_REQUEST['file'] != '' ) {
		if( !is_dir($zipPath) )
			mkdir($zipPath);
		
		require_once 'Mpr/Php/class.AdvZipArchive.php';
		$myZip = new AdvZipArchive();
		$myZip->open($zipPath . $path[0] . '^' . $path[1] . '.zip', ZIPARCHIVE::CREATE);

		$myZip->addDir( $_REQUEST['file'], $_REQUEST['file'] );
		$myZip->close();
		
		header('Location: ' . Helper::getPageDIR() . '/' . $zipPath . $path[0] . '^' . $path[1] . '.zip');
		die();
		
		
	} elseif ( $_REQUEST['mode'] === 'admin_general' ) {
		$center .= '<div>
			<h2>Maintenance</h2>
				<a href="?mode=indexing">Recreate Search Index</a> <span class="note">This will complete erase your current search index (for Docs and Demos) and recreate it. (Might take some time)</span><br />
				<a href="?mode=clear_cache">clear cache</a> <span class="note">This will clear the cache in ' . $MprOptions['cachePath'] . '.</span>
			</div>';
		$center .= '<div><h2>Install</h2><span class="note" style="display: block; margin-top: -15px; margin-bottom: 15px;">Once you installed a new Plugin you might want to update the Search index to find stuff from the new Plugin (if it has a Docu or Demos)</span>';
		
		$files = Helper::getFiles($zipPath, 2, 0);
		$install = ''; $restore = '';
		foreach( $files as $file ) {
			$fileInfo = explode('^', $file);
			if( !is_dir($fileInfo[0] . '/' . basename($fileInfo[1], '.zip')) )
				$install .= '<tr><td><a href="?mode=install&amp;file=' . $zipPath . $file . '"><span>install</span></a></td><td>' . basename($fileInfo[1], '.zip') . '</td><td>' . $fileInfo[0] . '</td></tr>';
			else
				$restore .= '<tr><td><a href="?mode=restore&amp;file=' . $zipPath . $file . '"><span>restore</span></a></td><td>' . basename($fileInfo[1], '.zip') . '</td><td>' . $fileInfo[0] . '</td></tr>';
		}
		if ($install !== '')
			$center .= Helper::wrap($install, '<table><tr><th>Action</th><th>Name</th><th>Category</th></tr>|</table>');
		else
			$center .= '<p class="notice">no Plugins to install; if you want to install a Plugin pls copy the zip file into the directory "' . $zipPath . '". This can also just mean that you have all available Plugins installed.</p>';
		
	 $center .= '</div><div><h2>Restore</h2> <span class="note" style="display: block; margin-top: -15px; margin-bottom: 15px;">This will override the Plugin to the saved zip state (files are created every time you extract a plugin; or you can manually copy them into "' . $zipPath . '")</span>';
		if ($restore !== '')
			$center .= Helper::wrap($restore, '<table><tr><th>Action</th><th>Name</th><th>Category</th></tr>|</table>');
		else
			$center .= '<p class="notice">no Plugins to restore; pls check the directory "' . $zipPath . '" if it contains the needed backupfiles</p>';
		$center .= '</div>';
		$center .= '<div><h2>UnInstall</h2><p class="notice">for uninstalling pls use the Uninstall Option on the left</p></div>';

		
	} elseif ( $_REQUEST['mode'] === 'admin_uninstall' ) {
		$files = Helper::getFiles('./', 1);
		unset( $files['.git'] );
		unset( $files['Mpr'] );

		$center .= '<div><h2>UnInstall</h2>';
		$unInstall = '';
		foreach($files as $category => $subdir) {
			foreach( $subdir as $dir => $empty ) {
				$unInstall .= '<tr><td><a href="?mode=uninstall&amp;file=' . $category . '/' . $dir . '">uninstall</a></td><td>' . $dir . '</td><td>' . $category . '</td></tr>';
			}
		}
		
		if( $unInstall !== '' )
			$center .= Helper::wrap($unInstall, '<table><tr><th>Action</th><th>Name</th><th>Category</th></tr>|</table>');
		else
			$center .= '<p class="notice">nothing to UnInstall?</p>';
		$center .= '</div>';
	}
		

?>

<!DOCTYPE html 
	PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="Mpr/Resources/css/screen.css" type="text/css" media="screen" />

		<!--[if IE 7]> 
			<link rel="stylesheet" href="Mpr/Resources/css/screen_ie7.css" type="text/css" media="screen" />
		<![endif]-->

		<!--[if lte IE 6]>
			<link rel="stylesheet" href="Mpr/Resources/css/screen_ie6.css" type="text/css" media="screen" />
		<![endif]-->
		
		<title><?php if($_REQUEST['mode']) echo $path[2] . ' ' . ucfirst($_REQUEST['mode']) . ' - '; ?>Your Local MPR (MooTools Plugin Repository)</title>
		
		<script type="text/javascript">
			var MPR = {};
			MPR.path = '';

var MPR = MPR || {};
if ( typeof(MPR.path) === 'undefined' )
	MPR.path = 'MPR/';

if ( typeof(MPR.files) === 'undefined' )
	MPR.files = [];
	
function $require(source) { return true }

var Asset = Asset || {};
Asset.styles = function(rules, media) {
	var media = media || 'screen';
	if( Browser.Engine.trident ) {
		var obj = new Element('style', { type: 'text/css', media: media }).inject( document.head );
		obj.styleSheet.cssText = rules;
	} else 
		new Element('style', {type: 'text/css', media: media, text: rules}).inject( document.head );
}
MPR.files[MPR.path + 'Tools/Asset.Styles/Asset.Styles.js'] = 1;
		
		</script>
		
		<?php
			//<script src="Mpr/MprFullCore.js" type="text/javascript"></script>
			//<script src="Mpr.php?mode=noCore" type="text/javascript"></script>
			require_once 'Mpr/Php/class.Mpr.php';
			$localMPR = new MPR( $MprOptions );
			echo $localMPR->getScriptTagInlineCss(
				file_get_contents( 'Mpr/Resources/js/MprAdmin.js' ) . PHP_EOL . 
				$js
			);
		?>
		
		<?php echo $header; ?>
		
		<script type="text/javascript" src="Mpr/Resources/js/MprAdmin.js"></script>
		
	</head>
	<body>
	
		<div id="wrap">
		
			<form action="" method="get" id="searchForm">
				<div id="header">
					<h2 style="border: none; margin-bottom: 10px;"><a href="./MprAdmin.php">Your Local <acronym title="MooTools Plugin Repository">MPR</acronym></a></h2>
					<div id="search">
						<input type="text" name="query" id="searchInput" />
						<input type="hidden" name="mode" value="search" />
						<div id="searchResult">
							<h3><a href="MprAdmin.php?mode=doc&amp;file=./Core/Element.Style/Doc/Element.Style.md">Core / Element.Style</a></h3>
							<p>Custom Native to allow all of its methods to be used with any DOM element via the dollar function $....</p>
						</div>
					</div>
				</div>
			</form>
			
			<div class="colmask equal px240x720">
				<div class="col1">
					<div class="content" id="menu">
						<div>
							<h4>Admin<span class="right"></span></h4>
							<div class="accordionContent">
								<div>
									<p><a href="?mode=admin_general"><span>General</span></a></p>
									<p><a href="?mode=admin_uninstall"><span>UnInstall</span></a></p>
									<span class="leftBottom"/>
								</div>
							</div>
						</div>
							
						<?php echo $left; ?>
					</div>
				</div>
				<div class="col2">
					<div class="content" id="contentMain">
						<?php echo $center; ?>
					</div>
				</div>
			</div>
			
			<div id="footer">
				This documentation is released under a <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Attribution-NonCommercial-ShareAlike 3.0</a> License. 
			</div>
			
		</div> <!-- /wrap -->
		
	</body>
</html>





