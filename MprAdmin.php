<?php

	$indexPath = '../MprIndex';
	
	/* CONFIG END */

	require_once('Mpr/Php/FirePHPCore/fb.php');
	require_once('Mpr/Php/class.MprAdmin.php');
	
	$MprAdmin = new MprAdmin();
	$left = $MprAdmin->render();
	
	$dir = dirname( realpath(__FILE__) );
	if( $dir !== substr( realpath($_REQUEST['file']), 0, strlen($dir) ) )
		die('you can only use files within MPR');
		
	$path = explode('/', $_REQUEST['file']);
		
	if ($_REQUEST['mode'] === 'demo') {
		$demoCode = file_get_contents( $_REQUEST['file'] );
		$center = Helper::getContent($demoCode, '<!-- ### Mpr.Html.Start ### -->', '<!-- ### Mpr.Html.End ### -->');
		
		$codeHeader = Helper::getContent($demoCode, '<!-- ### Mpr.Header.Start ### -->', '<!-- ### Mpr.Header.End ### -->');
		if( $codeHeader ) $header .= $codeHeader;
		
		$css = Helper::getContent($demoCode, '/* ### Mpr.Css.Start ### */', '/* ### Mpr.Css.End ### */');
		if( $css ) $header .= Helper::wrap($css, '<style type="text/css">|</style>');
		
		$js = Helper::getContent($demoCode, '/* ### Mpr.Js.Start ### */', '/* ### Mpr.Js.End ### */');
		if( $js ) $header .= Helper::wrap($js, '<script type="text/javascript">|</script>');
	
	} elseif ($_REQUEST['mode'] === 'doc') {
		$header = '<link rel="stylesheet" href="Mpr/Resources/css/docs.css" type="text/css" media="screen" />';

		// Get the classes:
		require_once 'Mpr/Php/mdocs/markdown.php';
		require_once 'Mpr/Php/mdocs/markdown.mdocs.php';
		require_once 'Mpr/Php/mdocs/geshi.php';
		require_once 'Mpr/Php/mdocs/geshi.mdocs.php';

		$doc = file_get_contents( $_REQUEST['file'] );
		
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
	
		$files = Helper::getFiles( './', 1 );
		unset( $files['.git'] );
		unset( $files['Mpr'] );

		foreach($files as $category => $subdir) {
			foreach( $subdir as $dir => $empty ) {
				$path = './' . $category . '/' . $dir . '/Doc/' . $dir . '.md';
				if( is_file($path) ) {
					$text = file_get_contents($path);
					$teaser = substr($text, 0, 300);
					$teaser = explode("\n", $teaser);
					$teaser = str_replace( array('[', ']'), NULL, $teaser[3]);
				
					$curDoc = array();
					$curDoc['id'] = 'MprAdmin.php?mode=doc&file=' . $path;
					$curDoc['url'] = $curDoc['id'];
					$curDoc['teaser'] = $teaser;
					$curDoc['category'] = $category;
					$curDoc['type'] = 'doc';
					$curDoc['title'] = $dir;
					//$curDoc['content'] = $text;
					print_r($curDoc);
				}
			}
		}
		
		die();

		ini_set('include_path', 'Mpr/Php/');
		require_once('Zend/Search/Lucene.php');
    $index = Zend_Search_Lucene::create($indexPath);
		$doc = new Zend_Search_Lucene_Document();

		$doc->addField(Zend_Search_Lucene_Field::Keyword('id', 'MprAdmin.php?mode=doc&file=./More/Drag/Doc/Drag.md'));
		$doc->addField(Zend_Search_Lucene_Field::UnIndexed('url', 'MprAdmin.php?mode=doc&file=./More/Drag/Doc/Drag.md'));
    $doc->addField(Zend_Search_Lucene_Field::UnIndexed('teaser', 'An extension to the base Drag class with additional functionality for dragging an Element. Supports snapping and droppables.Inherits methods, properties, options and events from Drag'));
    $doc->addField(Zend_Search_Lucene_Field::UnIndexed('type', 'doc'));
    $doc->addField(Zend_Search_Lucene_Field::UnIndexed('category', 'More'));
    $doc->addField(Zend_Search_Lucene_Field::Text('title', 'Drag'));
    $doc->addField(Zend_Search_Lucene_Field::UnStored('content', file_get_contents('./More/Drag/Doc/Drag.md') ));
		$index->addDocument($doc);
		
		$doc2 = new Zend_Search_Lucene_Document();
		$doc2->addField(Zend_Search_Lucene_Field::Keyword('id', 'MprAdmin.php?mode=doc&file=./More/Fx.Accordion/Doc/Fx.Accordion.md'));
		$doc2->addField(Zend_Search_Lucene_Field::UnIndexed('url', 'MprAdmin.php?mode=doc&file=./More/Fx.Accordion/Doc/Fx.Accordion.md'));
    $doc2->addField(Zend_Search_Lucene_Field::UnIndexed('teaser', 'here you will see some Fx.Accordion stuff'));
    $doc->addField(Zend_Search_Lucene_Field::UnIndexed('type', 'doc'));
    $doc->addField(Zend_Search_Lucene_Field::UnIndexed('category', 'More'));
    $doc2->addField(Zend_Search_Lucene_Field::Text('title', 'Fx.Accordion'));
    $doc2->addField(Zend_Search_Lucene_Field::UnStored('content', file_get_contents('./More/Fx.Accordion/Doc/Fx.Accordion.md') ));
		$index->addDocument($doc2);
		
		$index->commit();
	
	} elseif ($_REQUEST['mode'] === 'search') {
		ini_set('include_path', 'Mpr/Php/');
    require_once('Zend/Search/Lucene.php');
 
    $index = Zend_Search_Lucene::open($indexPath);
    $hits = $index->find('complete');
		
		foreach ($hits as $hit) {
			$center .= '<h3>' . $hit->category . ' ' . $hit->title . ' (probability: ' .  sprintf('%.0f', $hit->score*100) . '%)</h3>';
			$center .= '<p>' . $hit->teaser . '<br /> <a href="' . htmlspecialchars( $hit->url ) . '">Read More...</a></p>';
		}
		
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
		</script>
		
		<script src="MprJs.php" type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="MprCss.php" media="screen, projection" />
		
		<?php echo $header; ?>
		
		<script type="text/javascript">
			$require(MPR.path + 'More/Fx.Accordion/Fx.Accordion.js');
			
			window.addEvent('domready', function() {
				var current = 0;
				$$('#menu h4').each( function(el, i) {
					if( el.get('text') == '<?php echo $path[1]; ?>')
						current = i;
				});
		
				var accordionStruc = new Fx.Accordion( $$('#menu h4'), $$('div.accordionContent'), {
					alwaysHide: true,
					show: current,
					onActive: function(toggler, element){
						toggler.setStyle('color', '#FD5C01');
						toggler.setStyles( { 'border-width' : '1px 1px 0' } );
						toggler.getElement('span').setStyle('background-position', '-25px');
					},
					onBackground: function(toggler, element){
						toggler.setStyle('color', '#000');
						toggler.setStyles( { 'border-width' : '1px' } );
						toggler.getElement('span').setStyle('background-position', '0');
					}
				}); 		
			
			});
		</script>
		
	</head>
	<body>
	
		<div id="wrap">
		
			<div id="header">
				<h2 style="border: none; margin-bottom: 10px;"><a href="/">Your Local <acronym title="MooTools Plugin Repository">MPR</acronym></a></h2>
			</div>
			
			<div class="colmask equal px210x750">
				<div class="col1">
					<div class="content" id="menu">
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





