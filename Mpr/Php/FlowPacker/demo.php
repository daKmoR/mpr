<?php

	require_once 'class.JsPacker.php';
	require_once 'class.CssPacker.php';
	
	
	
	//echo JsPacker::compress( file_get_contents('FlowGallery.js') );
	echo CssPacker::compress( file_get_contents('FlowGallery.css') );


?>