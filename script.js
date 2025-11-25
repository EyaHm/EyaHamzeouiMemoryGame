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
const timerDisplay = document.getElementById("timer");
let currentLevel = "medium";

//Images
const images = ["kitty", "turtle", "unicorn", "sun", "fox", "deer", "frog", "squirrel"];

//Game State
let first, second;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let timer = null;
let timeleft = 0;
let gameStarted = false;

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
  if (currentLevel === "easy") timeleft = 20;
  else if (currentLevel === "hard") timeleft = 60; 
  else timeleft = 40;
  timerDisplay.textContent=`⏱ 00:${timeleft}`;
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

//Timer
function startTimer() {
  timer = setInterval(() => {
    timeleft--;
    updatetimerdisp();
    if(timeleft<=10){
      timerDisplay.classList.add("Warning");
    }
    if(timeleft===0){
      alert("maybe next time");
      stopTimer();
      restartGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}
function updatetimerdisp(){
  let min=String(Math.floor(timeleft / 60)).padStart(2, "0");
  let sec=String(timeleft % 60).padStart(2, "0");
  timerDisplay.textContent= `⏱ ${min}:${sec}`;
}

function resetTimer() {
  stopTimer();
}


//Flip Logic
function flipCard() {
  if (lockBoard || this === first) return;

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  this.classList.add("flip");

  if (!first) {
    first = this;
    return;
  }

  second = this;
  checkMatch();
}

//Match Logic
function checkMatch() {
  const isMatch = first.dataset.name === second.dataset.name;
  if (isMatch) {
    matchedPairs++;
    disable();
    if (matchedPairs === totalPairs){
          stopTimer();
          setTimeout(() => {
            alert("congratilations")
          },900);
        }
  } else {
    unflip();
  }
}

function disable() {
  first.removeEventListener("click", flipCard);
  second.removeEventListener("click", flipCard);
  resetBoard();
}

function unflip() {
  lockBoard = true;
  setTimeout(() => {
    first.classList.remove("flip");
    second.classList.remove("flip");
    resetBoard();
  }, 900);
}

function resetBoard() {
  [first, second] = [null, null];
  lockBoard = false;
}

//Restart
function restartGame() {
  matchedPairs=0;
  gameStarted=false;
  timerDisplay.classList.remove("Warning");
  resetBoard();
  createBoard(currentLevel);
  resetTimer();
}
restartBtn.addEventListener("click", restartGame);

//Start default
createBoard("medium");