// js/main.js - Shared hub navigation and utilities for Yoga Minigames

let currentGame = null;

function showGame(gameId) {
  // Hide all game containers and hub
  document.querySelectorAll('.game-container, #hub-section').forEach(el => {
    el.style.display = 'none';
  });

  if (gameId === 'hub') {
    document.getElementById('hub-section').style.display = 'block';
    currentGame = null;
    return;
  }

  const gameSection = document.getElementById(gameId);
  if (gameSection) {
    gameSection.style.display = 'block';
    currentGame = gameId;

    // Initialize specific game if needed
    if (gameId === 'pose-match' && typeof initPoseMatch === 'function') {
      // Only init if not already playing
      if (!document.getElementById('image-grid').hasChildNodes() || document.getElementById('pose-matches').textContent === '0') {
        initPoseMatch();
      }
    }
    
    if (gameId === 'breath-flow' && typeof initBreathGame === 'function') {
      // Auto-start or show ready state
      const canvas = document.getElementById('breath-canvas');
      if (canvas && !window.breathGameRunning) {
        // Show initial state
        drawBreathCircle(0.5); // neutral
      }
    }
  }
}

// Simple confetti for wins (fun touch)
function launchConfetti() {
  const colors = ['#4a7043', '#c9a227', '#7fa87a'];
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '-20px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.zIndex = '9999';
    particle.style.pointerEvents = 'none';
    document.body.appendChild(particle);

    const duration = Math.random() * 2500 + 1800;
    const angle = Math.random() * 80 - 40;
    
    particle.animate([
      { 
        transform: `translateY(0) rotate(0deg)`, 
        opacity: 1 
      },
      { 
        transform: `translateY(${window.innerHeight + 100}px) rotate(${angle * 3}deg)`, 
        opacity: 0 
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    }).onfinish = () => particle.remove();
  }
}

// Keyboard accessibility hint
console.log('%c[Yoga Minigames] Tip: Press "Escape" to return to hub from any game.', 'color:#888');
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentGame) {
    showGame('hub');
  }
});

// Initial load: show hub
window.onload = () => {
  document.getElementById('hub-section').style.display = 'block';
  // Optional: preload or show welcome toast
};