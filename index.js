// ============================================================
// script.js — All interactivity for the NEXT landing page
// ============================================================


// ---- 1. SMOOTH SCROLL to features section ----
// Called when the "Get Started" button is clicked (set in HTML via onclick)

function scrollToFeatures() {
  const section = document.getElementById('features');
  section.scrollIntoView({ behavior: 'smooth' });
}

// ---- 3. SCROLL-IN ANIMATION for feature cards ----
// Uses IntersectionObserver — a modern browser API that watches when
// elements enter the visible screen area (the "viewport").

const cards = document.querySelectorAll('.feature-card');

// Start all cards invisible and slightly shifted down
cards.forEach(function (card) {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Create an observer that watches each card
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Card entered the screen — fade it in
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 }); // trigger when 20% of the card is visible

// Attach the observer to every feature card
cards.forEach(function (card) {
  observer.observe(card);
});