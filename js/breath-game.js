// js/breath-game.js - Breath & Flow Sun Salutation Game
// Visual breath orb + timed transitions for classic Surya Namaskar sequence

let breathPhase = 0; // 0 to 1 for animation cycle
let animationFrame = null;
let gameState = {
  running: false,
  currentIndex: 0,
  score: 0,
  posesCompleted: 0
};

// Classic Sun Salutation A sequence (simplified 12 steps for game)
const sunSalSequence = [
  { name: "Mountain Pose", sanskrit: "Tadasana", breath: "inhale", cue: "Root down, lengthen spine" },
  { name: "Raised Arms", sanskrit: "Urdhva Hastasana", breath: "inhale", cue: "Reach up, lift heart" },
  { name: "Standing Forward Fold", sanskrit: "Uttanasana", breath: "exhale", cue: "Fold forward, release head" },
  { name: "Half Lift", sanskrit: "Ardha Uttanasana", breath: "inhale", cue: "Lift halfway, flat back" },
  { name: "Plank / Chaturanga", sanskrit: "Chaturanga Dandasana", breath: "exhale", cue: "Step or jump back, lower" },
  { name: "Upward Dog", sanskrit: "Urdhva Mukha Svanasana", breath: "inhale", cue: "Press up, open chest" },
  { name: "Downward Dog", sanskrit: "Adho Mukha Svanasana", breath: "exhale", cue: "Lift hips, lengthen spine" },
  { name: "Half Lift (return)", sanskrit: "Ardha Uttanasana", breath: "inhale", cue: "Step forward, lift chest" },
  { name: "Forward Fold", sanskrit: "Uttanasana", breath: "exhale", cue: "Fold deeply, relax" },
  { name: "Raised Arms", sanskrit: "Urdhva Hastasana", breath: "inhale", cue: "Rise with arms up" },
  { name: "Mountain Pose", sanskrit: "Tadasana", breath: "exhale", cue: "Return to center, ground" },
  { name: "Final Rest (Savasana prep)", sanskrit: "Savasana", breath: "inhale/exhale", cue: "Rest and integrate" }
];

let breathInterval = null;
let lastTime = 0;

const BREATH_CYCLE_MS = 5200; // ~5.2s full cycle (inhale + exhale) - adjustable

const TOLERANCE_WINDOW = 0.18; // How forgiving the click timing is (0-1 phase)

function initBreathGame() {
  const canvas = document.getElementById('breath-canvas');
  if (!canvas) return;
  
  // Initial neutral draw
  drawBreathCircle(0.5);
  
  // Reset UI
  document.getElementById('breath-points').textContent = '0';
  document.getElementById('poses-done').textContent = '0';
  document.getElementById('current-pose').innerHTML = 'Ready to begin your flow...';
  document.getElementById('transition-btn').disabled = true;
  
  // Render sequence pills
  renderSequence();
  
  // Click canvas to transition as alternative
  canvas.onclick = () => {
    if (gameState.running) handleTransition();
  };
}

function renderSequence() {
  const container = document.getElementById('sequence-display');
  container.innerHTML = '';
  
  sunSalSequence.forEach((step, idx) => {
    const pill = document.createElement('div');
    pill.className = 'sequence-step';
    pill.textContent = `${idx + 1}. ${step.name}`;
    if (idx === gameState.currentIndex && gameState.running) {
      pill.classList.add('active');
    }
    container.appendChild(pill);
  });
}

