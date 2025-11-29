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
const movesDisplay = document.getElementById("moves");
const modal = document.getElementById("gameModal");
const bestScoresDiv = document.getElementById("bestScores");
const modalContent = document.getElementById("modalContent");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

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
let moves=0;
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

// Best Scores Storage
function getBestScores() {
  const scores = localStorage.getItem('memoryGameScores');
  return scores ? JSON.parse(scores) : { easy: null, medium: null, hard: null };
}

function calculateScore(moves, timeUsed) {
  const base = currentLevel === "easy" ? 10 :
               currentLevel === "medium" ? 25 : 50;
  const totalTime= currentLevel === "easy" ? 20 :
                    currentLevel === "medium" ? 40 : 60 ;
  const timeLeft = totalTime - timeUsed;
  const efficiency = timeLeft / totalTime;   
  const accuracy = totalPairs / moves;       
  const score = Math.round(base * efficiency * accuracy * 100);
  return score;
}

function saveBestScore(level, moves, time) {
  const scores = getBestScores();
  const newScore = calculateScore(moves, time);
  
  if (!scores[level] || newScore > scores[level].score) {
    scores[level] = { moves, time, score: newScore };
    localStorage.setItem("memoryGameScores", JSON.stringify(scores));
    return true;
  }
  return false;
}

function displayBestScores() {
  const scores = getBestScores();
  let html = '';
  
  for (let level in scores) {
    if (scores[level]) {
      html += `
        <div class="score-item">
          <span class="score-level">${level}</span>
          <span class="score-details">${scores[level].moves} moves, ${scores[level].time}s - 
          <span class="score-value">Score: ${scores[level].score}</span></span>
        </div>`;
    }
  }
  
  if (html === '') {
    html = '<p style="text-align: center; color: #999;">No scores yet. Play to set records!</p>';
  }
  
  bestScoresDiv.innerHTML = html;
}

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
  movesDisplay.textContent="Moves : 0";
  timerDisplay.textContent= `⏱ 00:${timeleft}`;
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
      stopTimer();
      loseGame();
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
  moves++;
  movesDisplay.textContent="Moves : "+ moves;
  checkMatch();
}

//Match Logic
function checkMatch() {
  const isMatch = first.dataset.name === second.dataset.name;
  if (isMatch) {
    matchedPairs++;
    first.classList.add("matched");
    second.classList.add("matched");
    disable();
    if (matchedPairs === totalPairs){
          stopTimer();
          setTimeout(() => winGame(),500);
        }
  } else {
    first.classList.add("wrong");
    second.classList.add("wrong");
    unflip();
  }
}

function disable() {
  first.classList.remove("wrong");
  second.classList.remove("wrong");
  first.removeEventListener("click", flipCard);
  second.removeEventListener("click", flipCard);
  resetBoard();
}

function unflip() {
  lockBoard = true;
  setTimeout(() => {
    first.classList.remove("flip","wrong");
    second.classList.remove("flip","wrong");
    resetBoard();
  }, 900);
}

function resetBoard() {
  [first, second] = [null, null];
  lockBoard = false;
}
//Win
function winGame() {
    const timeUsed = (currentLevel === "easy" ? 20 :
                      currentLevel === "medium" ? 40 : 60) - timeleft;
    const finalScore=calculateScore(moves,timeUsed);
    const isBest = saveBestScore(currentLevel, moves, timeUsed);
    const scores=getBestScores();
    const bestScore=scores[currentLevel] ? scores[currentLevel].score : 0;

    modalTitle.textContent = "🎉";
    modalMessage.innerHTML = `You Won! <br>
     Your Score: <strong>${finalScore}</strong><br>
     The Highest Score (${currentLevel}:<strong>${bestScore}</strong>)`;
    modalContent.classList.remove("lose");
    modalContent.classList.add("win");
    const congrats=document.getElementById("congrats");
    if(isBest){
      congrats.style.display="block";
      congrats.classList.add("pop");
    }else{
      congrats.style.display="none";
      congrats.classList.remove("pop");
    }
    modal.classList.add("show");
    displayBestScores();

}

//Lose
function loseGame() {
    modalTitle.textContent = "😢";
    modalMessage.textContent = "Time's Up! Better luck next time!";
    modalContent.classList.remove("win");
    modalContent.classList.add("lose");
    modal.classList.add("show");
}


//Restart
function restartGame() {
  matchedPairs=0;
  gameStarted=false;
  moves=0;
  timerDisplay.classList.remove("Warning");
  modal.classList.remove("show");
  resetBoard();
  createBoard(currentLevel);
  resetTimer();
}
restartBtn.addEventListener("click", restartGame);

//Start default
createBoard("medium");
displayBestScores();