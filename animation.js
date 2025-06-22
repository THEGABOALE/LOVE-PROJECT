// Get DOM elements
const container = document.getElementById("hearts-container");
const audio = document.getElementById("music");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const mainText = document.getElementById("main-title");

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

// Start animation and music on button click
startButton.addEventListener("click", () => {
  startScreen.style.display = "none"; // Hide intro screen

  // Play background music
  audio.play().catch(() => {
    console.log("Autoplay blocked");
  });

  // Show and animate main text
  mainText.style.display = "block";
  mainText.classList.add("pulsing");

  // Start heart animations
  createHearts();
});
