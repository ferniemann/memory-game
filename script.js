const btnSettings = document.querySelector("#settings");

const fieldSize = localStorage.getItem("size") || 16;
const players = localStorage.getItem("players") || 3;
const images = [];

let turn = 0;
let playersTurn = 1;
let blocked = false;

btnSettings.addEventListener("click", toggleModal);

getImages();
renderGameStats();

function toggleModal() {
    const modalSettings = document.querySelector("#modal");
    const settingsPlayers = document.querySelector("#players");
    const settingsFieldSize = document.querySelector("#size");
    const btnSave = document.querySelector("#save-settings");
    const btnClose = document.querySelector("#close");

    settingsPlayers.value = players;
    settingsFieldSize.value = fieldSize;
    modalSettings.hidden = false;

    btnSave.addEventListener("click", saveSettings);
    btnClose.addEventListener("click", function () {
        modalSettings.hidden = true;
    });
}

function saveSettings() {
    const settingsPlayers = document.querySelector("#players");
    const settingsFieldSize = document.querySelector("#size");

    localStorage.setItem("players", settingsPlayers.value);
    localStorage.setItem("size", settingsFieldSize.value);

    location.reload();
}

function getImages() {
    for (let i = 1; i < fieldSize / 2 + 1; i++) {
        const imgSrc = `https://picsum.photos/seed/${i}/500`;

        images.push(imgSrc, imgSrc);
    }

    shuffle(images);
    renderGameField();
}

function renderGameStats() {
    const gameStats = document.querySelector("#game-stats");

    for (let i = 1; i <= players; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.dataset.player = i;

        const playerCount = document.createElement("small");
        playerCount.innerText = i;

        const score = document.createElement("p");
        score.dataset.score = 0;
        score.innerText = score.dataset.score;

        wrapper.append(playerCount, score);
        gameStats.append(wrapper);
    }

    checkPlayersTurn();
}

function checkPlayersTurn() {
    const allPlayers = document.querySelectorAll("[data-player]");
    const activePlayer = document.querySelector(`[data-player="${playersTurn}"]`);

    allPlayers.forEach((player) => player.classList.remove("active"));
    activePlayer.classList.add("active");
}

function renderGameField() {
    const gameField = document.querySelector("#game-field");

    for (let i = 0; i < fieldSize; i++) {
        const card = document.createElement("div");
        card.classList.add("game-card");
        card.addEventListener("click", toggleCard);

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const image = document.createElement("img");
        image.src = images.slice(i, i + 1);

        card.append(overlay, image);
        gameField.append(card);
    }
}

function toggleCard(e) {
    if (!blocked) {
        turn++;

        const overlay = e.target;
        const image = overlay.nextElementSibling;

        overlay.classList.toggle("flip");
        image.classList.toggle("flip");

        if (turn === 2) {
            blocked = true;
            const cards = document.querySelectorAll(".flip");

            if (checkMatch(images)) {
                updateScore();
                cards.forEach((el) => {
                    el.parentElement.removeEventListener("click", toggleCard);
                    el.classList.add("match");
                    el.classList.toggle("flip");
                });

                blocked = false;
            } else {
                if (playersTurn < players) {
                    playersTurn++;
                } else {
                    playersTurn = 1;
                }

                setTimeout(function () {
                    cards.forEach((el) => el.classList.toggle("flip"));

                    checkPlayersTurn();
                    blocked = false;
                }, 3000);
            }

            turn = 0;
        }
    }
}

function checkMatch() {
    const images = document.querySelectorAll("img.flip");
    if (images[0].src === images[1].src) {
        return true;
    } else {
        return false;
    }
}

function updateScore() {
    const activePlayer = document.querySelector(".active").querySelector("[data-score]");
    currentScore = Number(activePlayer.dataset.score);
    newScore = currentScore + 1;

    console.log(activePlayer);
    console.log(newScore);
    activePlayer.dataset.score = newScore;
    activePlayer.innerText = newScore;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
