<?php
class MprIndexedDocument extends Zend_Search_Lucene_Document {
	/**
	 * Constructor. Creates our indexable document and adds all
	 * necessary fields to it using the passed in document
	 */
	public function __construct($document) {
		$this->addField(Zend_Search_Lucene_Field::Keyword(   'id',        $document['id']       ));
		$this->addField(Zend_Search_Lucene_Field::UnIndexed( 'url',       $document['url']      ));
		$this->addField(Zend_Search_Lucene_Field::UnIndexed( 'created',   $document['created']  ));
		$this->addField(Zend_Search_Lucene_Field::UnIndexed( 'teaser',    $document['teaser']   ));
		$this->addField(Zend_Search_Lucene_Field::UnIndexed( 'type',      $document['type']     ));
		$this->addField(Zend_Search_Lucene_Field::UnIndexed( 'category',  $document['category'] ));
		$this->addField(Zend_Search_Lucene_Field::Text(      'title',     $document['title']    ));
		$this->addField(Zend_Search_Lucene_Field::UnStored(  'content',   $document['content']  ));
	}
}
?>