<?php

	require_once('Mpr/Php/MprConfig.php');
	require_once('Mpr/Php/class.Mpr.php');
	
	if( $useGzip === true )
		ob_start("ob_gzhandler");

	$url = $_SERVER['HTTP_REFERER'];
	$localMPR = new MPR( $MprOptions );
	
	header('Content-Type: text/css');
	
	echo $localMPR->getCss($url);
	
?>