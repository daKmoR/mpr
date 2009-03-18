<?php

	require_once('Mpr/Php/class.Mpr.php');

	$url = $_SERVER['HTTP_REFERER'];
	$localMPR = new MPR();
	
	header('Content-Type: text/javascript');
	
	echo file_get_contents('Core/Core.js');
	echo file_get_contents('Mpr/MprCore.js');
	echo $localMPR->getScript($url);

?>