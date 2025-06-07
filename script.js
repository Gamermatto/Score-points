const clickSound = new Audio("270304__littlerobotsoundfactory__collect_point_00.mp3");

let scores = [0, 0];
const scoreEls = [
  document.getElementById("score1"),
  document.getElementById("score2")
];
const nameInputs = [
  document.getElementById("name1"),
  document.getElementById("name2")
];

// Carica i dati salvati
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("scoreData"));
  if (saved) {
    scores = saved.scores;
    scoreEls[0].textContent = scores[0];
    scoreEls[1].textContent = scores[1];
    nameInputs[0].value = saved.names[0];
    nameInputs[1].value = saved.names[1];
  }
});

document.querySelectorAll(".plus").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const player = parseInt(btn.getAttribute("data-player"));
    scores[player - 1]++;
    const scoreEl = scoreEls[player - 1];
    scoreEl.textContent = scores[player - 1];

    // Suono
    clickSound.currentTime = 0; // Riavvia se viene cliccato velocemente
    clickSound.play();

    // Animazione
    scoreEl.classList.add("bump");
    setTimeout(() => scoreEl.classList.remove("bump"), 300);

    // Sparkle
    for (let i = 0; i < 10; i++) {
      createSparkle(e.clientX, e.clientY, player);
    }

    saveData();
  });
});

// Funzione per creare le particelle
function createSparkle(x, y, player) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle p" + player;

  const dx = (Math.random() - 0.5) * 100 + "px";
  const dy = (Math.random() - 0.5) * 100 + "px";
  sparkle.style.setProperty('--dx', dx);
  sparkle.style.setProperty('--dy', dy);

  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 600);
}

// Reset punteggi
document.getElementById("reset").addEventListener("click", () => {
  scores = [0, 0];
  scoreEls.forEach(el => el.textContent = "0");
  saveData();
});

// Blocca numeri nei nomi
nameInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[0-9]/g, "");
    saveData();
  });
});

// Previene doppio tap zoom su iOS
let lastTouchEnd = 0;
document.addEventListener("touchend", function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Nasconde barra di ricerca
window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 1); // scroll verso il basso per nascondere la barra
  }, 10

// Salva in localStorage
function saveData() {
  localStorage.setItem("scoreData", JSON.stringify({
    scores: scores,
    names: [nameInputs[0].value, nameInputs[1].value]
  }));
}