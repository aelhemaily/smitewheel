const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultBox = document.getElementById('result-box');
const wheelContainer = document.getElementById('wheel-container');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const godsContainer = document.getElementById('gods-container');
const allGodsText = document.getElementById('all-gods-text');
const rerollBtn = document.getElementById('reroll-btn');
const goBackBtn = document.getElementById('go-back-btn');


let size;
let center;
let radius;

const segments = [
  "Space Program",
  "Circle Comp",
  "Stealth Squad",
  "Build a Wall",
  "Holly Heal",
  "Team Taunt",
  "Arena Assault",
  "Placeholder"
];

const colors = [
  '#d25252',
  '#7f4ba5',
  '#3bb2c9',
  '#d28735',
  '#cc4a9f',
  '#39a361',
  '#d9bb36',
  '#182866'
];

const numSegments = segments.length;
const arc = (2 * Math.PI) / numSegments;

let currentAngle = 0;
let isSpinning = false;
let hoveredSegmentIndex = -1; 

const godData = {
  "Team Taunt": ["Athena", "Danzaburou", "Erlang Shen", "Serqet", "Raijin"],
  "Holly Heal": ["Aphrodite", "Artio", "Baron Samedi", "Chang'e", "Chiron", "Cthulhu", "Cupid", "Eset", "Guan Yu", "Hades", "Hel", "Horus", "Ix Chel", "Olorun", "Ra", "Shiva", "Sylvanus", "Terra", "Yemoja"],
  "Build a Wall": ["Anhur", "Terra", "Thor", "Ymir", "Cabrakan", "Maui", "Odin", "Yemoja"],
  "Space Program": ["Ao Kuang", "Heimdallr", "Janus", "Kumbhakarna", "Ne Zha", "The Morrigan"],
  "Circle Comp": ["Anubis", "Agni", "Atlas", "Bakasura", "Bake Kujira", "Chaac", "Cthulhu", "Cupid", "Eset", "Gilgamesh", "Hades", "Hou Yi", "Hun Batz", "Nox", "Persephone", "Poseidon", "Sobek", "Sylvanus", "Tyr", "Xing Tian", "Ymir", "Zeus", "Zhong Kui"],
  "Stealth Squad": ["Ao Kuang", "Cliodhna", "Discordia", "Izanami", "Jormungandr", "Loki", "Martichoras", "Nu Wa", "Serqet", "The Morrigan"],
  "Arena Assault": "ADVANCED_RANDOM",
  "Placeholder": ["Achilles", "Artemis", "Baron Samedi"]
};

let allGods = [];

const embeddedGodlistContent = `Achilles: Warrior
Agni: Mage
Ah Muzen Cab: Hunter
Ah Puch: Mage
Amaterasu: Warrior
Anhur: Hunter
Anubis: Mage
Ao Kuang: Mage
Aphrodite: Mage
Apollo: Hunter
Arachne: Assassin
Ares: Guardian
Artemis: Hunter
Artio: Guardian
Athena: Guardian
Atlas: Guardian
Awilix: Assassin
Baba Yaga: Mage
Bacchus: Guardian
Bakasura: Assassin
Bake Kujira: Guardian
Baron Samedi: Mage
Bastet: Assassin
Bellona: Warrior
Cabrakan: Guardian
Camazotz: Assassin
Cerberus: Guardian
Cernunnos: Hunter
Chaac: Warrior
Chang'e: Mage
Charon: Guardian
Charybdis: Hunter
Chernobog: Hunter
Chiron: Hunter
Chronos: Mage
Cliodhna: Assassin
Cthulhu: Guardian
Cu Chulainn: Warrior
Cupid: Hunter
Da Ji: Assassin
Danzaburou: Hunter
Discordia: Mage
Erlang Shen: Warrior
Eset: Mage
Fafnir: Guardian
Fenrir: Assassin
Freya: Mage
Ganesha: Guardian
Geb: Guardian
Gilgamesh: Warrior
Guan Yu: Warrior
Hachiman: Hunter
Hades: Mage
He Bo: Mage
Heimdallr: Hunter
Hel: Mage
Hera: Mage
Hercules: Warrior
Horus: Warrior
Hou Yi: Hunter
Hun Batz: Assassin
Ishtar: Hunter
Ix Chel: Mage
Izanami: Hunter
Janus: Mage
Jing Wei: Hunter
Jormungandr: Guardian
Kali: Assassin
Khepri: Guardian
King Arthur: Warrior
Kukulkan: Mage
Kumbhakarna: Guardian
Kuzenbo: Guardian
Lancelot: Assassin
Loki: Assassin
Maman Brigitte: Mage
Martichoras: Hunter
Maui: Guardian
Medusa: Hunter
Mercury: Assassin
Merlin: Mage
Morgan Le Fay: Mage
Mulan: Warrior
Ne Zha: Assassin
Neith: Hunter
Nemesis: Assassin
Nike: Warrior
Nox: Mage
Nu Wa: Mage
Nut: Hunter
Odin: Warrior
Olorun: Mage
Osiris: Warrior
Pele: Assassin
Persephone: Mage
Poseidon: Mage
Ra: Mage
Raijin: Mage
Rama: Hunter
Ratatoskr: Assassin
Ravana: Assassin
`;

