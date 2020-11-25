<?php

use StoutLogic\AcfBuilder\FieldsBuilder;

//======================================================================
// ANCHOR BLOCK
//======================================================================

//@formatter:off
        $anchorBlock = new FieldsBuilder('anchor_block', [
        	'title' => 'Ancres'
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
	                ->addTrueFalse('automatic_anchor_name', [
	                	'label' => 'Automatiser le nom de l\'ancre ? (Dans l\'URL)',
		                'default_value' => 1
	                ])
	                ->addText('anchor_name', [
	                	'label' => 'Nom de l\'ancre',
		                'instructions' => 'Le texte va automatiquement être transformé pour être adapté à l\'url'
	                ])
	                    ->conditional('automatic_anchor_name', '==', '0')
			        ->addTrueFalse('different_content_title', [
				        'label' => 'Titre du contenu différent ?',
				        'instructions' => 'Permet d\'utiliser un titre différent',
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
	                ->addFlexibleContent('content', [
	                	'required' => true,
		                'label' => 'Contenu',
		                'button_label' => 'Ajouter un contenu'
	                ])
	                    ->addLayout('text', [
	                    	'title' => 'Texte'
	                    ])
					        ->addWysiwyg('text', [
						        'required' => true,
						        'label' => 'Texte'
					        ])
	                    ->addLayout($this->get(Video::class))
	                ->endFlexibleContent()
	            ->endRepeater()
	        ->endRepeater();
        //@formatter:on

return $anchorBlock;
