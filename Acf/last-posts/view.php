<?php

$category = get_sub_field('category');
$titleTag = get_sub_field('title_tag');
$allPosts = get_sub_field('all_posts');

$posts = new \App\Posts\Posts($category[0]);
$posts
	->setNumbers(3)
	->setTemplate(\App\Helpers::postTemplate($titleTag));
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
