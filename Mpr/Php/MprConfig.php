<?php

	
	$useGzip = true;               // do you want to use gzip for supplying the generated scripts [deactivate it if you globally use Gzip]
	
	$MprAdminOptions = array(
		'indexPath' => 'Mpr/MprIndex/',  // the folder where you want to save the search index [relative or absolute]
		'zipPath' => 'Mpr/MprZip/'      // the folder where to save/expect full Plugins as zip files [relative or absolute]
	);
	
	$MprOptions = array(
		'exclude' => array('mprjs.php', 'jsspec.js', 'jquery', 'diffmatchpatch.js', 'mprfullcore.js'),  // files that shouldn't be opened while creating the the complete script file
		'cssMprIsUsed' => true, // do you also use <link rel="stylesheet" type="text/css" href="MprCss.php" media="screen, projection" />?
		'cache' => true, // save cache and reuse it?
		'cachePath' => 'Mpr/MprCache/',  // where to save the cache [relative or absolute]
		'compress' => 'minify' //[none, minify] should the generated Css and Js be minified?
	);
	
	// if there is a MprConfig.php file in the root folder include it - you can override any value there
	if( is_file('MprConfig.php') )
		include_once 'MprConfig.php';
	
	if( !$MprAdminOptions['cachePath'] )
		$MprAdminOptions['cachePath'] = $MprOptions['cachePath'];
	
?>