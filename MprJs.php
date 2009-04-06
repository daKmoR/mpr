<?php
	require_once('Mpr/Php/class.Mpr.php');

	$url = $_SERVER['HTTP_REFERER'];
	
	$localMPR = new MPR();
	
	header('Content-Type: text/javascript');
	
//	echo file_get_contents('Core/Core.js');
	
	echo file_get_contents('Core/Core/Core.js');
	echo file_get_contents('Core/Core.Browser/Core.Browser.js');
	
	echo file_get_contents('Core/Native.Array/Native.Array.js');
	echo file_get_contents('Core/Native.Function/Native.Function.js');
	echo file_get_contents('Core/Native.Number/Native.Number.js');
	echo file_get_contents('Core/Native.String/Native.String.js');
	echo file_get_contents('Core/Native.Hash/Native.Hash.js');
	echo file_get_contents('Core/Native.Event/Native.Event.js');
	
	echo file_get_contents('Core/Class/Class.js');
	echo file_get_contents('Core/Class.Extras/Class.Extras.js');
	
	echo file_get_contents('Core/Element/Element.js');
	echo file_get_contents('Core/Element.Event/Element.Event.js');
	
	echo file_get_contents('Core/Utilities.Selectors/Utilities.Selectors.js');

	echo file_get_contents('Core/Utilities.DomReady/Utilities.DomReady.js');

	echo file_get_contents('Core/Request/Request.js');
	
	echo file_get_contents('Mpr/MprCore.js');
	
	echo '
		MPR.files[MPR.path + "Mpr/MprCore.js"] = 1;
		MPR.files[MPR.path + "Core/Core/Core.js"] = 1;
		MPR.files[MPR.path + "Core/Core.Browser/Core.Browser.js"] = 1;
		MPR.files[MPR.path + "Core/Native.Array/Native.Array.js"] = 1;
		MPR.files[MPR.path + "Core/Native.Function/Native.Function.js"] = 1;
		MPR.files[MPR.path + "Core/Native.Number/Native.Number.js"] = 1;
		MPR.files[MPR.path + "Core/Native.String/Native.String.js"] = 1;
		MPR.files[MPR.path + "Core/Native.Hash/Native.Hash.js"] = 1;
		MPR.files[MPR.path + "Core/Native.Event/Native.Event.js"] = 1;
		MPR.files[MPR.path + "Core/Class/Class.js"] = 1;
		MPR.files[MPR.path + "Core/Class.Extras/Class.Extras.js"] = 1;
		MPR.files[MPR.path + "Core/Element/Element.js"] = 1;
		MPR.files[MPR.path + "Core/Element.Event/Element.Event.js"] = 1;
		MPR.files[MPR.path + "Core/Utilities.Selectors/Utilities.Selectors.js"] = 1;
		MPR.files[MPR.path + "Core/Utilities.DomReady/Utilities.DomReady.js"] = 1;
		MPR.files[MPR.path + "Core/Request/Request.js"] = 1;
	';

	echo $localMPR->getScript($url);

?>