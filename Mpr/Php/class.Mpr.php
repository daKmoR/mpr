<?php
/**
 * it allows you to easily find out what MooTools file you need an creates a costum version for you.
 *
 * @version $Id:
 * @copyright Copyright belongs to the respective authors
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class MPR {
	
	/**
	 * Holds the absolute url to the url
	 *
	 * @var string
	 */
	protected $base = '';
	
	/**
	 * relative path from the script to the MPR
	 *
	 * @var string
	 */
	protected $pathToMpr = '';
	
	/**
	 * A array for simple caching
	 *
	 * @var array
	 */
	protected $cache = array();
	
	/**
	 * setter for $base
	 *
	 * @param string $base
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function setBase($base) {
		$this->base = $base;
	}
	
	/**
	 * set if the css is also created with this script [should be autoset, xxx - not implemented yet]
	 *
	 * @var boolean
	 */
	protected $cssMprIsUsed = true;
	
	/**
	 * returns the full js code you need
	 *
	 * @param string $url
	 * @return string
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getScript($url) {
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
	 * finds all need files and same them in an array['js'] and array['css']
	 *
	 * @param string $url
	 * @return array
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	public function getFileList($url) {
		$regularExpressionRequire = '#\$require\(\s*?MPR\.path\s*?\+\s*?\'(.*?)\'\)#';
		
		$fileList = array('js' => array(), 'css' => array());
		$scripts = array( $this->loadUrl($url) );
		
		for ($i = 0; $i < count($scripts); $i++) {
			preg_match_all($regularExpressionRequire, $scripts[$i], $results, PREG_SET_ORDER);
			$results = array_reverse($results);
			foreach($results as $result) {
				//$result = preg_replace( array( '#\s*?MPR\.path\s*?\+\s*#', '#\'#' ), array( $this->pathToMpr, '' ), $result[1]);	// MPR.path + '[...]'
				$result = $result[1];
				$resultInfo = pathinfo($result);
				if ( $resultInfo['extension'] === 'js' ) {
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
	 * returns the content of a page view curl
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
	private function getSiteScripts($url) {
		$text = $this->getUrlContent($url);
		$scripts = '';
		$regularExpressionScriptTags = 	'#<script.+?src=["|\'](.+?)["|\']|<script.+?>(.|\s)*?</script>#'; //<script src="[...]" !AND! <script>[...]</script>
		preg_match_all($regularExpressionScriptTags, $text, $results, PREG_SET_ORDER);
		
		foreach($results as $result) {
		  if ( ($result[1] !== '') && (strpos($result[1], 'MprJs') === false) )
				$scripts .= $this->getUrlContent( $this->base . $result[1] ) . PHP_EOL;
			if ( ($result[1] === '') && ($result[0] !== '') )
				$scripts .= $result[0] . PHP_EOL;
		}
		
		return $scripts;
	}
	
	/**
	 * DESCRIPTION
	 *
	 * @param string $input
	 * @return void
	 * @author Thomas Allmer <at@delusionworld.com>
	 */
	private function loadUrl($url) {
		if( isset($this->cache[$url]) )
			return $this->cache[$url];
			
		$urlInfo = pathinfo($url);
		$isSiteScript = ( ($urlInfo['extension'] === 'js') || ($urlInfo['extension'] === 'css') ) ? false : true;

		if (!$isSiteScript) {
			if (strpos( $url, 'http') === 0)
				$scripts = $this->getUrlContent($url);
			else
				$scripts = file_get_contents($url);
		} else {
			$scripts = $this->getSiteScripts( $url );
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
	private function prepareContent($url, $what = 'js') {
		if ($this->base === '')
			$this->setBase( dirname($url) . '/' );
			
		$fileList = $this->getFileList($url);
		$content = '';
		
		if ($what === 'js') {
			if ($this->cssMprIsUsed === true)
				foreach($fileList['css'] as $file)
					$content .= 'MPR.files[MPR.path + \'' . $file . '\'] = 1;' . PHP_EOL;
				
			foreach( $fileList['js'] as $file ) {
				$content .= file_get_contents($file) . PHP_EOL;
				$content .= 'MPR.files[MPR.path + \'' . $file . '\'] = 1;' . PHP_EOL;
			}
		}
		
		if ($what === 'css')
			foreach( $fileList['css'] as $file ) {
				$raw = file_get_contents($file);
				$raw = preg_replace("#url\s*?\('*(.*?)'*\)#", "url('" . dirname($file) . "/$1')", $raw); //prepend local files
				$content .= $raw . PHP_EOL;
			}
		
		return $content;
	}
	
}

?>