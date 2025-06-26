// Get DOM elements
const container = document.getElementById("hearts-container");
const audio = document.getElementById("music");
const starContainer = document.getElementById("stars-container");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const mainText = document.getElementById("main-title");

//Generate random stars
function createStars(amount = 120) {
  const starTypes = ["star-soft", "star-blueish", ""];

  for (let i = 0; i < amount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const randomType = starTypes[Math.floor(Math.random() * starTypes.length)];
    if(randomType) {
      star.classList.add(randomType)
    }

    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${1 + Math.random() * 2}s`;
    star.style.opacity = Math.random();

    starContainer.appendChild(star);
  }
}

//Generate shooting star
function createShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";

  const startX = Math.random() * window.innerWidth;  
  const startY = -10;

  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;

  starContainer.appendChild(star);

  star.animate([
    { transform: "translate(0, 0) rotate(-45deg)", opacity: 1 },
    { transform: "translate(-800px, 800px) rotate(-45deg)", opacity: 0 }
  ], {
    duration: 600,
    easing: "ease-out",
    fill: "forwards"
  });

  setTimeout(() => star.remove(), 700);
}

// Interval to launch shooting stars
let shootingStarInterval;

function startShootingStars() {
  const loop = () => {
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createShootingStar(i);
      }, i * 800);
    }

    const delay = Math.random() * 3000 + 3000; 
    setTimeout(loop, delay);
  };

  loop();
}

function stopShootingStars() {
  clearInterval(shootingStarInterval);
}

//Constellations lines
let constellationOpacity = 0.2;
let opacityDirection = 1;

const increment = 0.0005; 

function drawConstellations() {
  const canvas = document.getElementById("constellation-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = Array.from(document.querySelectorAll(".star"));

  const starPositions = stars.map(star => {
    const rect = star.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  });

  constellationOpacity += increment * opacityDirection;
  if (constellationOpacity >= 0.4) opacityDirection = -1;
  if (constellationOpacity <= 0.15) opacityDirection = 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const starColor = [160, 200, 255];
  const endColor = [190, 160, 255];

  const mixColor = starColor.map((c, i) =>
    Math.round(c + (endColor[i] + c) * ((constellationOpacity - 0.15) / 0.25))
  );

  const colorString = `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, ${constellationOpacity.toFixed(2)})`;

  ctx.strokeStyle = colorString;
  ctx.lineWidth = 0.6;
  ctx.shadowColor = `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, 0.7)`;
  ctx.shadowBlur = 4;

  const Maxconnections = 2;

  for (let i = 0; i < starPositions.length; i++) {
    const a = starPositions[i];
    let connections = 0;
    for (let j = 0; j < starPositions.length; j++) {
      if (i === j) continue;
      const b = starPositions[j];

      const inCornerA = a.x < canvas.width * 0.3 && a.y < canvas.height * 0.4;
      const inCornerB = b.x < canvas.width * 0.3 && b.y < canvas.height * 0.4;

      if (inCornerA && inCornerB) {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          connections++;
          if (connections >= Maxconnections) break;
        }
      }
    }
  }
}


window.addEventListener("load", () => {
  setTimeout(drawConstellations, 100)
});

window.addEventListener("resize", drawConstellations);

// Heart configuration
const totalHearts = 30;
const minSeparation = 8; // Minimum % of horizontal separation between hearts
const usedPositions = [];

// Generate a random horizontal position for a heart, ensuring spacing between them
function generatePosition() {
  let attempts = 0;
  while (attempts < 100) {
    const newLeft = Math.random() * 90;
    const tooClose = usedPositions.some(pos => Math.abs(pos - newLeft) < minSeparation);
    if (!tooClose) {
      usedPositions.push(newLeft);
      return newLeft;
    }
    attempts++;
  }
  return Math.random() * 90; // Fallback if spacing fails after 100 attempts
}

// Create and animate heart elements floating upwards
function createHearts() {
  for (let i = 0; i < totalHearts; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "heart-wrapper";

    const heart = document.createElement("div");
    heart.className = "heart";

    // Randomly apply heartbeat effect to some hearts
    if (Math.random() < 0.4) {
      heart.classList.add("beating");
    }

    // Set horizontal position and animation
    const left = generatePosition();
    wrapper.style.left = `${left}%`;

    const duration = 8000 + Math.random() * 4000; // Heart float duration
    const delay = Math.random() * 5;              // Random delay to spread animation
    wrapper.style.animation = `floatUp ${duration}ms ease-in ${delay}s infinite`;

    wrapper.appendChild(heart);
    container.appendChild(wrapper);
  }
}

// Init stars and animation
createStars(400);
function animateConstellations() {
  drawConstellations();
  requestAnimationFrame(animateConstellations);
}
animateConstellations();
startShootingStars();

// On button click
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  stopShootingStars();
  starContainer.innerHTML = "";

  audio.play().catch(() => {
    console.log("Autoplay blocked");
  });

  mainText.style.display = "block";
  mainText.classList.add("pulsing");

  createHearts();
});