let currentArenaAssaultGods = [];
const MAX_REROLLS_PER_GOD = 2;

let forcedSpinSegmentIndex = -1;

let draggedItemIndex = -1;


function resizeCanvasAndDraw() {
  size = Math.min(wheelContainer.clientWidth, wheelContainer.clientHeight);
  canvas.width = size;
  canvas.height = size;

  center = size / 2;
  radius = Math.max(0, center - 8);

  drawWheel();
}

function drawWheel() {
  if (radius <= 0) {
    ctx.clearRect(0, 0, size, size);
    return;
  }

  ctx.clearRect(0, 0, size, size);

  for(let i = 0; i < numSegments; i++) {
    ctx.beginPath();
    ctx.moveTo(center, center);

   
    if (i === hoveredSegmentIndex) {
      ctx.fillStyle = colors[i]; 
      ctx.shadowColor = '#fff'; 
      ctx.shadowBlur = 15; 
    } else {
      ctx.fillStyle = colors[i];
      ctx.shadowBlur = 0; 
    }

    ctx.strokeStyle = '#190918';
    ctx.lineWidth = 4;

    const startAngle = currentAngle + i * arc;
    const endAngle = startAngle + arc;

    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.lineTo(center, center);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);

    const text = segments[i];
    let segmentMidAngle = startAngle + arc / 2;

    while (segmentMidAngle < 0) segmentMidAngle += 2 * Math.PI;
    while (segmentMidAngle >= 2 * Math.PI) segmentMidAngle -= 2 * Math.PI;

    ctx.fillStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = "bold 22px Orbitron, sans-serif";
    ctx.textBaseline = "middle";
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 0; 

    if (isSpinning) {
      ctx.rotate(segmentMidAngle);
      ctx.textAlign = "right";
      ctx.strokeText(text, radius - 28, 0);
      ctx.fillText(text, radius - 28, 0);
    } else {
      if (segmentMidAngle > Math.PI / 2 && segmentMidAngle < 3 * Math.PI / 2) {
        ctx.rotate(segmentMidAngle + Math.PI);
        ctx.textAlign = "left";
        ctx.strokeText(text, -(radius - 28), 0);
        ctx.fillText(text, -(radius - 28), 0);
      } else {
        ctx.rotate(segmentMidAngle);
        ctx.textAlign = "right";
        ctx.strokeText(text, radius - 28, 0);
        ctx.fillText(text, radius - 28, 0);
      }
    }
    ctx.restore();
  }

  
  ctx.beginPath();
  ctx.arc(center, center, 70, 0, 2 * Math.PI);
  ctx.fillStyle = '#2c0038';
  ctx.shadowColor = '#a04fbc';
  ctx.shadowBlur = 22;
  ctx.fill();
  ctx.shadowBlur = 0;

  
  ctx.fillStyle = '#f45a5a';
  ctx.font = 'bold 30px Orbitron, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SMOTE', center, center);
}

