document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initContactForm();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/**
 * Scroll Spy - Active navigation highlight based on section scroll position
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * Stats Counter Animation (Runs when the dashboard section is visible)
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseFloat(target.getAttribute('data-val'));
        animateCounter(target, targetValue);
        observer.unobserve(target); // Animate only once
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element, targetVal) {
  const isFloat = targetVal % 1 !== 0;
  const duration = 1200; // ms
  const frameRate = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    const currentVal = targetVal * easeProgress;

    if (isFloat) {
      element.textContent = currentVal.toFixed(2);
    } else {
      element.textContent = Math.floor(currentVal);
    }

    if (frame >= totalFrames) {
      clearInterval(timer);
      if (isFloat) {
        element.textContent = targetVal.toFixed(2);
      } else {
        element.textContent = targetVal;
      }
    }
  }, frameRate);
}

/**
 * Contact Form Mock Submission with Toast
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  
  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    console.log('Form Submitted:', { name, email, message });

    // Show dynamic success toast
    toast.textContent = `Thanks ${name}! Your message has been sent.`;
    toast.classList.add('show');

    // Reset Form
    form.reset();

    // Hide Toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  });
}
