// Elements
const can1 = document.getElementById('can-apricot');
const can2 = document.getElementById('can-purple');
const can3 = document.getElementById('can-blue');
const can4 = document.getElementById('can-arctic');
const can5 = document.getElementById('can-vanilla');

const text1 = document.getElementById('info-s1');
const text2 = document.getElementById('info-s2');
const text3 = document.getElementById('info-s3');
const text4 = document.getElementById('info-s4');
const text5 = document.getElementById('info-s5');

const bg1 = document.getElementById('bg-s1');
const bg2 = document.getElementById('bg-s2');
const bg3 = document.getElementById('bg-s3');
const bg4 = document.getElementById('bg-s4');
const bg5 = document.getElementById('bg-s5');
const bgF = document.getElementById('bg-final');

const dropletsContainer = document.getElementById('droplets-container');

// --- DROPLETS GENERATION ---
const dropletCount = 25;
const droplets = [];

// Create droplets
for (let i = 0; i < dropletCount; i++) {
  const el = document.createElement('div');
  el.classList.add('droplet');

  // Random Properties
  const size = Math.random() * 20 + 5;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  const depth = Math.random() * 0.5 + 0.5;

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${left}%`;
  el.style.top = `${top}%`;
  el.style.animationDelay = `${delay}s`;

  dropletsContainer.appendChild(el);

  droplets.push({
    element: el,
    baseTop: top,
    depth: depth
  });
}

// Map Helper
const map = (val, inMin, inMax, outMin, outMax) => {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

// Scroll Loop
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const p = scrollY / vh;

  requestAnimationFrame(() => update(p, scrollY));
});

function update(p, scrollY) {
  // --- DROPLET PARALLAX ---
  droplets.forEach(d => {
    const movement = scrollY * 0.2 * d.depth;
    d.element.style.transform = `translateY(${-movement}px)`;

    // Final fade out (>5)
    if (p > 5) {
      d.element.style.opacity = Math.max(0, 1 - (p - 5) * 2);
    } else {
      d.element.style.opacity = 0.8;
    }
  });

  // --- MAIN SCROLL LOGIC ---
  const offsetH = window.innerHeight * 1.2;

  // Init vars for 5 cans
  let c1y = offsetH, c1op = 0, c1rot = 0;
  let c2y = offsetH, c2op = 0, c2rot = 0;
  let c3y = offsetH, c3op = 0, c3rot = 0;
  let c4y = offsetH, c4op = 0, c4rot = 0;
  let c5y = offsetH, c5op = 0, c5rot = 0;

  // Set default hidden positions for inactive cans
  // Ideally defaults are set above, logic below overrides active ones.

  // Active Text/BG Logic
  // Reset all actives
  [text1, text2, text3, text4, text5, bg1, bg2, bg3, bg4, bg5, bgF].forEach(e => {
    if (e) e.classList.remove('active');
  });

  // --- PHASE 1: 0 -> 1 (Apricot) ---
  if (p < 1) {
    text1.classList.add('active');
    bg1.classList.add('active');
    document.body.style.backgroundColor = "#ffecd2"; // Soft Apricot

    c1y = 0;
    c1rot = map(p, 0, 1, 0, -5);
    c1op = 1;
  }

  // --- PHASE 2: 1 -> 2 (Apricot Up, Purple In) ---
  else if (p >= 1 && p < 2) {
    text2.classList.add('active');
    bg2.classList.add('active');
    document.body.style.backgroundColor = "#e0c3fc"; // Soft Purple

    const localP = p - 1;

    c1y = map(localP, 0, 1, 0, -offsetH);
    c1op = map(localP, 0, 0.5, 1, 0);

    c2y = map(localP, 0, 1, offsetH, 0);
    c2op = 1;
    c2rot = map(localP, 0, 1, 10, 0);
  }

  // --- PHASE 3: 2 -> 3 (Purple Up, Blue In) ---
  else if (p >= 2 && p < 3) {
    text3.classList.add('active');
    bg3.classList.add('active');
    document.body.style.backgroundColor = "#d4fcff"; // Soft Blue

    const localP = p - 2;

    c1y = -offsetH; c1op = 0; // Gone

    c2y = map(localP, 0, 1, 0, -offsetH);
    c2op = map(localP, 0, 0.5, 1, 0);

    c3y = map(localP, 0, 1, offsetH, 0);
    c3op = 1;
    c3rot = map(localP, 0, 1, 10, 0);
  }

  // --- PHASE 4: 3 -> 4 (Blue Up, Arctic/White In) ---
  else if (p >= 3 && p < 4) {
    text4.classList.add('active');
    bg4.classList.add('active');
    document.body.style.backgroundColor = "#e0f7fa"; // Icy Cyan

    const localP = p - 3;

    c2y = -offsetH; c2op = 0;

    c3y = map(localP, 0, 1, 0, -offsetH);
    c3op = map(localP, 0, 0.5, 1, 0);

    c4y = map(localP, 0, 1, offsetH, 0);
    c4op = 1;
    c4rot = map(localP, 0, 1, 10, 0);
  }

  // --- PHASE 5: 4 -> 5 (Arctic Up, Vanilla/Cyan In) ---
  else if (p >= 4 && p < 5) {
    text5.classList.add('active');
    bg5.classList.add('active');
    document.body.style.backgroundColor = "#f0f4f8"; // Cool Gray/Blue

    const localP = p - 4;

    c3y = -offsetH; c3op = 0;

    c4y = map(localP, 0, 1, 0, -offsetH);
    c4op = map(localP, 0, 0.5, 1, 0);

    c5y = map(localP, 0, 1, offsetH, 0);
    c5op = 1;
    c5rot = map(localP, 0, 1, 10, 0);
  }

  // --- FINAL: 5+ (All Stack) ---
  else {
    bgF.classList.add('active');
    document.body.style.backgroundColor = "#ffffff"; // Clean White

    const localP = Math.min(p - 5, 1);

    // Stack 5 cans vertically: -440, -220, 0, +220, +440
    c1y = map(localP, 0, 1, -offsetH, -440); c1op = 1;
    c2y = map(localP, 0, 1, -offsetH, -220); c2op = 1;
    c3y = map(localP, 0, 1, -offsetH, 0); c3op = 1;
    c4y = map(localP, 0, 1, -offsetH, 220); c4op = 1;
    c5y = map(localP, 0, 1, 0, 440); c5op = 1;

    c1rot = 0; c2rot = 0; c3rot = 0; c4rot = 0; c5rot = 0;
  }

  // Apply
  if (can1) { can1.style.transform = `translate(-50%, calc(-50% + ${c1y}px)) rotate(${c1rot}deg)`; can1.style.opacity = c1op; }
  if (can2) { can2.style.transform = `translate(-50%, calc(-50% + ${c2y}px)) rotate(${c2rot}deg)`; can2.style.opacity = c2op; }
  if (can3) { can3.style.transform = `translate(-50%, calc(-50% + ${c3y}px)) rotate(${c3rot}deg)`; can3.style.opacity = c3op; }
  if (can4) { can4.style.transform = `translate(-50%, calc(-50% + ${c4y}px)) rotate(${c4rot}deg)`; can4.style.opacity = c4op; }
  if (can5) { can5.style.transform = `translate(-50%, calc(-50% + ${c5y}px)) rotate(${c5rot}deg)`; can5.style.opacity = c5op; }
}

update(0, 0);
