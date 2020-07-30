<?php

use StoutLogic\AcfBuilder\FieldsBuilder;

//======================================================================
// LAST POSTS
//======================================================================

$lastPosts = new FieldsBuilder('last_posts', [
	'label' => 'Les dernières actualités'
]);

$lastPosts
		->addTaxonomy('category', [
			'label' => 'Catégorie',
			'required' => true,
			'add_term' => false
		])
		->addSelect('title_tag', [
			'required' => true,
			'label' => 'Tag titre',
			'choices' => [
				'h1' => 'h1',
				'h2' => 'h2',
				'h3' => 'h3',
				'h4' => 'h4',
				'h5' => 'h5',
				'h6' => 'h6',
			],
			'default_value' => 'h2'
		])
		->addLink('all_posts', [
			'label' => 'Lien vers toutes les actualités'
		]);

return $lastPosts;