function drawBreathCircle(phase) {
  const canvas = document.getElementById('breath-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const baseRadius = 85;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background subtle ring
  ctx.strokeStyle = '#e8e0d0';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius + 12, 0, Math.PI * 2);
  ctx.stroke();
  
  // Main breath orb - scale with phase (sinusoidal for smooth breathing feel)
  const scale = 0.65 + Math.sin(phase * Math.PI * 2) * 0.35; // nice organic pulse
  const radius = baseRadius * scale;
  
  // Gradient fill for orb
  const grad = ctx.createRadialGradient(cx - 25, cy - 25, 20, cx, cy, radius + 20);
  grad.addColorStop(0, '#a8d5a2');
  grad.addColorStop(0.6, '#6fa86a');
  grad.addColorStop(1, '#4a7043');
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Subtle highlight
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(cx - 28, cy - 28, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  
  // Breath label
  ctx.fillStyle = '#2c3e2d';
  ctx.font = 'bold 15px system-ui';
  ctx.textAlign = 'center';
  const label = phase < 0.5 ? 'INHALE' : 'EXHALE';
  ctx.fillText(label, cx, cy + 8);
  
  // Small center dot
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
}

function animateBreath(timestamp = 0) {
  if (!gameState.running) return;
  
  if (!lastTime) lastTime = timestamp;
  const elapsed = timestamp - lastTime;
  
  // Calculate phase (0-1) over the breath cycle
  breathPhase = (elapsed % BREATH_CYCLE_MS) / BREATH_CYCLE_MS;
  
  drawBreathCircle(breathPhase);
  
  // Update current pose instruction occasionally
  updateCurrentPoseUI();
  
  animationFrame = requestAnimationFrame(animateBreath);
}

function updateCurrentPoseUI() {
  const step = sunSalSequence[gameState.currentIndex];
  if (!step) return;
  
  const el = document.getElementById('current-pose');
  const breathLabel = step.breath === 'inhale' ? '🌬️ Inhale' : step.breath === 'exhale' ? '🌬️ Exhale' : '🌬️ Breathe';
  
  el.innerHTML = `
    <span style="font-size:1.05rem;">${step.name}</span><br>
    <span style="font-size:0.95rem; color:#666;">${step.sanskrit} • ${breathLabel}</span><br>
    <span style="font-size:0.85rem; font-style:italic; color:#555;">${step.cue}</span>
  `;
}

function startBreathGame() {
  // Reset everything
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (breathInterval) clearInterval(breathInterval);
  
  gameState = {
    running: true,
    currentIndex: 0,
    score: 0,
    posesCompleted: 0
  };
  
  breathPhase = 0;
  lastTime = 0;
  
  document.getElementById('breath-points').textContent = '0';
  document.getElementById('poses-done').textContent = '0';
  document.getElementById('transition-btn').disabled = false;
  
  renderSequence();
  updateCurrentPoseUI();
  
  // Start animation loop
  animationFrame = requestAnimationFrame(animateBreath);
  
  // Optional: auto-advance demo hint after first few seconds (comment out for production)
  // setTimeout(() => { if (gameState.running && gameState.currentIndex === 0) { /* hint */ } }, 6000);
}

function handleTransition() {
  if (!gameState.running) return;
  
  const step = sunSalSequence[gameState.currentIndex];
  if (!step) return;
  
  const btn = document.getElementById('transition-btn');
  
  // Determine if click was at good timing
  // Good window: near end of current breath phase (phase ~0.45-0.55 or end of cycle)
  const isGoodTiming = (breathPhase > 0.82 || breathPhase < 0.18) || 
                       (Math.abs(breathPhase - 0.5) < TOLERANCE_WINDOW);
  
  let pointsThisStep = 10; // base
  
  if (isGoodTiming) {
    pointsThisStep = 18; // bonus for good timing
    // Visual feedback
    const canvas = document.getElementById('breath-canvas');
    if (canvas) {
      canvas.style.boxShadow = '0 0 0 12px rgba(201, 162, 39, 0.4)';
      setTimeout(() => { if (canvas) canvas.style.boxShadow = 'inset 0 0 30px rgba(0,0,0,0.05)'; }, 420);
    }
  } else {
    pointsThisStep = 6; // partial credit
  }
  
  gameState.score += pointsThisStep;
  gameState.posesCompleted++;
  
  document.getElementById('breath-points').textContent = gameState.score;
  document.getElementById('poses-done').textContent = gameState.posesCompleted;
  
  // Advance to next pose
  gameState.currentIndex++;
  
  if (gameState.currentIndex >= sunSalSequence.length) {
    // Finished!
    endBreathGame();
  } else {
    renderSequence();
    updateCurrentPoseUI();
    
    // Brief pause between poses (simulates natural hold)
    btn.disabled = true;
    setTimeout(() => {
      if (gameState.running) btn.disabled = false;
    }, 650);
  }
}

function endBreathGame() {
  gameState.running = false;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  
  const finalScore = gameState.score;
  const maxScore = sunSalSequence.length * 18;
  const percent = Math.round((finalScore / maxScore) * 100);
  
  const el = document.getElementById('current-pose');
  el.innerHTML = `<strong>Flow Complete! 🌟</strong><br>Final Score: ${finalScore} pts (${percent}%)<br><span style="font-size:0.9rem;">Beautiful work syncing breath and movement.</span>`;
  
  document.getElementById('transition-btn').disabled = true;
  
  // Celebrate good scores
  if (percent >= 75) {
    setTimeout(() => launchConfetti(), 650);
    setTimeout(() => {
      alert(`Excellent flow! You scored ${percent}%. Your breath awareness is strong. 🙏`);
    }, 1200);
  } else {
    setTimeout(() => {
      alert(`Great practice! Score: ${percent}%. Keep playing to improve your timing and breath connection.`);
    }, 900);
  }
  
  // Allow restart
  document.getElementById('transition-btn').textContent = 'Play Again';
  document.getElementById('transition-btn').onclick = () => {
    document.getElementById('transition-btn').textContent = 'Transition Pose';
    document.getElementById('transition-btn').onclick = handleTransition;
    startBreathGame();
  };
}

// Expose for main.js
window.initBreathGame = initBreathGame;
window.startBreathGame = startBreathGame;