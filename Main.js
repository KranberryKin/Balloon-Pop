//#region DATA
let clickCount = 0;
let height = 120;
let width = 90;
let inflationrate = 30;
let maxSize = 300;
let highestPopCount = 0;
let currentPopCount = 0;
let gameLength = 10000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = "red";
let possibleColors = ["green", "blue", "purple", "pink", "red"]
//#endregion

let StartButton = document.getElementById("Button-Start");
let InflateButton = document.getElementById("Button-Inflate");

//#region Game Logic
function startGame() {
  document.getElementById("main-controls").classList.add("hidden")
  document.getElementById("game-controls").classList.remove("hidden")
  document.getElementById("scoreboard").classList.add("hidden");

  startClock();
  console.log("Did it work?")
  StartButton.setAttribute("disabled", "true");

  setTimeout(stopGame, gameLength)
}

function startClock() {
  timeRemaining = gameLength;
  drawClock()
  clockId = setInterval(drawClock, 1000);
}

function stopClock() {
  clearInterval(clockId);
}

function drawClock() {
  let countDownElem = document.getElementById("countdown");
  countDownElem.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000;
}

function Inflate() {
  if (height <= 0) {
    height = 40
  }
  clickCount++;
  height += inflationrate;
  width += inflationrate;
  checkBalloonPop();
  Draw();
}

function checkBalloonPop() {
  if (height >= maxSize) {
    let balloonElement = document.getElementById("balloon");
    balloonElement.classList.remove(currentColor);
    getRandomColor();
    balloonElement.classList.add(currentColor);
    currentPopCount++;
    height = 0;
    width = 0;
    document.getElementById("pop-sound").play();
  }

}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i]
}

function Draw() {
  let balloonElement = document.getElementById("balloon");
  let clickCountElem = document.getElementById("click-count");
  let popCountElem = document.getElementById("pop-count");
  let highPopCountElem = document.getElementById("high-pop-count");

  let playerNameElem = document.getElementById("player-name");

  balloonElement.style.height = height + "px";
  balloonElement.style.width = width + "px";

  clickCountElem.innerText = clickCount.toString();
  popCountElem.innerText = currentPopCount.toString();
  highPopCountElem.innerText = currentPlayer.topScore.toString();
  playerNameElem.innerText = currentPlayer.name.toString();
}

function stopGame() {
  StartButton.removeAttribute("disabled");
  document.getElementById("main-controls").classList.remove("hidden")
  document.getElementById("game-controls").classList.add("hidden")
  document.getElementById("scoreboard").classList.remove("hidden")

  console.log("5 seconds pasted")
  clickCount = 0;
  height = 120;
  width = 90;

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount;
    savePlayers();
  }

  currentPopCount = 0;

  stopClock();
  Draw();
  drawScoreboard();
}



//#endregion

let players = []

loadPlayers();
//#region Player Logic
function setPlayer(event) {
  event.preventDefault();
  let form = event.target;

  let playerName = form.playerName.value;

  currentPlayer = players.find(player => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 };
    players.push(currentPlayer);
    savePlayers();
  }

  form.reset();
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  Draw();
  drawScoreboard();
}

function changePlayer() {
  document.getElementById("playerform").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}

function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players));
}

function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"));
  if (playersData) {
    players = playersData;
  }
}

function drawScoreboard() {

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  let template = ""

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
    <span>${player.name}</span>
    <span>Top Score : ${player.topScore}</span>
</div>
`
  })

  document.getElementById("players").innerHTML = template
}
//#endregion
drawScoreboard();

