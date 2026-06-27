const stage = document.querySelector('.stage');
const audio = document.getElementById('bg-audio');

const sequence = [
  { type: 'title', text: 'Happy Birthday Mummy', charDelay: 120, holdAfter: 2000 },
  { type: 'image', src: 'IMG-20251012-WA0025.jpg', holdDuration: 3000 },
  { type: 'words', lines: ['We may not always show it the way we should.'], charDelay: 60, holdAfter: 2000 },
  { type: 'image', src: 'IMG-20251012-WA0050.jpg', holdDuration: 3000 },
  { type: 'words', lines: ['But we love you more than words can hold.'], charDelay: 60, holdAfter: 2000 },
  { type: 'image', src: 'IMG-20251012-WA0061.jpg', holdDuration: 3000 },
  {
    type: 'words',
    lines: [
      'Thank you for every sacrifice you made quietly.',
      'Every prayer you said when no one was watching.',
      'Every time you held it together so we did not have to.'
    ],
    charDelay: 60,
    holdAfter: 3000
  },
  { type: 'image', src: 'FB_IMG_1782534687060 (1).jpg', holdDuration: 3000 },
  { type: 'image', src: 'Screenshot_20221205-045423.jpg', holdDuration: 3000 },
  { type: 'words', lines: ['You are the reason this family stands.', 'The strength behind everything we are.'], charDelay: 60, holdAfter: 2000 },
  { type: 'image', src: 'IMG-20251012-WA0061.jpg', holdDuration: 3000 },
  { type: 'words', lines: ['We see you, Mummy.', 'We appreciate you.', 'We are proud to be yours.'], charDelay: 60, holdAfter: 3000 },
  { type: 'image', src: 'FB_IMG_1782534687060.jpg', holdDuration: 3000 },
  { type: 'closing' },
  { type: 'blackout' }
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fadeIn(element, duration) {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease`;
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
  await wait(duration);
}

async function fadeOut(element, duration) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '0';
  await wait(duration);
  element.remove();
}

async function typeText(element, text, charDelay) {
  element.textContent = '';

  for (let i = 0; i < text.length; i += 1) {
    element.textContent += text.charAt(i);
    await wait(charDelay);
  }
}

async function showImage(src, holdDuration) {
  stage.innerHTML = '';
  const frame = document.createElement('div');
  frame.className = 'image-shell';

  const image = document.createElement('img');
  image.src = src;
  image.alt = '';
  frame.appendChild(image);

  stage.appendChild(frame);
  const fadePromise = fadeIn(frame, 1500);
  await fadePromise;
  await wait(holdDuration);
  await fadeOut(frame, 1000);
}

async function showWords(lines, charDelay, holdAfter) {
  stage.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'display-text';
  stage.appendChild(container);

  const warmLines = [
    'But we love you more than words can hold.',
    'Thank you for every sacrifice you made quietly.',
    'You are the reason this family stands.',
    'We see you, Mummy.',
    'We are proud to be yours.'
  ];

  const fadePromise = fadeIn(container, 1000);

  for (let i = 0; i < lines.length; i += 1) {
    const line = document.createElement('div');
    line.className = 'word-line';
    if (warmLines.includes(lines[i])) {
      line.classList.add('warm-text');
    }
    container.appendChild(line);
    await typeText(line, lines[i], charDelay);

    if (i < lines.length - 1) {
      await wait(500);
    }
  }

  await fadePromise;
  await wait(holdAfter);
  await fadeOut(container, 1000);
}

async function showTitle(text, charDelay, holdAfter) {
  stage.innerHTML = '';
  const title = document.createElement('h1');
  title.className = 'opening-title';
  stage.appendChild(title);

  const fadePromise = fadeIn(title, 2000);
  await typeText(title, text, charDelay);
  await fadePromise;
  launchConfetti(confettiCount);
  await wait(holdAfter);
  await fadeOut(title, 1000);
}

async function showClosing() {
  stage.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'closing-stack';
  stage.appendChild(stack);

  const line = document.createElement('div');
  line.className = 'closing-from';
  stack.appendChild(line);

  const fadePromise = fadeIn(stack, 2000);
  await typeText(line, 'With love from your children', 80);
  await wait(1000);

  const names = document.createElement('div');
  names.className = 'closing-names';
  stack.appendChild(names);

  const people = ['Dan', 'Tof', 'Dav'];
  const separators = ['·', '·'];

  for (let i = 0; i < people.length; i += 1) {
    const name = document.createElement('span');
    name.className = 'closing-name';
    name.textContent = people[i];
    name.style.animation = 'nameReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards';
    name.style.animationDelay = `${i * 600}ms`;
    names.appendChild(name);

    if (i < people.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'closing-separator';
      separator.textContent = separators[i];
      separator.style.animation = 'nameReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards';
      separator.style.animationDelay = `${i * 600 + 100}ms`;
      names.appendChild(separator);
    }
  }

  await fadePromise;
  await wait(4000);
  launchConfetti(confettiCount);
  await fadeOut(stack, 1000);
}

async function fadeToBlack() {
  stopHearts();
  stage.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.className = 'blackout-overlay';
  stage.appendChild(overlay);
  await fadeIn(overlay, 3000);
}

async function runSequence() {
  startHearts();
  for (const phase of sequence) {
    if (phase.type === 'title') {
      await showTitle(phase.text, phase.charDelay, phase.holdAfter);
    } else if (phase.type === 'image') {
      await showImage(phase.src, phase.holdDuration);
    } else if (phase.type === 'words') {
      await showWords(phase.lines, phase.charDelay, phase.holdAfter);
    } else if (phase.type === 'closing') {
      await showClosing();
    } else if (phase.type === 'blackout') {
      await fadeToBlack();
    }
  }
}

let heartInterval;
const isSmallScreen = window.innerWidth < 400;
const heartSpawnRate = isSmallScreen ? 900 : 600;
const confettiCount = isSmallScreen ? 35 : 60;

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');

  const size = Math.random() * 18 + 10;
  const left = Math.random() * 100;
  const duration = Math.random() * 6 + 8;
  const delay = Math.random() * 3;
  const opacity = Math.random() * 0.4 + 0.2;

  const heartColors = ['#ff6b8a', '#ff9eb5', '#ffb3c6', '#ff8fab', '#ffc2d1'];
  heart.style.cssText = `
    left: ${left}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${opacity};
    color: ${heartColors[Math.floor(Math.random() * heartColors.length)]};
  `;

  document.getElementById('hearts-layer').appendChild(heart);
  setTimeout(() => heart.remove(), (duration + delay) * 1000);
}

function startHearts() {
  heartInterval = setInterval(createHeart, heartSpawnRate);
}

function stopHearts() {
  clearInterval(heartInterval);
}

function launchConfetti(count = 60) {
  const layer = document.getElementById('confetti-layer');
  const colors = ['#ff6b8a', '#ffcf88', '#e8c97a', '#ff9eb5', '#fff8f0', '#ffb347'];

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    const size = Math.random() * 8 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 1.5;
    const rotation = Math.random() * 360;
    const isCircle = Math.random() > 0.5;

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${isCircle ? size : size * 2.5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${isCircle ? '50%' : '2px'};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      transform: rotate(${rotation}deg);
    `;

    layer.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 500);
  }
}

async function startExperience() {
  audio.muted = true;
  const unlock = async () => {
    try {
      audio.muted = false;
      await audio.play();
    } catch (err) {
      audio.muted = true;
      try {
        await audio.play();
      } catch (playErr) {
        // Ignored; the experience still proceeds.
      }
    }

    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };

  try {
    await audio.play();
    audio.muted = false;
  } catch (error) {
    document.addEventListener('touchstart', unlock, { once: true, passive: true });
    document.addEventListener('click', unlock, { once: true, passive: true });
    document.addEventListener('pointerdown', unlock, { once: true, passive: true });
    document.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  runSequence();
}

window.addEventListener('load', startExperience);
