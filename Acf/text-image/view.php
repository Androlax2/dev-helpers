<?php
$imagePosition = get_sub_field('image_position');
$imageWidth = get_sub_field('image_width');
$image = get_sub_field('image');
$title = get_sub_field('title');
$text = get_sub_field('text');
?>

<div class="textImage textImage--<?php echo $imagePosition; ?>">
	<div class="container">
		<div class="textImage__image" style="width: <?php echo $imageWidth; ?>">
			<?php echo wp_get_attachment_image($image['ID'], 'full'); ?>
		</div>
		<div class="textImage__text applyStyles">
			<?php echo $title; ?>
			<?php echo $text; ?>
		</div>
	</div>
</div>
