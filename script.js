(function() {
    const video = document.getElementById('wildlifeVideo');
    const wrapper = document.getElementById('videoWrapper');
    const toggleBtn = document.getElementById('toggleBtn');
    const btnIcon = document.getElementById('btnIcon');
    const btnLabel = document.getElementById('btnLabel');

    // State tracking
    let isVideoVisible = true;      // wrapper visible?
    let wasPlayingBeforeHide = false; // used to resume play on show

    // Helper to update button text/icon based on state
    function updateButton() {
        if (isVideoVisible) {
            if (video.paused) {
                btnIcon.textContent = '▶️';
                btnLabel.textContent = 'Hide & Play';
            } else {
                btnIcon.textContent = '⏸️';
                btnLabel.textContent = 'Hide & Pause';
            }
            toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
            btnIcon.textContent = '▶️';
            btnLabel.textContent = 'Show & Play';
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // Toggle function: hides the video OR plays it if not playing
    function handleToggle() {
        if (isVideoVisible) {
            // 1. If video is playing, pause it and remember that it was playing
            if (!video.paused) {
                video.pause();
                wasPlayingBeforeHide = true;
            } else {
                wasPlayingBeforeHide = false;
            }

            // 2. Hide the wrapper
            wrapper.classList.add('hidden-video');
            isVideoVisible = false;

            // 3. Update button
            updateButton();

        } else {
            // 1. Show the wrapper
            wrapper.classList.remove('hidden-video');
            isVideoVisible = true;

            // 2. If it was playing before hide OR if user expects play, play it.
            //    But we want to "plays it if it is not playing already" – 
            //    since it was hidden, it's paused, so we play.
            //    We'll also respect wasPlayingBeforeHide to resume.
            if (video.paused) {
                // play it (if not playing already)
                video.play().catch(err => {
                    // autoplay may be blocked by browser; we ignore
                    console.warn('Playback could not start:', err);
                });
            }
            updateButton();
        }
    }

    // Button click
    toggleBtn.addEventListener('click', handleToggle);

    // When video is manually played/paused, update button text
    video.addEventListener('play', () => {
        if (isVideoVisible) {
            btnIcon.textContent = '⏸️';
            btnLabel.textContent = 'Hide & Pause';
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    });

    video.addEventListener('pause', () => {
        if (isVideoVisible) {
            btnIcon.textContent = '▶️';
            btnLabel.textContent = 'Hide & Play';
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    });

    // If video ends, reset button to "Hide & Play"
    video.addEventListener('ended', () => {
        if (isVideoVisible) {
            btnIcon.textContent = '▶️';
            btnLabel.textContent = 'Hide & Play';
        }
    });
    video.addEventListener('error', () => {
        // fallback: keep button functional
        console.warn('Video failed to load. Toggle still works.');
    });

    updateButton();

    wrapper.classList.remove('hidden-video');
    isVideoVisible = true;
    updateButton();

})();
