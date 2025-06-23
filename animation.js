// Get DOM elements
const container = document.getElementById("hearts-container");
const audio = document.getElementById("music");
const starContainer = document.getElementById("stars-container");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const mainText = document.getElementById("main-title");

//Generate random stars
function createStars(amount = 120) {
  for (let i = 0; i < amount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

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

//Generate one shooting star
function createShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";

  const startX = Math.random() * (window.innerWidth - 200);  
  const startY = -20;

  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;

  starContainer.appendChild(star);

  star.animate([
    { transform: "translate(0, 0) rotate(-45deg)", opacity: 1 },
    { transform: "translate(-400px, 400px) rotate(-45deg)", opacity: 0 }
  ], {
    duration: 700,
    easing: "ease-out",
    fill: "forwards"
  });

  setTimeout(() => star.remove(), 1000);
}

// Interval to launch shooting stars
let shootingStarInterval;

function startShootingStars() {
  const loop = () => {
    const count = Math.floor(Math.random() * 3) + 1;

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
createStars();
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