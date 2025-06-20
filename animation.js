const container = document.getElementById("hearts-container");
const audio = document.getElementById("music");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const mainText = document.querySelector("h1");

const totalHearts = 30;
const minSeparation = 8; // Minimum % of horizontal separation between hearts
const usedPositions = [];

// Generate a random horizontal position with spacing to avoid overlapping
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
  return Math.random() * 90;
}

// Create floating heart elements
for (let i = 0; i < totalHearts; i++) {
  const wrapper = document.createElement("div");
  wrapper.className = "heart-wrapper";

  const heart = document.createElement("div");
  heart.className = "heart";

  if (Math.random() < 0.4) {
    heart.classList.add("beating");
  }

  const left = generatePosition();
  wrapper.style.left = `${left}%`;

  const duration = 8000 + Math.random() * 4000;
  const delay = Math.random() * 5;
  wrapper.style.animationDuration = `${duration}ms`;
  wrapper.style.animationDelay = `${delay}s`;

  wrapper.appendChild(heart);
  container.appendChild(wrapper);
}

// Start everything after clicking the button
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  audio.play().catch(() => {
    console.log("Autoplay blocked, waiting for user interaction.");
  });
  mainText.classList.add("pulsing");
});