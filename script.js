
document.addEventListener('DOMContentLoaded', () => {
	let hoverTimeout = null;
	let animFrameId = null;

	function formatTime(seconds) {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}

	function stopAllHoverVideos() {
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}

		if (animFrameId) {
			cancelAnimationFrame(animFrameId);
			animFrameId = null;
		}

		document.querySelectorAll('.hover-video-preview').forEach(video => {
			if (video.hlsInstance) {
				video.hlsInstance.destroy();
				video.hlsInstance = null;
			}
			video.pause();
			video.removeAttribute('src');
			video.load();
			video.remove();
		});

		document.querySelectorAll('.video-progress-fill').forEach(bar => {
			bar.style.transform = 'scaleX(0)';
		});

		document.querySelectorAll('.video-mute-btn').forEach(btn => {
			const icon = btn.querySelector('i');
			if (icon) icon.className = 'fa-solid fa-volume-xmark';
			btn.setAttribute('title', 'Włącz dźwięk');
		});
	}

	function startProgressLoop(video, progressFill) {
		function update() {
      	if (video && video.duration && !video.paused) {
         	const progress = video.currentTime / video.duration;
            progressFill.style.transform = `scaleX(${progress})`;
         }
         animFrameId = requestAnimationFrame(update);
		}
		update();
	}

	function seekVideo(e, progressBar) {
		const wrapper = progressBar.closest('.video-thumbnail-wrapper');
		const video = wrapper ? wrapper.querySelector('video') : null;
		if (!video || !video.duration) return;

		const rect = progressBar.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const width = rect.width;
		const percentage = Math.max(0, Math.min(1, clickX / width));

		video.currentTime = percentage * video.duration;

		const progressFill = progressBar.querySelector('.video-progress-fill');
		if (progressFill) {
			progressFill.style.transform = `scaleX(${percentage})`;
		}
	}

	function updateTooltip(e, progressBar) {
		const wrapper = progressBar.closest('.video-thumbnail-wrapper');
		const video = wrapper ? wrapper.querySelector('video') : null;
		const tooltip = progressBar.querySelector('.video-time-tooltip');

		if (!video || !video.duration || !tooltip) return;

		const rect = progressBar.getBoundingClientRect();
		const hoverX = e.clientX - rect.left;
		const width = rect.width;
		const percentage = Math.max(0, Math.min(1, hoverX / width));

		const targetTime = percentage * video.duration;
		tooltip.textContent = formatTime(targetTime);

		const tooltipWidth = tooltip.offsetWidth;
		let leftPosition = hoverX;

		if (leftPosition < tooltipWidth / 2) {
			leftPosition = tooltipWidth / 2;
		} else if (leftPosition > width - tooltipWidth / 2) {
			leftPosition = width - tooltipWidth / 2;
		}

		tooltip.style.left = `${leftPosition}px`;
	}

	document.body.addEventListener('mouseover', (e) => {
		const card = e.target.closest('.js-hover-card');
		if (!card) return;

		const wrapper = card.querySelector('.video-thumbnail-wrapper');
		if (!wrapper) return;

		const videoSrc = wrapper.getAttribute('data-video-src');
		if (!videoSrc) return;

		if (wrapper.querySelector('video')) return;

		stopAllHoverVideos();

		hoverTimeout = setTimeout(() => {
			const videoElement = document.createElement('video');
			videoElement.className = 'hover-video-preview';
			videoElement.muted = true;
			videoElement.loop = true;
			videoElement.playsInline = true;
			videoElement.preload = 'auto';

			if (videoSrc.includes('.m3u8')) {
				if (typeof Hls !== 'undefined' && Hls.isSupported()) {
					const hls = new Hls({ enableWorker: false });
					hls.loadSource(videoSrc);
					hls.attachMedia(videoElement);
					videoElement.hlsInstance = hls;
				} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
					videoElement.src = videoSrc;
				}
			} else {
				const source = document.createElement('source');
				source.src = videoSrc;
				source.type = 'video/mp4';
				videoElement.appendChild(source);
			}

			wrapper.appendChild(videoElement);

			const progressFill = wrapper.querySelector('.video-progress-fill');
			const playPromise = videoElement.play();
			if (playPromise !== undefined) {
				playPromise.then(() => {
					videoElement.classList.add('is-playing');
					if (progressFill) {
						startProgressLoop(videoElement, progressFill);
					}
				}).catch(err => {
					if (videoElement.hlsInstance) {
						videoElement.hlsInstance.destroy();
					}
					videoElement.remove();
				});
			}
		}, 500);
	});

	document.body.addEventListener('mousemove', (e) => {
		const progressBar = e.target.closest('.video-progress-bar');
		if (progressBar) {
			updateTooltip(e, progressBar);
		}
	});

	document.body.addEventListener('mouseout', (e) => {
		const card = e.target.closest('.js-hover-card');
		if (!card) return;

		if (!card.contains(e.relatedTarget)) {
			stopAllHoverVideos();
		}
	});

	document.body.addEventListener('click', (e) => {
		const muteBtn = e.target.closest('.video-mute-btn');
		const progressBar = e.target.closest('.video-progress-bar');

		if (progressBar) {
			e.preventDefault();
			e.stopPropagation();
			seekVideo(e, progressBar);
			return;
		}

		if (muteBtn) {
			e.preventDefault();
			e.stopPropagation();
			const wrapper = muteBtn.closest('.video-thumbnail-wrapper');
			const video = wrapper ? wrapper.querySelector('video') : null;
			const icon = muteBtn.querySelector('i');

			if (video) {
				video.muted = !video.muted;
				if (video.muted) {
					icon.className = 'fa-solid fa-volume-xmark';
					muteBtn.setAttribute('title', 'Włącz dźwięk');
				} else {
					icon.className = 'fa-solid fa-volume-high';
					muteBtn.setAttribute('title', 'Wyłącz dźwięk');
				}
			}
			return;
		}

		if (e.target.closest('.js-hover-card')) {
			stopAllHoverVideos();
		}
	});
});
