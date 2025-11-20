//Music ON/OFF
const audio = new Audio("mymusic.mp3");
audio.loop = true;

const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
let isMusicOn = false;

musicToggle.addEventListener("click", () => {
  if (isMusicOn) {
    audio.pause();
    musicIcon.src = "music-off.png";
  } else {
    audio.play();
    musicIcon.src = "music-notes.png";
  }
  isMusicOn = !isMusicOn;
});

//Elements
const icons = document.querySelectorAll(".difficulty img");
const gameBoard = document.querySelector(".game-board");
const restartBtn = document.querySelector(".restart");
let currentLevel = "medium";

//Images
const images = ["kitty", "turtle", "unicorn", "sun", "fox", "deer", "frog", "squirrel"];

//Difficulty Selector
icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    icons.forEach((i) => i.classList.remove("active"));
    icon.classList.add("active");
    currentLevel = icon.dataset.level;
    restartGame();
  });
});

//Board Generator
function createBoard(level = "medium") {
  gameBoard.innerHTML = "";

  //Layout
  if (level === "easy") {
    gameBoard.style.gridTemplateColumns = "repeat(3, 1fr)";
  } else {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  }

  //Number of pairs
  if (level === "easy") totalPairs = 3; // 6 cards
  else if (level === "hard") totalPairs = 8; // 16 cards
  else totalPairs = 6; // 12 cards

  let selected = images.slice(0, totalPairs);
  let cardsArray = [...selected, ...selected].sort(() => Math.random() - 0.5);

  //Create cards
  cardsArray.forEach((name) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = name;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><img src="${name}.png" alt="${name}"></div>
        <div class="card-back"></div>
      </div>
    `;
    gameBoard.appendChild(card);
    card.addEventListener("click",flipCard);
  });
}
//Flip logic
let first = null;
let second = null;
let lockBoard = false;

function flipCard() {
  if (lockBoard) return;        
  if (this === first) return;      
  this.classList.add("flip");
  if (!first) {
    // Première carte retournée
    first = this;
    return;
  }
  // Deuxième carte retournée
  second = this;
  lockBoard = true;
  
  if (first.dataset.name === second.dataset.name) {
    first.removeEventListner("click",flipCard);
    second.removeEventListner("click",flipCard);
    resetBoard();
  } else {
    // Pas la même paire, on déflip après un délai
    setTimeout(() => {
      first.classList.remove("flip");
      second.classList.remove("flip");
      resetBoard();
    }, 1000);
  }
}
function resetBoard() {
  [first, second] = [null, null];
  lockBoard = false;
}

//Restart
function restartGame() {
  createBoard(currentLevel);
}
restartBtn.addEventListener("click", restartGame);

//Start default
createBoard("medium");