/**
 
 * @param {string} hex 
 * @param {number} percent
 * @returns {string} 
 */
function lightenColor(hex, percent) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, r + (255 - r) * percent / 100);
    g = Math.min(255, g + (255 - g) * percent / 100);
    b = Math.min(255, b + (255 - b) * percent / 100);

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spin() {
  if (isSpinning || radius <= 0) return;

  hideGodsMenu();

  isSpinning = true;
  spinBtn.disabled = true;
  hoveredSegmentIndex = -1; 
  drawWheel(); 
  resultBox.textContent = 'Spinning...';

  const rotations = Math.floor(Math.random() * 3) + 5;
  const chosenIndex = (forcedSpinSegmentIndex !== -1) ? forcedSpinSegmentIndex : Math.floor(Math.random() * numSegments);

  const pointerAngle = 3 * Math.PI / 2;
  const targetAngle = (2 * Math.PI * rotations) + pointerAngle - (chosenIndex * arc) - (arc / 2);

  const startAngle = currentAngle;
  const totalRotation = targetAngle - startAngle;
  const duration = 8000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    currentAngle = startAngle + totalRotation * easedProgress;
    currentAngle %= (2 * Math.PI);
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      const landedSegment = segments[chosenIndex];
      resultBox.innerHTML = `Landed on: ${landedSegment}<br><span class="instruction-text">Or click wheel tiles to check comps!</span>`;
      drawWheel();
      showGodsMenu(landedSegment);
      forcedSpinSegmentIndex = -1;
    }
  }
  requestAnimationFrame(animate);
}

/**
 * 
 * @param {MouseEvent} event - The click event object.
 */
function handleCanvasClick(event) {
  if (isSpinning) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const adjustedX = clickX - center;
  const adjustedY = clickY - center;

  const distance = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY);

  if (distance > radius || distance < 70) {
    return;
  }

  let clickAngle = Math.atan2(adjustedY, adjustedX);

  if (clickAngle < 0) {
    clickAngle += 2 * Math.PI;
  }

  let unrotatedAngle = clickAngle - currentAngle;

  while (unrotatedAngle < 0) {
    unrotatedAngle += 2 * Math.PI;
  }
  while (unrotatedAngle >= 2 * Math.PI) {
    unrotatedAngle -= 2 * Math.PI;
  }

  const clickedSegmentIndex = Math.floor(unrotatedAngle / arc);

  if (clickedSegmentIndex >= 0 && clickedSegmentIndex < numSegments) {
    const clickedSegmentName = segments[clickedSegmentIndex];
    resultBox.innerHTML = `Clicked on: ${clickedSegmentName}<br><span class="instruction-text">Or click wheel tiles to check comps!</span>`;
    showGodsMenu(clickedSegmentName);
  }
}

/**
 * 
 * @param {MouseEvent} event - The mouse event object.
 */
function handleCanvasMouseMove(event) {
  if (isSpinning) {
      if (hoveredSegmentIndex !== -1) { 
          hoveredSegmentIndex = -1;
          drawWheel();
      }
      return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const adjustedX = mouseX - center;
  const adjustedY = mouseY - center;

  const distance = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY);

  let newHoveredIndex = -1;
  
  if (distance <= radius && distance >= 70) {
    let mouseAngle = Math.atan2(adjustedY, adjustedX);
    if (mouseAngle < 0) {
      mouseAngle += 2 * Math.PI;
    }

    let unrotatedMouseAngle = mouseAngle - currentAngle;
    while (unrotatedMouseAngle < 0) {
      unrotatedMouseAngle += 2 * Math.PI;
    }
    while (unrotatedMouseAngle >= 2 * Math.PI) {
      unrotatedMouseAngle -= 2 * Math.PI;
    }
    newHoveredIndex = Math.floor(unrotatedMouseAngle / arc);
  }

  if (newHoveredIndex !== hoveredSegmentIndex) {
    hoveredSegmentIndex = newHoveredIndex;
    drawWheel(); 
  }
}

