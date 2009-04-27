<?php

require_once 'class.Options.php';

/**
 * it allows you to easily find out what MooTools file you need an creates a costum version for you.
 *
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class MPR extends Options {

	public $options = array(
		'base' => '',
		'pathToMpr' => '',
		'exclude' => array('mprjs.php', 'jsspec.js', 'jquery', 'diffmatchpatch.js', 'mprfullcore.js'),
		'cssMprIsUsed' => true,
		'useCache' => true,
		'cachePath' => 'Mpr/MprCache/',
		'compress' => 'minify' //[none, minify]
	);
	
	/**
	 * A array for simple caching
	 *
	 * @var array
	 */
	protected $cache = array();

	public function __construct($options = null) {
		$this->setOptions($options);
	}
	
	/**
	 * returns the full js code you need
	 *
	 * @param string $url
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getScript($url) {
		return $this->prepareContent($url, 'js');
	}
	
	public function getJsInlineCss($url) {
		return $this->prepareContent($url);
	}
	
	/**
	 * returns the full css code you need
	 *
	 * @param string $url
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getCss($url) {
		return $this->prepareContent($url, 'css');
	}

	/**
	 * finds all need files and save them in an array['js'] and array['css']
	 *
	 * @param string $url
	 * @return array
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getFileList($scripts, $mode = 'loadRequire') {
		$regularExpressionRequire = '#\$require\(MPR\.path\s*?\+\s*?\'(.*?)\'\)#';
		
		$fileList = array('js' => array(), 'css' => array());

		$scripts = array($scripts);
		for ($i = 0; $i < count($scripts); $i++) {
			preg_match_all($regularExpressionRequire, $scripts[$i], $results, PREG_SET_ORDER);
			$results = array_reverse($results);
			foreach($results as $result) {
				//$result = preg_replace( array( '#\s*?MPR\.path\s*?\+\s*#', '#\'#' ), array( $this->options->pathToMpr, '' ), $result[1]);	// MPR.path + '[...]'
				$result = $result[1];
				$resultInfo = pathinfo($result);
				if ( $resultInfo['extension'] === 'js' ) {
					if( $mode == 'loadRequire' ) 
						$scripts[] = $this->loadUrl($result);
					$fileList['js'][] = $result;
				}

				if ( $resultInfo['extension'] === 'css' )
					$fileList['css'][] = $result;
			}
		}
		
		$fileList['js'] = array_unique( array_reverse($fileList['js']) );
		$fileList['css'] = array_unique( array_reverse($fileList['css']) );
		
		return $fileList;
	}	
	
	/**
	 * returns the content of a page via curl
	 *
	 * @param string $url
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	private function getUrlContent($url) {
		$ch = curl_init();
		curl_setopt ($ch, CURLOPT_URL, $url);
		curl_setopt ($ch, CURLOPT_HEADER, 0);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		$str = curl_exec ($ch);
		curl_close ($ch);
		return $str;
	}
	
	/**
	 * extracts all script tags from a given url and loads the external script sources
	 *
	 * @param string $text
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getSiteScripts($text) {
		$scripts = '';
		$regularExpressionScriptTags = 	'#<script.+?src=["|\'](.+?)["|\']|<script.+?>(.|\s)*?</script>#'; //<script src="[...]" !AND! <script>[...]</script>
		preg_match_all($regularExpressionScriptTags, $text, $results, PREG_SET_ORDER);
		
		foreach($results as $result) {
		  if ( ($result[1] !== '') && ( in_array( basename(strtolower($result[1])), (array) $this->options->exclude ) === false) )
				$scripts .= $this->getUrlContent( $this->options->base . $result[1] ) . PHP_EOL;
			if ( ($result[1] === '') && ($result[0] !== '') )
				$scripts .= $result[0] . PHP_EOL;
		}
		
		return $scripts;
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $url
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	private function loadUrl($url) {
		if( isset($this->cache[$url]) )
			return $this->cache[$url];
			
		$urlInfo = parse_url($url);
		$pathinfo = pathinfo( $urlInfo['path'] );
		$isSiteScript = ( ($pathinfo['extension'] === 'js') || ($pathinfo['extension'] === 'css') ) ? false : true;
		
		if (!$isSiteScript) {
			if ( $urlInfo['scheme'] === 'http')
				$scripts = $this->getUrlContent($url);
			elseif ( is_file($url) )
				$scripts = file_get_contents($url);
		} else {
			$scripts = $this->getSiteScripts( $this->getUrlContent($url) );
		}
		
		$this->cache[$url] = $scripts;
		return $scripts;
	}
	
	/**
	 * before we return anything we want to do some common workup.
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	private function prepareContent($url, $what = 'jsInlineCss') {
		$urlInfo = parse_url($url);
		if ($this->options->base === '')
			$this->options->base = $urlInfo['scheme'] . '://' . $urlInfo['host'] . dirname($urlInfo['path']) . '/';
			
		$siteScript = $this->loadUrl($url);
		
		if( $this->options->useCache === true ) {
			$siteRequire = $this->getFileList( $siteScript, 'noLoad' );
			$requireString = ($what === 'js') ? implode(' ', $siteRequire['js']) : implode(' ', $siteRequire['js']) . ' ' . implode(' ', $siteRequire['css']);
			$name = md5( $requireString );
		
			//if a cache is found for these required files it's returned
			if( is_file($this->options->cachePath . $what . '/' . $name) )
				return file_get_contents($this->options->cachePath . $what . '/' . $name);
		}
		
		$fileList = $this->getFileList( $siteScript );
		$content = '';
		$js = '';
		if ($what === 'js' || $what === 'jsInlineCss') {
			if ($this->options->cssMprIsUsed === true)
				foreach($fileList['css'] as $file)
					$js .= 'MPR.files[MPR.path + \'' . $file . '\'] = 1;' . PHP_EOL;
				
			foreach( $fileList['js'] as $file ) {
				if( is_file($file) ) {
					$js .= file_get_contents($file) . PHP_EOL;
					$js .= 'MPR.files[MPR.path + \'' . $file . '\'] = 1;' . PHP_EOL;
				} else
					$js .= 'alert("The file ' . $file . ' couldn\'t loaded!");';
			}
			if ( $this->options->compress === 'minify' ) {
				require_once 'class.JsMin.php';
				$js = JsMin::minify($js);
			}
			$content .= $js;
		}
		
		$css = '';
		if ($what === 'css' || $what === 'jsInlineCss') {
			foreach( $fileList['css'] as $file ) {
				$raw = file_get_contents($file);
				$raw = preg_replace("#url\s*?\('*(.*?)'*\)#", "url('" . dirname($file) . "/$1')", $raw); //prepend local files
				$css .= $raw . PHP_EOL;
			}
			if ( $this->options->compress === 'minify' ) {
				require_once 'class.CssMin.php';
				$css = CssMin::minify($css);
			}
			if ($what === 'jsInlineCss')
				$content .= PHP_EOL . 'new Element("style", {type: "text/css", text: "' . $css . '"}).inject(document.head);';
			else
				$content .= $css;
		}
		
		if( $this->options->useCache === true ) {
			//save cache
			if( !is_dir($this->options->cachePath) )
				mkdir( $this->options->cachePath );
			if( !is_dir($this->options->cachePath . $what . '/') )
				mkdir( $this->options->cachePath . $what . '/' );
			file_put_contents( $this->options->cachePath . $what . '/' . $name, $content );
		}
		
		return $content;
	}
	
}

?>