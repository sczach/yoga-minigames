// js/pose-match.js - Pose Match Learning Game
// Data: 6 common yoga poses with placeholders. Replace images with real yoga photos/illustrations later.

const poses = [
  {
    id: 1,
    name: "Mountain Pose",
    sanskrit: "Tadasana",
    desc: "Foundation of all standing poses. Improves posture and focus.",
    breath: "Inhale to lengthen spine",
    img: "https://picsum.photos/id/1011/300/200" // placeholder - mountain / standing
  },
  {
    id: 2,
    name: "Downward-Facing Dog",
    sanskrit: "Adho Mukha Svanasana",
    desc: "Full-body stretch. Calms the mind and energizes the body.",
    breath: "Exhale to fold and lengthen",
    img: "https://picsum.photos/id/1005/300/200" // placeholder
  },
  {
    id: 3,
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    desc: "Builds strength, stability, and confidence in the legs and core.",
    breath: "Inhale to open chest and arms",
    img: "https://picsum.photos/id/1033/300/200"
  },
  {
    id: 4,
    name: "Tree Pose",
    sanskrit: "Vrksasana",
    desc: "Improves balance, focus, and strengthens the standing leg.",
    breath: "Inhale to root and rise",
    img: "https://picsum.photos/id/106/300/200"
  },
  {
    id: 5,
    name: "Child's Pose",
    sanskrit: "Balasana",
    desc: "Gentle resting pose. Relieves stress and gently stretches the back.",
    breath: "Exhale to surrender and rest",
    img: "https://picsum.photos/id/201/300/200"
  },
  {
    id: 6,
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    desc: "Opens the chest and strengthens the spine. Heart-opening backbend.",
    breath: "Inhale to lift and open heart",
    img: "https://picsum.photos/id/160/300/200"
  }
];

let selectedImage = null;
let selectedText = null;
let matches = 0;
let matchedIds = new Set();

function initPoseMatch() {
  const imageGrid = document.getElementById('image-grid');
  const textGrid = document.getElementById('text-grid');
  
  // Reset state
  imageGrid.innerHTML = '';
  textGrid.innerHTML = '';
  matches = 0;
  matchedIds = new Set();
  selectedImage = null;
  selectedText = null;
  
  document.getElementById('pose-matches').textContent = '0';
  
  // Shuffle for replayability
  const shuffledPoses = [...poses].sort(() => Math.random() - 0.5);
  
  // Render image cards
  shuffledPoses.forEach(pose => {
    const card = document.createElement('div');
    card.className = 'pose-card';
    card.dataset.id = pose.id;
    card.innerHTML = `
      <img src="${pose.img}" alt="${pose.name} yoga pose" loading="lazy">
      <div class="label">${pose.name}</div>
    `;
    card.onclick = () => handleImageClick(card, pose);
    imageGrid.appendChild(card);
  });

  // Render text cards (shuffled independently for challenge)
  const shuffledText = [...poses].sort(() => Math.random() - 0.5);
  shuffledText.forEach(pose => {
    const card = document.createElement('div');
    card.className = 'text-card';
    card.dataset.id = pose.id;
    card.innerHTML = `
      <strong>${pose.name}</strong><br>
      <span style="font-size:0.85rem; color:#666;">${pose.sanskrit}</span><br>
      <span style="font-size:0.85rem;">${pose.desc}</span>
      <div style="margin-top:0.4rem; font-size:0.8rem; color:var(--accent); font-style:italic;">${pose.breath}</div>
    `;
    card.onclick = () => handleTextClick(card, pose);
    textGrid.appendChild(card);
  });
}

function handleImageClick(card, pose) {
  if (matchedIds.has(pose.id)) return;
  
  // Deselect previous
  document.querySelectorAll('#image-grid .pose-card').forEach(c => c.classList.remove('selected'));
  
  card.classList.add('selected');
  selectedImage = { card, pose };
  
  checkForMatch();
}

function handleTextClick(card, pose) {
  if (matchedIds.has(pose.id)) return;
  
  document.querySelectorAll('#text-grid .text-card').forEach(c => c.classList.remove('selected'));
  
  card.classList.add('selected');
  selectedText = { card, pose };
  
  checkForMatch();
}

function checkForMatch() {
  if (!selectedImage || !selectedText) return;
  
  const imgId = parseInt(selectedImage.card.dataset.id);
  const txtId = parseInt(selectedText.card.dataset.id);
  
  if (imgId === txtId) {
    // MATCH!
    selectedImage.card.classList.add('matched');
    selectedText.card.classList.add('matched');
    selectedImage.card.classList.remove('selected');
    selectedText.card.classList.remove('selected');
    
    matchedIds.add(imgId);
    matches++;
    
    document.getElementById('pose-matches').textContent = matches;
    
    // Clear selection
    selectedImage = null;
    selectedText = null;
    
    // Win condition
    if (matches === poses.length) {
      setTimeout(() => {
        alert('🎉 Excellent! You matched all poses. Great job building your yoga knowledge!');
        launchConfetti();
      }, 400);
    }
  } else {
    // No match - brief feedback then reset selection
    setTimeout(() => {
      if (selectedImage) selectedImage.card.classList.remove('selected');
      if (selectedText) selectedText.card.classList.remove('selected');
      selectedImage = null;
      selectedText = null;
    }, 650);
  }
}

function resetPoseMatch() {
  initPoseMatch();
}

// Make init available globally for main.js
window.initPoseMatch = initPoseMatch;