/**
 * 
 * @param {MouseEvent} event - The mouse event object.
 */
function handleCanvasMouseLeave() {
  if (hoveredSegmentIndex !== -1) {
    hoveredSegmentIndex = -1;
    drawWheel(); 
  }
}


function showGodsMenu(segmentName) {
  modalTitle.textContent = segmentName.toUpperCase();
  godsContainer.innerHTML = '';
  allGodsText.style.display = 'none';

  const gods = godData[segmentName];

  if (gods === "ADVANCED_RANDOM") {
      if (allGods.length === 0) {
          godsContainer.style.display = 'block';
          godsContainer.innerHTML = '<p style="color: #ccc; font-size: 1.1rem;">God data not loaded. Please try again.</p>';
          modalOverlay.classList.add('visible');
          return;
      }
      currentArenaAssaultGods = getRandomArenaAssaultGods();
      showArenaAssaultGods(currentArenaAssaultGods);
      godsContainer.style.display = 'grid';
  } else if (Array.isArray(gods) && gods.length > 0) {
    godsContainer.style.display = 'grid';
    gods.forEach(god => {
      const godItem = document.createElement('div');
      godItem.classList.add('god-item');

      const img = document.createElement('img');
      img.src = `./images/${getGodImageFilename(god)}`;
      img.alt = god;
      img.onerror = function() {
          this.src = `https://placehold.co/80x80/360c55/e9dbff?text=${god.charAt(0)}`;
          this.alt = `Image not found for ${god}`;
      };

      const nameSpan = document.createElement('span');
      nameSpan.textContent = god;

      godItem.appendChild(img);
      godItem.appendChild(nameSpan);
      godsContainer.appendChild(godItem);
    });
  } else {
      godsContainer.style.display = 'block';
      godsContainer.innerHTML = '<p style="color: #ccc; font-size: 1.1rem;">Could not generate a team adhering to rules.</p>';
  }

  modalOverlay.classList.add('visible');
}

function hideGodsMenu() {
  modalOverlay.classList.remove('visible');
  modalTitle.textContent = '';
  godsContainer.innerHTML = '';
  allGodsText.style.display = 'none';
}

