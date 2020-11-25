<?php

$slugify = new \Cocur\Slugify\Slugify();
$blocks = get_sub_field('blocks');

?>

<?php if (have_rows('blocks')): ?>
    <div class="anchorBlock">
        <div class="anchorBlock__links" aria-hidden="true">
            <ul>
				<?php foreach ($blocks as $block): ?>
					<?php $numberOfBlocks = count($block['inner_block']); ?>
                    <li>
						<?php foreach ($block['inner_block'] as $index => $innerBlock): ?>
							<?php
							$slug = (!$innerBlock['automatic_anchor_name'] ? strip_tags($innerBlock['anchor_name']) : strip_tags($innerBlock['title']));
							$title = strip_tags($innerBlock['title']);

							// Wrap "?" in a span to avoid it wrapping alone
							if (preg_match('/\?$/', $title)) {
								$title = rtrim(preg_replace('/\?$/', '', $title));
								$title .= '<span>?</span>';
							}
							?>
							<?php if ($index === 0): ?>
                                <a href="#<?php echo $slugify->slugify($slug); ?>"><?php echo $title; ?></a>
							<?php endif; ?>
							<?php if ($numberOfBlocks > 1 && $index === 1): ?>
                                <ul>
							<?php endif; ?>
							<?php if ($index > 0): ?>
                                <li>
                                    <a href="#<?php echo $slugify->slugify($slug); ?>"><?php echo $title; ?></a>
                                </li>
							<?php endif; ?>
							<?php if ($numberOfBlocks > 1 && ($index === ($numberOfBlocks - 1))): ?>
                                </ul>
							<?php endif; ?>
						<?php endforeach; ?>
                    </li>
				<?php endforeach; ?>
            </ul>
            <div class="anchorBlock__links__line"></div>
        </div>
        <div class="anchorBlock__content">
			<?php while (have_rows('blocks')): the_row(); ?>
                <div class="anchorBlock__content__block">
					<?php while (have_rows('inner_block')): the_row(); ?>
						<?php
						//@formatter:off
                        $slug = (!get_sub_field('automatic_anchor_name') ? strip_tags(get_sub_field('anchor_name')) : strip_tags(get_sub_field('title')));
                        //@formatter:on
						?>
                        <div id="<?php echo $slugify->slugify($slug); ?>" class="anchorBlock__content__block__inner applyStyles">
							<?php echo !get_sub_field('different_content_title') ? get_sub_field('title') : get_sub_field('content_title'); ?>
							<?php if (have_rows('content')): ?>
								<?php while (have_rows('content')): the_row(); ?>
									<?php if (get_row_layout() === 'text'): ?>
										<?php echo get_sub_field('text'); ?>
									<?php else: ?>
										<?php get_template_part('resources/views/' . str_replace('_', '-', get_row_layout())); ?>
									<?php endif; ?>
								<?php endwhile; ?>
							<?php endif; ?>
                        </div>
					<?php endwhile; ?>
                </div>
			<?php endwhile; ?>
        </div>
    </div>
<?php endif; ?>
