<?php

use StoutLogic\AcfBuilder\FieldsBuilder;

//======================================================================
// ANCHOR BLOCK
//======================================================================

$anchorBlock = new FieldsBuilder('anchor-block', [
	'label' => 'Ancres'
]);

$anchorBlock
	->addRepeater('blocks', [
		'required' => true,
		'label' => 'Blocs',
		'min' => 1,
		'button_label' => 'Ajouter un bloc d\'ancre'
	])
		->addRepeater('inner_block', [
			'required' => true,
			'label' => 'Contenu du bloc',
			'min' => 1,
			'button_label' => 'Ajouter un contenu au bloc',
			'layout' => 'block'
		])
			->addTrueFalse('different_content_title', [
				'label' => 'Titre du contenu différent ?',
				'instructions' => 'Permet d\'utiliser un titre différent',
				'ui' => 1
			])
				->addWysiwyg('content_title', [
					'required' => true,
					'label' => 'Titre du contenu',
					'media_upload' => false
				])
					->conditional('different_content_title', '==', '1')
			->addWysiwyg('title', [
				'required' => true,
				'label' => 'Titre',
				'media_upload' => false
			])
			->addWysiwyg('text', [
				'required' => true,
				'label' => 'Texte'
			])
		->endRepeater()
	->endRepeater();

return $anchorBlock;
