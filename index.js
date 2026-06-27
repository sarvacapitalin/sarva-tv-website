// Sarva TV - IPTV Player Website Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when link is clicked
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- Sticky Header Scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Interactive Simulator Logic ---
  const simSteps = document.querySelectorAll('.sim-step');
  const mockScreens = document.querySelectorAll('.mock-app');

  simSteps.forEach(step => {
    step.addEventListener('click', () => {
      // Deactivate all steps
      simSteps.forEach(s => s.classList.remove('active'));
      // Activate clicked step
      step.classList.add('active');

      // Get target screen
      const screenId = step.getAttribute('data-screen');
      
      // Hide all mockup screens
      mockScreens.forEach(screen => {
        screen.classList.remove('active');
      });

      // Show selected screen
      const targetScreen = document.getElementById(screenId);
      if (targetScreen) {
        targetScreen.classList.add('active');
      }
    });
  });

  // --- Live Sandbox HLS Player Logic ---
  const video = document.getElementById('sandbox-video');
  const playBtn = document.getElementById('btn-play');
  const muteBtn = document.getElementById('btn-mute');
  const ratioBtn = document.getElementById('btn-ratio');
  const streamInput = document.getElementById('stream-url-input');
  const loadBtn = document.getElementById('btn-load-stream');
  const loader = document.getElementById('sandbox-loader');
  const errorMsg = document.getElementById('sandbox-error-msg');
  const presetBtns = document.querySelectorAll('.preset-btn');
  
  let hlsInstance = null;

  // HLS stream presets
  const demoStreams = {
    test: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    bbb: 'https://playertest.longtailvideo.com/adaptive/bipbop/bipbop.m3u8',
    apple: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8'
  };

  // Helper to destroy existing HLS instance
  function resetHls() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  }

  // Load stream logic
  function loadStream(url) {
    if (!url) return;

    resetHls();
    errorMsg.style.display = 'none';
    loader.classList.remove('hidden');

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true
      });
      
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        loader.classList.add('hidden');
        video.play().catch(() => {
          // Auto-play was prevented, update play/pause UI button
          updatePlayButtonState(true);
        });
        updatePlayButtonState(false);
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          loader.classList.add('hidden');
          errorMsg.textContent = 'Failed to load stream. Please ensure the URL is online, supports CORS, and is a valid HLS/M3U8 link.';
          errorMsg.style.display = 'block';
          resetHls();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS (Safari/iOS)
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        loader.classList.add('hidden');
        video.play().catch(() => {
          updatePlayButtonState(true);
        });
        updatePlayButtonState(false);
      });

      video.addEventListener('error', () => {
        loader.classList.add('hidden');
        errorMsg.textContent = 'Failed to load stream. Ensure URL is online and valid.';
        errorMsg.style.display = 'block';
      });
    } else {
      loader.classList.add('hidden');
      errorMsg.textContent = 'Your browser does not support HLS playback natively or via Hls.js.';
      errorMsg.style.display = 'block';
    }
  }

  // Play/Pause button state
  function updatePlayButtonState(isPaused) {
    if (playBtn) {
      const icon = playBtn.querySelector('i');
      if (icon) {
        if (isPaused) {
          icon.setAttribute('data-lucide', 'play');
        } else {
          icon.setAttribute('data-lucide', 'pause');
        }
        lucide.createIcons();
      }
    }
  }

  // Play/Pause toggle
  if (playBtn && video) {
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play()
          .then(() => updatePlayButtonState(false))
          .catch(() => {});
      } else {
        video.pause();
        updatePlayButtonState(true);
      }
    });
  }

  // Mute/Unmute toggle
  if (muteBtn && video) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      const icon = muteBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', video.muted ? 'volume-x' : 'volume-2');
        lucide.createIcons();
      }
    });
  }

  // Aspect Ratio change
  let currentFit = 'contain';
  if (ratioBtn && video) {
    ratioBtn.addEventListener('click', () => {
      if (currentFit === 'contain') {
        video.style.objectFit = 'fill';
        currentFit = 'fill';
        ratioBtn.title = 'Aspect Ratio: Fill';
      } else if (currentFit === 'fill') {
        video.style.objectFit = 'cover';
        currentFit = 'cover';
        ratioBtn.title = 'Aspect Ratio: Zoom';
      } else {
        video.style.objectFit = 'contain';
        currentFit = 'contain';
        ratioBtn.title = 'Aspect Ratio: Fit';
      }
    });
  }

  // Load Stream Input Trigger
  if (loadBtn && streamInput) {
    loadBtn.addEventListener('click', () => {
      const url = streamInput.value.trim();
      if (url) {
        // Deactivate active preset button colors
        presetBtns.forEach(btn => btn.classList.remove('active'));
        loadStream(url);
      }
    });

    streamInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = streamInput.value.trim();
        if (url) {
          presetBtns.forEach(btn => btn.classList.remove('active'));
          loadStream(url);
        }
      }
    });
  }

  // Presets trigger
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-preset');
      const url = demoStreams[key];
      if (url) {
        streamInput.value = url;
        loadStream(url);
      }
    });
  });

  // Load initial demo stream on first load (without auto-starting audio)
  if (video) {
    video.muted = true;
    const firstPreset = document.querySelector('.preset-btn[data-preset="test"]');
    if (firstPreset) {
      firstPreset.classList.add('active');
      streamInput.value = demoStreams.test;
      loadStream(demoStreams.test);
    }
  }
});
