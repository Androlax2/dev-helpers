<?php

use StoutLogic\AcfBuilder\FieldsBuilder;

//======================================================================
// BUTTONS BLOCK
//======================================================================

$buttonsBlock = new FieldsBuilder( 'buttons_block', [
	'label' => 'Bloc de boutons'
] );

$buttonsBlock
	->addRepeater('buttons', [
		'label' => 'Boutons',
		'min' => 1,
		'button_label' => 'Ajouter un bouton'
	])
		->addLink('button', [
			'required' => true,
			'label' => 'Bouton'
		])
	->endRepeater();

return $buttonsBlock;
