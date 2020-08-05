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
		'button_label' => 'Ajouter un bloc'
	])
		->addRepeater('inner_block', [
			'required' => true,
			'label' => 'Contenu du bloc',
			'min' => 1,
			'button_label' => 'Ajouter un contenu au bloc'
		])
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