function handleDragStart(e) {
    const draggedElement = e.target.closest('.god-item');
    if (!draggedElement) return;

    draggedItemIndex = parseInt(draggedElement.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedItemIndex);
    draggedElement.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const targetElement = e.target.closest('.god-item');
    if (targetElement && targetElement !== e.target.closest('.dragging')) {
        Array.from(godsContainer.children).forEach(item => item.classList.remove('drag-over'));
        targetElement.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const targetElement = e.target.closest('.god-item');
    if (targetElement) {
        targetElement.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropTargetElement = e.target.closest('.god-item');
    if (!dropTargetElement) return;

    const dropTargetIndex = parseInt(dropTargetElement.dataset.index);

    Array.from(godsContainer.children).forEach(item => item.classList.remove('drag-over'));

    if (draggedItemIndex !== -1 && draggedItemIndex !== dropTargetIndex) {
        const god1 = currentArenaAssaultGods[draggedItemIndex];
        const god2 = currentArenaAssaultGods[dropTargetIndex];

        const tempName = god1.name;
        const tempClass = god1.class;

        god1.name = god2.name;
        god1.class = god2.class;

        god2.name = tempName;
        god2.class = tempClass;

        showArenaAssaultGods(currentArenaAssaultGods);
    }
}

function handleDragEnd(e) {
    Array.from(godsContainer.children).forEach(item => {
        item.classList.remove('dragging');
        item.classList.remove('drag-over');
    });
    draggedItemIndex = -1;
}


function setNextSpinSegment(segmentName) {
  if (segmentName === null) {
    forcedSpinSegmentIndex = -1;
    console.log("Forced spin segment disabled.");
    return;
  }
  const index = segments.indexOf(segmentName);
  if (index !== -1) {
    forcedSpinSegmentIndex = index;
    console.log(`Spin will land on: ${segmentName}`);
  } else {
    console.warn(`Segment "${segmentName}" not found. Spin will be random.`);
    forcedSpinSegmentIndex = -1;
  }
}

function getGodImageFilename(godName) {
  return godName.toLowerCase().replace(/ /g, '').replace(/'/g, '') + '.png';
}

function loadGodList() {
  try {
    const lines = embeddedGodlistContent.split('\n').filter(line => line.trim() !== '');

    allGods = lines.map(line => {
      const parts = line.split(':');
      const name = parts[0].trim();
      const className = parts[1].trim();
      return { name, class: className };
    });
    console.log('God list loaded:', allGods);
  } catch (error) {
    console.error('Error parsing embedded god list:', error);
    resultBox.innerHTML = 'Error loading god data!<br><span class="instruction-text">Or click wheel tiles to check comps!</span>';
  }
}

function getRandomArenaAssaultGods(excludedGods = []) {
  const selectedGods = [];
  const classCounts = {};
  const currentExcluded = new Set(excludedGods);

  let callableGods = JSON.parse(JSON.stringify(allGods)).filter(god => !currentExcluded.has(god.name));

  const getRandomGod = (pool, filterFn) => {
      const filteredPool = pool.filter(filterFn);
      if (filteredPool.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * filteredPool.length);
      return filteredPool[randomIndex];
  };

  const hollyHealGodNames = godData["Holly Heal"];
  let hollyHealAdded = false;
  let attempts = 0;
  const MAX_SELECTION_ATTEMPTS = 500;

  while (selectedGods.length < 5 && attempts < MAX_SELECTION_ATTEMPTS) {
      attempts++;
      let candidateGod = null;

      if (!hollyHealAdded) {
          candidateGod = getRandomGod(callableGods, god =>
              hollyHealGodNames.includes(god.name) && (classCounts[god.class] || 0) < 2
          );
          if (candidateGod) {
              hollyHealAdded = true;
          }
      }

      if (!candidateGod) {
          candidateGod = getRandomGod(callableGods, god =>
              (classCounts[god.class] || 0) < 2
          );
      }

      if (candidateGod) {
          callableGods = callableGods.filter(g => g.name !== candidateGod.name);
          currentExcluded.add(candidateGod.name);

          selectedGods.push({
              name: candidateGod.name,
              class: candidateGod.class,
              rerollsLeft: MAX_REROLLS_PER_GOD,
              previousRerolls: []
          });
          classCounts[candidateGod.class] = (classCounts[candidateGod.class] || 0) + 1;
      } else if (selectedGods.length < 5) {
          console.warn("Could not find a god respecting class limits. Attempting less strict pick if needed.");
          candidateGod = getRandomGod(allGods, god => !currentExcluded.has(god.name));
          if (candidateGod) {
               callableGods = callableGods.filter(g => g.name !== candidateGod.name);
               currentExcluded.add(candidateGod.name);
               selectedGods.push({
                  name: candidateGod.name,
                  class: candidateGod.class,
                  rerollsLeft: MAX_REROLLS_PER_GOD,
                  previousRerolls: []
               });
               classCounts[candidateGod.class] = (classCounts[candidateGod.class] || 0) + 1;
          } else {
              break;
          }
      }
  }

  if (selectedGods.length < 5) {
      console.warn(`Generated ${selectedGods.length} gods. Could not fill all 5 slots adhering to all rules.`);
  }

  return selectedGods;
}


function rerollGod(index) {
  if (index < 0 || index >= currentArenaAssaultGods.length) return;

  let godInSlot = currentArenaAssaultGods[index];
  if (godInSlot.rerollsLeft <= 0) return;

  godInSlot.rerollsLeft--;

  godInSlot.previousRerolls = godInSlot.previousRerolls || [];
  godInSlot.previousRerolls.push(godInSlot.name);

  const currentTeamGodNamesExcludingThisSlot = currentArenaAssaultGods
      .filter((_, i) => i !== index)
      .map(g => g.name);

  const allExcludedGodsForReroll = new Set([
      ...godInSlot.previousRerolls,
      ...currentTeamGodNamesExcludingThisSlot
  ]);

  let newGodCandidateName = null;
  let newGodCandidateClass = null;
  let attempts = 0;
  const MAX_REROLL_FIND_ATTEMPTS = 500;

  while (newGodCandidateName === null && attempts < MAX_REROLL_FIND_ATTEMPTS) {
      attempts++;
      const availableGodsForReroll = allGods.filter(god => !allExcludedGodsForReroll.has(god.name));

      if (availableGodsForReroll.length === 0) {
          console.warn("No new unique gods available for reroll under any class.");
          break;
      }

      const randomGodFromPool = availableGodsForReroll[Math.floor(Math.random() * availableGodsForReroll.length)];

      const tempClassCounts = {};
      currentArenaAssaultGods.forEach((g, i) => {
          if (i !== index) {
              tempClassCounts[g.class] = (tempClassCounts[g.class] || 0) + 1;
          }
      });
      tempClassCounts[randomGodFromPool.class] = (tempClassCounts[randomGodFromPool.class] || 0) + 1;

      if (tempClassCounts[randomGodFromPool.class] <= 2) {
          newGodCandidateName = randomGodFromPool.name;
          newGodCandidateClass = randomGodFromPool.class;
      }
  }

  if (newGodCandidateName) {
      godInSlot.name = newGodCandidateName;
      godInSlot.class = newGodCandidateClass;
      showArenaAssaultGods(currentArenaAssaultGods);
  } else {
      console.warn(`Could not find a suitable god to reroll for slot ${index} adhering to rules and uniqueness.`);
      const rerollButton = godsContainer.children[index]?.querySelector('.reroll-god-btn');
      if (rerollButton) rerollButton.disabled = true;
      showArenaAssaultGods(currentArenaAssaultGods);
  }
}


function showArenaAssaultGods(godsArray) {
  godsContainer.innerHTML = '';
  allGodsText.style.display = 'none';

  if (godsArray.length > 0) {
    godsContainer.style.display = 'grid';
    godsArray.forEach((god, index) => {
      const godItem = document.createElement('div');
      godItem.classList.add('god-item');
      godItem.setAttribute('draggable', 'true');
      godItem.dataset.index = index;

      const img = document.createElement('img');
      img.src = `./images/${getGodImageFilename(god.name)}`;
      img.alt = god.name;
      img.onerror = function() {
          this.src = `https://placehold.co/80x80/360c55/e9dbff?text=${god.name.charAt(0)}`;
          this.alt = `Image not found for ${god.name}`;
      };

      const nameSpan = document.createElement('span');
      nameSpan.textContent = god.name;

      const rerollButton = document.createElement('button');
      rerollButton.classList.add('reroll-god-btn');
      rerollButton.textContent = `Reroll (${god.rerollsLeft})`;
      rerollButton.disabled = god.rerollsLeft <= 0;
      rerollButton.addEventListener('click', () => rerollGod(index));


      godItem.appendChild(img);
      godItem.appendChild(nameSpan);
      godItem.appendChild(rerollButton);
      godsContainer.appendChild(godItem);
    });
  } else {
      godsContainer.style.display = 'block';
      godsContainer.innerHTML = '<p style="color: #ccc; font-size: 1.1rem;">Could not generate a team adhering to rules.</p>';
  }
}

window.onload = function() {
  resizeCanvasAndDraw();
  loadGodList();


  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('mouseleave', handleCanvasMouseLeave);

  godsContainer.addEventListener('dragstart', handleDragStart);
  godsContainer.addEventListener('dragover', handleDragOver);
  godsContainer.addEventListener('dragleave', handleDragLeave);
  godsContainer.addEventListener('drop', handleDrop);
  godsContainer.addEventListener('dragend', handleDragEnd);
};

window.addEventListener('resize', resizeCanvasAndDraw);
spinBtn.addEventListener('click', spin);
rerollBtn.addEventListener('click', spin);
goBackBtn.addEventListener('click', hideGodsMenu);

// setNextSpinSegment('Arena Assault'); 
