const betInput = document.getElementById("betinput");
const betCard = document.getElementById("betcard");
const betAmount = document.getElementById("betamount");
const startBtn = document.getElementById("start");
const PotBtn = document.getElementById("fill-the-pot");
const potDisplay = document.getElementById("pot");
const cards = document.getElementById("cards");

const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const gridSize = 5;
const cellSize = canvas.width / gridSize;

let cardSelected = false;
let gameStarted = false;
let selectedCard = null;
let pot = 0;

const suits = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];

// ✅ Restored orderedGen function with selection enabled
const orderedGen = () => {
    cards.innerHTML = ``;
    deck = [];
    for (let i = 0; i < values.length * 2; i++) {
        const orderColor = i > 12 ? 'white' : 'red';
        const orderSuite = i % suits.length;
        const orderValue = i % 13;
        let cardKey = `${values[orderValue]}${suits[orderSuite]}`;

        deck.push({
            color: orderColor,
            suite: suits[orderSuite],
            value: values[orderValue],
            key: cardKey
        });

        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card", orderColor);
        cardDiv.innerText = cardKey;
        cardDiv.addEventListener("click", () => {
            selectedCard = cardKey;
            betCard.innerText = selectedCard;
            cardSelected = true;
        });

        cards.appendChild(cardDiv);
    }
};
orderedGen();

function drawGrid() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let card = deck[row * gridSize + col];
            let x = col * cellSize + cellSize / 2;
            let y = row * cellSize + cellSize / 2;
            ctx.fillStyle = (card.suite === "♦" || card.suite === "♥") ? "red" : "black";
            ctx.fillText(`${card.value}${card.suite}`, x, y);
        }
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    vx: getRandom(-2, 2),
    vy: getRandom(-3, 3),
    speedDecay: 0.995,
    minSpeed: 0.05,
    stopped: false
};

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = getRandom(-5, 5);
    ball.vy = getRandom(-7, 7);
    ball.stopped = false;
}

function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function updateBall() {
    if (ball.stopped) return;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -getRandom(0.85, 0.95);
        ball.vy *= getRandom(0.9, 1.1);
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.vy *= -getRandom(0.85, 0.95);
        ball.vx *= getRandom(0.9, 1.1);
    }

    ball.vx *= ball.speedDecay;
    ball.vy *= ball.speedDecay;

    if (Math.abs(ball.vx) < ball.minSpeed && Math.abs(ball.vy) < ball.minSpeed) {
        ball.vx = 0;
        ball.vy = 0;
        ball.stopped = true;
        checkWinCondition();
    }
}

function checkWinCondition() {
    let col = Math.floor(ball.x / cellSize);
    let row = Math.floor(ball.y / cellSize);
    let landedCard = deck[row * gridSize + col];

    alert(`The ball landed on: ${landedCard.value}${landedCard.suite}`);

    let bet = parseFloat(betAmount.innerText);
    if (landedCard.key === selectedCard) {
        alert("You won 2x your bet!");
        pot += bet * 2;
    } else if (landedCard.value === selectedCard[0] && landedCard.suite !== selectedCard[1]) {
        alert("You won 1.5x your bet!");
        pot += bet * 1.5;
    } else if (landedCard.suite === selectedCard[1] && landedCard.value !== selectedCard[0]) {
        alert("You won 1x your bet!");
        pot += bet * 1;
    } else {
        alert("You lose! Try again?");
    }

    // ✅ Pot correctly subtracts after each game
    potDisplay.innerText = `$${pot}`;

    // ✅ Requires player to select a new card & bet before playing again
    cardSelected = false;
    selectedCard = null;
    betAmount.innerText = "";
    betCard.innerText = "";
}

let lastTime = performance.now();
function animate() {
    let currentTime = performance.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    updateBall(deltaTime);
    drawBall();
    requestAnimationFrame(animate);
}

startBtn.addEventListener("click", () => {
    let bet = parseFloat(betInput.value);

    if (pot <= 0) {
        alert("You need to fill the pot first!");
        return;
    }

    if (bet > 0 && bet <= pot) {
        betAmount.innerText = bet;
        pot -= bet; // ✅ Pot correctly subtracts after placing a bet
        potDisplay.innerText = `$${pot}`;

        if (cardSelected) {
            gameStarted = true;
            resetBall();
            animate();
        } else {
            alert("A card must be selected!");
        }
    } else {
        alert("Bet must be higher than 0 or can't be greater than the pot!");
    }
});

PotBtn.addEventListener("click", () => {
    let amount = parseFloat(prompt("Enter the desired amount: "));
    if (!isNaN(amount) && amount > 0) {
        pot += amount;
        potDisplay.innerText = `$${pot}`;
        alert(`Added $${amount} to the pot!`);
    } else {
        alert("Invalid amount! Please enter any amount that you have!");
    }
});
