<?php
	$url = $_SERVER['HTTP_REFERER'];
	if( !$url ) die();

	require_once('Mpr/Php/MprConfig.php');
	require_once('Mpr/Php/class.Mpr.php');
	
	header('Content-Type: text/css');

	if( $useGzip === true )
		ob_start("ob_gzhandler");

	$localMPR = new MPR( $MprOptions );	
	
	echo $localMPR->getCss($url);
	
?>