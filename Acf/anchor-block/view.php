<?php
	$slugify = new \Cocur\Slugify\Slugify();
	$blocks = get_sub_field('blocks');
?>

<div class="anchorBlock">
	<div class="anchorBlock__links" aria-hidden="true">
		<ul>
			<?php foreach ($blocks as $block): ?>
				<?php $numberOfBlocks = count($block['inner_block']); ?>
				<li>
					<?php foreach ($block['inner_block'] as $index => $innerBlock): ?>
						<?php
						$title = strip_tags($innerBlock['title']);

						// Wrap "?" in a span to avoid it wrapping alone
						if (preg_match('/\?$/', $title)) {
							$title = rtrim(preg_replace('/\?$/', '', $title));
							$title .= '<span>?</span>';
						}
						?>
						<?php if ($index === 0): ?>
							<a href="#<?php echo $slugify->slugify(strip_tags($innerBlock['title'])); ?>"><?php echo $title; ?></a>
						<?php endif; ?>
						<?php if ($numberOfBlocks > 1 && $index === 1): ?>
							<ul>
						<?php endif; ?>
						<?php if ($index > 0): ?>
							<li>
								<a href="#<?php echo $slugify->slugify(strip_tags($innerBlock['title'])); ?>"><?php echo $title; ?></a>
							</li>
						<?php endif; ?>
						<?php if ($numberOfBlocks > 1 && ($index === ($numberOfBlocks - 1))): ?>
							</ul>
						<?php endif; ?>
					<?php endforeach; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
    <div class="anchorBlock__border"></div>
	<div class="anchorBlock__content">
		<?php foreach ($blocks as $block): ?>
			<div class="anchorBlock__content__block">
				<?php foreach ($block['inner_block'] as $innerBlock): ?>
					<div id="<?php echo $slugify->slugify(strip_tags($innerBlock['title'])); ?>" class="anchorBlock__content__block__inner applyStyles">
						<?php echo $innerBlock['title']; ?>
						<?php echo $innerBlock['text']; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
