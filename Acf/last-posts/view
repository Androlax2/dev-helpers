<?php

$category = get_sub_field('category');
$titleTag = get_sub_field('title_tag');
$allPosts = get_sub_field('all_posts');

$posts = new \App\Posts\Posts($category[0]);
$posts
	->setNumbers(3)
	->setTemplate('
			<article class="post">
				<a href="{%LINK%}">
					<div class="post__thumbnail">
						{%THUMBNAIL%}
					</div>
					<div class="post__content">
						<div class="post__meta">
							<p class="post__category">{%CATEGORY%}</p>
							<p class="post__date">{%DATE%}</p>
						</div>
						<' . $titleTag . ' class="post__title">{%TITLE%}</' . $titleTag . '>
						<p class="post__excerpt">{%EXCERPT%}</p>
					</div>
				</a>
			</article>
		');
?>

<div class="lastPosts">
	<div class="lastPosts__inner">
		<?php echo $posts->all(); ?>
	</div>
	<?php if ($allPosts): ?>
		<div class="lastPosts__all">

		</div>
	<?php endif; ?>
</div>
