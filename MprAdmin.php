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
					$curDoc['content'] = $text;
					
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
    $hits = $index->find( $_REQUEST['query'] );
		
		$array = array();
		if( $_REQUEST['json'] ) {
			foreach ($hits as $hit)
				$array[] = array('title' => $hit->title, 'category' => $hit->category, 'teaser' => $teaser, 'url' => $hit->url);
				
			echo json_encode($array);
			die();
		}
		
		foreach ($hits as $hit) {
			$center .= '<h3><a href="'. htmlspecialchars( $hit->url ) . '">' . $hit->category . ' / ' . $hit->title . '</a></h3>';
			$teaser = $hit->teaser;
			if( strlen($teaser) > 100 )
				$teaser = substr($teaser, 0, 100) . '...';
			$center .= '<p>' . $teaser . '</p>';
		}
		
		if( $_REQUEST['ajax'] ) {
			echo $center;
			die();
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
			$require(MPR.path + 'Core/Fx.Tween/Fx.Tween.js');
			
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
				
				$('searchResult').fade('hide');
				var SearchRequest = new Request({
					url: 'MprAdmin.php',
					onComplete: function(els) {
						$('searchResult').set('html', els);
						$('searchResult').fade(1);
						if( $('searchResult').getStyle('opacity') == 1 )
							$('searchResult').highlight();
					}
				});
				
				$('searchForm').addEvent('submit', function(e) {
					e.stop();
					SearchRequest.get( {ajax: 1, mode: 'search', query: $('searchInput').get('value')} );
				});
				
				$('searchInput').addEvent('blur', function() { $('searchResult').fade(0); });
			
			});
		</script>
		
	</head>
	<body>
	
		<div id="wrap">
		
			<form action="" method="get" id="searchForm">
				<div id="header">
					<h2 style="border: none; margin-bottom: 10px;"><a href="./MPRAdmin.php">Your Local <acronym title="MooTools Plugin Repository">MPR</acronym></a></h2>
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





