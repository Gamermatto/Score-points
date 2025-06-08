const clickSound = new Audio("270304__littlerobotsoundfactory__collect_point_00.mp3");

let scores = [0, 0, 0];
const scoreEls = [
  document.getElementById("score1"),
  document.getElementById("score2")
];
const nameInputs = [
  document.getElementById("name1"),
  document.getElementById("name2")
];

let historyGames = [];

// Carica dati da localStorage
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("scoreData"));
  if (saved) {
    scores = saved.scores;
    scores.forEach((score, i) => {
      if (scoreEls[i]) scoreEls[i].textContent = score;
    });
    saved.names.forEach((name, i) => {
      if (nameInputs[i]) nameInputs[i].value = name;
    });
  }

  const savedHistory = JSON.parse(localStorage.getItem("gameHistory"));
  if (savedHistory) {
    historyGames = savedHistory;
    renderHistory();
  }
});

// Aggiunta punto
document.querySelectorAll(".plus").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const player = parseInt(btn.getAttribute("data-player"));
    scores[player - 1]++;
    const scoreEl = scoreEls[player - 1];
    scoreEl.textContent = scores[player - 1];

    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.warn("Audio non riprodotto:", err));

    scoreEl.classList.add("bump");
    setTimeout(() => scoreEl.classList.remove("bump"), 300);
    for (let i = 0; i < 10; i++) createSparkle(e.clientX, e.clientY, player);

    saveData();
  });
});

// Crea particella
function createSparkle(x, y, player) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle p" + player;
  sparkle.style.setProperty('--dx', (Math.random() - 0.5) * 100 + "px");
  sparkle.style.setProperty('--dy', (Math.random() - 0.5) * 100 + "px");
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 600);
}

// Reset punteggi
document.getElementById("reset").addEventListener("click", () => {
  scores = [0, 0, 0];
  scoreEls.forEach(el => el.textContent = "0");
  saveData();
});

// Blocca numeri nei nomi
nameInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[0-9]/g, "");
    saveData();
  });
});

// Prevenzione doppio tap zoom su iOS
let lastTouchEnd = 0;
document.addEventListener("touchend", (e) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, false);

// Nasconde barra mobile
window.addEventListener("load", () => {
  setTimeout(() => window.scrollTo(0, 1), 10);
});

// Salva punteggi e nomi
function saveData() {
  localStorage.setItem("scoreData", JSON.stringify({
    scores: scores,
    names: nameInputs.map(input => input.value)
  }));
}

// Mostra cronologia
function renderHistory() {
  const container = document.getElementById("historyContainer");
  container.innerHTML = "";
  historyGames.forEach(game => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>${game.names[0]}: ${game.scores[0]} pt</div>
      <div>${game.names[1]}: ${game.scores[1]} pt</div>
    `;
    container.appendChild(item);
  });
}

// Fine partita
document.getElementById("endGame").addEventListener("click", () => {
  historyGames.push({
    names: nameInputs.map(input => input.value),
    scores: [...scores]
  });
  localStorage.setItem("gameHistory", JSON.stringify(historyGames));
  renderHistory();

  scores = [0, 0, 0];
  scoreEls.forEach(el => el.textContent = "0");
  nameInputs.forEach((input, i) => input.value = `Giocatore ${i + 1}`);
  saveData();

  const menuToggleCheckbox = document.querySelector("#menuToggle input");
  if (menuToggleCheckbox?.checked) menuToggleCheckbox.checked = false;
});