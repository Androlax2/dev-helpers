<?php

use StoutLogic\AcfBuilder\FieldsBuilder;

//======================================================================
// TEXT IMAGE BLOCK
//======================================================================

$imageWidths = [];
for ($i = 0 ; $i <= 100 ; $i++) {
	$imageWidths[] = "$i%";
}

$textImageBlock = new FieldsBuilder('text_image', [
	'label' => 'Image + texte'
]);

$textImageBlock
	->addTab('Paramètres')
	->addSelect('image_position', [
		'required' => true,
		'label' => 'Position de l\'image',
		'choices' => [
			'left' => 'Gauche',
			'right' => 'Droite'
		],
		'default_value' => 'left'
	])
	->addSelect('image_width', [
		'required' => true,
		'label' => 'Largeur de l\'image (en %)',
		'choices' => $imageWidths,
		'default_value' => '50%'
	])
	->addImage('image', [
		'required' => true,
		'label' => 'Image'
	])
	->addTab('Textes')
	->addWysiwyg('title', [
		'required' => true,
		'label' => 'Titre',
		'media_upload' => false
	])
	->addWysiwyg('text', [
		'required' => true,
		'label' => 'Texte',
		'media_upload' => false
	]);

return $textImageBlock;
