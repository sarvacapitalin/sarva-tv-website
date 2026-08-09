/*
  Sarva TV - Interactive Website Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Navbar Scroll Handler
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isFlex = navLinks.style.display === 'flex';
      navLinks.style.display = isFlex ? 'none' : 'flex';
      if (!isFlex) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(6, 8, 13, 0.95)';
        navLinks.style.padding = '20px';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
      }
    });
  }

  // Showcase Tabs Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabMobile = document.getElementById('tab-mobile');
  const tabTv = document.getElementById('tab-tv');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'mobile') {
        tabMobile.style.display = 'block';
        tabTv.style.display = 'none';
      } else if (targetTab === 'tv') {
        tabMobile.style.display = 'none';
        tabTv.style.display = 'block';
      }
    });
  });

  // FAQ Accordion Toggles
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});

// Lightbox Functions
function openLightbox(imgUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imgUrl;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}
