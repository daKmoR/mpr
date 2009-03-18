<?php

	require_once('Mpr/Php/class.Mpr.php');

	$url = $_SERVER['HTTP_REFERER'];
	$localMPR = new MPR();
	
	header('Content-Type: text/css');
	
	echo $localMPR->getCss($url);
	
?>