🚀  **YouTube-Style Hover Video Preview (Performance & UX Focused)**

📌 The Problem with Traditional Approaches

# Example headings

## Sample Section

Directly embedding multiple <video> tags into an HTML list (e.g., 20–30 video cards on a gallery page) heavily strains both the browser and the server. Browsers attempt to prefetch metadata and initial buffers for all video files simultaneously, leading to:

- Extremely high client-side RAM and CPU usage.
- Massive, unnecessary server bandwidth consumption.
- Noticeable page load and render-blocking delays.

💡 How This Solution Works

This script implements an On-Demand Loading architecture with aggressive memory cleanup and GPU hardware acceleration.
1. Lazy Instantiation (Debounced)

    The page initially loads only lightweight, static thumbnail images.

    The <video> element does not exist in the DOM on load.

    The script listens to the mouseover event on cards with a 120 ms debounce delay, preventing accidental video requests when users quickly sweep their mouse across the screen.

2. Aggressive Memory Management

    Only one video preview can exist and play at any given time across the entire page.

    When the mouse leaves the card (mouseout), the stopAllHoverVideos() function is triggered, which:

        Pauses playback (video.pause()).

        Destroys the HLS instance (hls.destroy()) if a .m3u8 stream is used.

        Clears the source (video.removeAttribute('src') and video.load()), forcing the browser to immediately release the buffer from RAM.

        Completely removes the <video> element from the DOM.

3. Dual Format Support: MP4 & HLS (.m3u8)

    Automatically detects the video format from the data-video-src attribute.

    For .m3u8 files, it dynamically hooks into HLS.js (or leverages native Safari support), allowing video chunks to load progressively in small, efficient segments (.ts).

4. High-Performance UI (60/120 FPS)

    Smooth Progress Bar: Instead of using the sluggish timeupdate event (which only fires 3–4 times per second), the progress bar is driven by a requestAnimationFrame() render loop.

    GPU Hardware Acceleration: Progress bar resizing utilizes transform: scaleX() instead of width, shifting layout calculations to the GPU and avoiding expensive browser reflows/layout shifts.

    Interactive Control: Includes mute/unmute toggles, a live time-tracking tooltip calculated dynamically from the cursor position, and click-to-seek functionality.

    Event Isolation: Uses e.stopPropagation() on UI controls (mute button, progress bar) to prevent unintended page loads or link redirections.
