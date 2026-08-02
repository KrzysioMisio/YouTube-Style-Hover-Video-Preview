<main class="video-grid video-grid-home" id="video-grid">
	<?php foreach ($videos as $video) { ?>
	<a href="<?php echo $global['url']; ?>video-<?php echo $video['id']; ?>" class="video-card js-hover-card">
		<div class="video-thumbnail-wrapper" data-video-src="<?php echo $global['url'] . 'uploads/videos/' . htmlspecialchars($video['url_video'] ?? ''); ?>">
			<img src="<?php echo $global['url'] . 'uploads/videos/posters/' . htmlspecialchars($video['image'] ?? 'default_video.jpg'); ?>" alt="" />
			<button type="button" class="video-mute-btn ignore_link">
				<i class="fa-solid fa-volume-xmark"></i>
			</button>
			<div class="video-progress-bar ignore_link">
				<div class="video-time-tooltip">0:00</div>
				<div class="video-progress-fill"></div>
			</div>
			<div class="video-play-overlay">
				<div class="video-play-icon">
					<i class="fa-solid fa-play" style="margin-left: 3px;"></i>
				</div>
			</div>
		</div>
		<div class="video-info-box">
		  <div class="video-meta-box">
        <span><i class="fas fa-folder"></i> <?php echo htmlspecialchars($video['category_name'] ?? ''); ?></span>
        <span><i class="fa fa-eye"></i> <?php echo $video['click']; ?></span>
      </div>
      <?php if (!empty($video['title'])) { ?>
        <h2 class="video-card-grid-title"><?php echo lengthCharacter(htmlspecialchars($video['title']), 80); ?></h2>
      <?php } else { ?>
        <h2 class="video-card-grid-title"><?php echo lengthCharacter(htmlspecialchars($video['description']), 80); ?></h2>
      <?php } ?>
    </div>
   </a>

<?php } ?>
	</main>
