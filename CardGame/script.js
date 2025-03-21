// Pseudocode for the Card-Based Ball Toss Game
// 1. Initialize game, the cards section generates all 26 cards in sorted positions.
// 2. Player places a bet, it must be higher than 0, (2-10, A, J, Q, K).
// 3. Player chooses a card from the cards section.
// 4. Player pressed the "Start" button, and will only proceed when a proper bet is inputted and a card is chosen.
// 5. if the start button is pressed without proper bet input AND a card is not chosen, send alert(). Else; proceed to next step.
// 5. System Randomly Generates the 26 card positions, all both 26 red and black cards of all suites. No duplicates, all cards appear only once.
// 6. Player throws ball
// 7. Determine the card on which the ball lands (Player thorws ball Gobble-de-gook what-cha-ma-call-it)
// 8. Check for matching properties (Number, Suite)
/*
    8.1. IF NO property matches the chosen card
        9. Player loses
    8.2. IF ANY property matches the chosen card
       9. Player wins

*/
const cards = document.getElementById("cards");
const betInput = document.getElementById("betinput");
const betCard = document.getElementById("betcard");
const betAmount = document.getElementById("betamount");
const startBtn = document.getElementById("start");
const ruleBtn = document.getElementById("rules");
const shuffleBtn = document.getElementById("shuffle");
var popupDialog = document.getElementById("popupDialog");
var popupDialogclose = document.getElementsByClassName("close")[0];
const popupDialogText = document.getElementById("popupDialog-text");
let cardSelected = false;
let gameStarted = false;
let selectedCard = [];
const suites = ['♠', '♣', '♥', '♦']; // const suites = ['&#9824;', '&#9827;', '&#9829;', '&#9830;']; // all that hard work for nothing LUL
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = [];
let balanceAmount = document.getElementById("balanceamount");
betAmount.innerText = "0"
balanceAmount.innerText = "0"
  
popupDialogclose.onclick = function() {
    popupDialog.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == popupDialog) {
        popupDialog.style.display = "none";
    }
}
const orderedGen = () => { // START UP, EVERYTHING IS ORDERED, PLAYER CHOOSES A CARD FROM HERE
    cards.innerHTML = ``;
    deck.length = 0;
    for (let i = 0; i < values.length * 2; i++) {
        let orderColor = 'black'; 


        if (i % 4 === 0 || i % 4 === 1) {
            orderColor = 'black';
        } else {
            orderColor = 'red';
        }

        const orderSuite = i % suites.length;
        const orderValue = i % 13;
        deck.push({
            color: orderColor,
            suite: suites[orderSuite],
            value: values[orderValue]
        });
    }
    
    if (deck.length > 0) { // Remove 1 card
        const randomIndex = Math.floor(Math.random() * deck.length);
        deck.splice(randomIndex, 1);
    }

    deck.forEach(card => { // Display all cards
        cards.innerHTML += `<div class="card ${card.color}">${card.value}${card.suite}</div>`;
    });
};
orderedGen();

const canvas = document.getElementById("DropBallCanvas");
// canvas.id = "DropBallCanvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

const grid5x5 = 5;
const cellSize = canvas.width / grid5x5;

function drawthegrid5x5grid(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (let i = 0; i <= grid5x5; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < grid5x5; row++) {
        for (let col = 0; col < grid5x5; col++) {
            let card = deck[row * grid5x5 + col];
            let x = col * cellSize + cellSize / 2;
            let y = row * cellSize + cellSize / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);

            ctx.fillStyle = "black";
            ctx.fillStyle = card.color;
            ctx.fillText(`${card.value}${card.suite}`, x, y);
        }
    }
}
function getdirection(min, max) {
    return Math.random() * (max - min) + min;
}
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    vx: getdirection(-5, 5),
    vy: getdirection(-7, 7),
    speedDecay: 0.995,
    minSpeed: 0.05,
    stopped: false
};
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = getdirection(-5, 5);
    ball.vy = getdirection(-7, 7);
    ball.stopped = false;
};
function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
};
function updateBall() {
    if (ball.stopped) return;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.vx *= -getdirection(0.85, 0.95);
        ball.vy *= getdirection(0.9, 1.1);
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.vy *= -getdirection(0.85, 0.95);
        ball.vx *= getdirection(0.9, 1.1);
    }

    ball.vx *= ball.speedDecay;
    ball.vy *= ball.speedDecay;

    if (Math.abs(ball.vx) < ball.minSpeed && Math.abs(ball.vy) < ball.minSpeed) {
        ball.vx = 0;
        ball.vy = 0;
        ball.stopped = true;
        console.log("Ball has stopped.");
        checkWinCondition();
    }
}
function checkWinCondition() {
    let col = Math.floor(ball.x / cellSize);
    let row = Math.floor(ball.y / cellSize);
    let landedballCard = deck[row * grid5x5 + col];

    console.log(`Ball landed on: ${landedballCard.value}${landedballCard.suite}`);

    let bet = parseFloat(betInput.value);

    // alert(`The ball landed on: ${landedballCard.value}${landedballCard.suite}`);
    popupDialog.style.display = "block";
    if (landedballCard.value === selectedCard[0] && landedballCard.suite === selectedCard[1]) {
        popupDialogText.innerText = `It landed on ${landedballCard.value}${landedballCard.suite}! You won! You have the exact same card as the winning card! Get 2x your money!`;
        balanceAmount.innerText = parseFloat(balanceAmount.innerText) + bet * 2;
    } else if (landedballCard.value === selectedCard[0]) {
        popupDialogText.innerText = `It landed on ${landedballCard.value}${landedballCard.suite}! You won! You have the same card value! Get 1.5 your money!`;
        balanceAmount.innerText = parseFloat(balanceAmount.innerText) + bet * 1.5;
    } else if (landedballCard.suite === selectedCard[1]) {
        popupDialogText.innerText = `It landed on ${landedballCard.value}${landedballCard.suite}! You won! You have the same card suite! Get 1.2 your money!`;  
        balanceAmount.innerText = parseFloat(balanceAmount.innerText) + bet * 1.2;
    } else {
        popupDialogText.innerText = `It landed on ${landedballCard.value}${landedballCard.suite}! You lose! Try again`;
        balanceAmount.innerText = parseFloat(balanceAmount.innerText) - bet;
    }
    betInput.disabled = false;
    gameStarted = false;
}
let lastTime = performance.now();
function animate() {
    let currentTime = performance.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawthegrid5x5grid();
    updateBall(deltaTime);
    drawBall();
    requestAnimationFrame(animate);
}
startBtn.addEventListener("click", () => { // BUTTONS, HOLA CHICO, VAVANOS!
    let bet = parseFloat(betInput.value);
    if (isNaN(bet)) {
        alert("Bet must be a number!")
        return
    }

    if (gameStarted) {
        popupDialog.style.display = "block";
        popupDialogText.innerText = "Game currently ongoing.";
        return  
    }
    if (!(bet > 0)) {
        alert("Bet must be higher than 0!")
        return
        
    } 
    betAmount.innerText = bet;
    if (!cardSelected) {
        alert("A card must be selected!") 
        return
        
    }
    betInput.disabled = true; 
    gameStarted = true;
    resetBall();
    animate();
});
betInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let bet = parseFloat(betInput.value);
    
        if (isNaN(bet)) {
            alert("Bet must be a number!")
            return
        }
    
        if (gameStarted) {
            popupDialog.style.display = "block";
            popupDialogText.innerText = "Game currently ongoing.";
            return  
        }
        if (!(bet > 0)) {
            alert("Bet must be higher than 0!")
            return
            
        } 
        betAmount.innerText = bet;
        if (!cardSelected) {
            alert("A card must be selected!") 
            return
            
        } 
        betInput.disabled = true;
        gameStarted = true;
        resetBall();
        animate();
    }
})
shuffleBtn.addEventListener("click", () => {
    if (!gameStarted) {
        orderedGen();
        betCard.innerText = "";
        cardSelected = false;
        const previousSelectedCard = document.querySelector(".selected-card");
        if (previousSelectedCard) {
            previousSelectedCard.classList.remove("selected-card");
        }

    } else {
        popupDialog.style.display = "block";
        popupDialogText.innerText = "Game currently ongoing.";
    }
});
cards.addEventListener("click", (e) => { // A IS CARD IS CLICKED, IT IS RECORDED IN THE SYSTEM
    if (e.target.classList.contains("card")) {
        if (gameStarted) {
            popupDialog.style.display = "block";
            popupDialogText.innerText = "NO CHEATING! >:3c";
            return;
        }

        const previousSelectedCard = document.querySelector(".selected-card");
        if (previousSelectedCard) {
            previousSelectedCard.classList.remove("selected-card");
        }

        cardSelected = true;
        selectedCard = e.target.innerText;
        betCard.innerText = `${selectedCard}`;
        e.target.classList.add("selected-card");
        console.log(`Selected card: ${selectedCard}`);
        const cardText = e.target.innerText;
        selectedCard = deck.find(card => `${card.value}${card.suite}` === cardText);
        selectedCard = [selectedCard.value, selectedCard.suite];
    }
});

ruleBtn.addEventListener("click", () => {
    if (!gameStarted) {
        popupDialog.style.display = "block";
        popupDialogText.innerText = "1. Player places a bet, it must be higher than 0. \n 2. Player chooses a card from the cards section. (2-10, A, J, Q, K). \n 3. Player should press the 'Bet & Start' button, and will only proceed when a proper bet is placed and a card is chosen. \n 4. Check for matching properties (Number, Suite) \n 4.1  IF NO property matches the chosen card (number and suite is different), Player loses. \n 4.2 IF ANY property matches the chosen card \n  a) Player wins, if the chosen card is the same card (number and suite); gets 2x the reward \n b) Player wins, if the chosen card is the same number but different suite; gets 1.5x the reward \n c) Player wins, if the chosen card is the same suite but different number; gets 1.2x the reward ";
    } else {
        popupDialog.style.display = "block";
        popupDialogText.innerText = "Game currently ongoing.";
    }
});
