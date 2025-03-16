// Pseudocode for the Card-Based Ball Toss Game
// Before all this, the user MUST enter amount to POT
// 1. Initialize game, the cards section generates all 26 cards in sorted positions.
// 2. Player places a bet, it must be higher than 0 and less than or equal to the pot.
// 3. Player chooses a card from the cards section. (2-10, A, J, Q, K)
// 4. Player pressed the "Start" button, and will only proceed when a proper bet is inputted and a card is chosen.
// 5. if the start button is pressed without proper bet input AND a card is not chosen, send alert(). Else; proceed to next step.
// 5. System Randomly Generates the 26 card positions, all both 26 red and black cards of all suites. No duplicates, all cards appear only once.
// 6. Player throws ball 
// 7. Determine the card on which the ball lands (Player thorws ball Gobble-de-gook what-cha-ma-call-it)
// 8. Check for matching properties (Number, Suite)
/*
    8.1. IF NO property matches the chosen card (number and suite is different)
        9. Player loses, gimme our money (get all bet)
    8.2. IF ANY property matches the chosen card (for one ball)
        10.1. Player wins, if the chosen card is the same card (number and suite); gets 2x the reward
        10.2. Player wins, if the chosen card is the same number but different suit; gets 1.5x the reward
        10.3. Player wins, if the chosen card is the same suite but different number; gets 1x the reward
*/
//haha
const cards = document.getElementById("cards");
const betInput = document.getElementById("betinput");
const betCard = document.getElementById("betcard");
const betAmount = document.getElementById("betamount");
const startBtn = document.getElementById("start");
const shuffleBtn = document.getElementById("shuffle");
const PotBtn = document.getElementById("fill-the-pot");
const potDisplay = document.getElementById("pot");

// used Canvas to create the ball and the 5x5 grid
const canvas = document.createElement("canvas");
canvas.id = "DropBallCanvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d"); //acts as a empty canva 

canvas.width = 500;
canvas.height = 500;

const grid5x5 = 5;
const cellSize = canvas.width / grid5x5;

//with Pot money included
let cardSelected = false;
let gameStarted = false;
let selectedCard = null;
let pot = 0;

const suites = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = [];

const orderedGen = () => { // START UP, EVERYTHING IS ORDERED, PLAYER CHOOSES A CARD FROM HERE
    cards.innerHTML = ``;
    for(let i = 0;i < values.length*2;i++) {
        const orderColor = i > 12 ? 'white' : 'red';
        const orderSuite = i % suites.length;
        const orderValue = i % 13;
        const CardSuiteAndValue =  `${values[orderValue]}${suites[orderSuite]}`; // combined the orderedValue of card and ordersuite

        deck.push({
            color: orderColor,
            suite: suites[orderSuite],
            value: values[orderValue],
            key: CardSuiteAndValue
        });

        let cardDiv = document.createElement("div"); // create div element to create single playing card
        cardDiv.classList.add("card", orderColor);
        cardDiv.innerText = CardSuiteAndValue;
        cardDiv.addEventListener("click", () => {
            selectedCard = CardSuiteAndValue;
            betCard.innerText = selectedCard;
            cardSelected = true;
        });

        cards.appendChild(cardDiv);
    }
};
orderedGen();

// const randBall = () => {
//     const rand = Math.floor(Math.random() * deck.length);
//     const getRandomcard = deck[rand];
//     alert(`The ball has dropped and landed on a: ${getRandomcard.value}${getRandomcard.suite}`);
//     return getRandomcard;
// }; //// commented out this to replace Math.random to the ball with 5x5 grid

// const didPlayerWin = () => {
//     const ball = randBall();
//     if (ball.value === betCard.innerText && ball.suite === betCard.innerText) {
//         alert("Player wins!");
//     } else {
//         alert("Player loses!");
//     }
// }

// Draws the 5x5 grid
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

    // text modifier in the 5x5 grid
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // fills the cell boxes with the cards on the deck 
    for (let row = 0; row < grid5x5; row++) {
        for (let col = 0; col < grid5x5; col++) {
            let card = deck[row * grid5x5 + col];
            let x = col * cellSize + cellSize / 2;
            let y = row * cellSize + cellSize / 2;

            // white background. no to transparent
            ctx.fillStyle = "white";
            ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);

            // fills the grid with the card suite and the card values 
            ctx.fillStyle = "black";
            ctx.fillStyle = (card.suite === "♦" || card.suite === "♥") ? "red" : "black";
            ctx.fillText(`${card.value}${card.suite}`, x, y);
        }
    }
}

// get direction values by random  
function getdirection(min, max) {
    return Math.random() * (max - min) + min;
}

// ball functionalities
//gets the speed of the ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    vx: getdirection(-2, 2),
    vy: getdirection(-3, 3),
    speedDecay: 0.995,
    minSpeed: 0.05,
    stopped: false
};

//when the player resets the game
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = getdirection(-5, 5);
    ball.vy = getdirection(-7, 7);
    ball.stopped = false;
}

// the ball properties stuff 
function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

//how the ball moves and stuff
function updateBall() {
    if (ball.stopped) return;

    // ball.vx and ball.vy is the velocity of x and y (i dunno if you get this but yea)
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

    // the ball's speed decreases as time goes by
    ball.vx *= ball.speedDecay;
    ball.vy *= ball.speedDecay;

    if (Math.abs(ball.vx) < ball.minSpeed && Math.abs(ball.vy) < ball.minSpeed) {
        ball.vx = 0;
        ball.vy = 0;
        ball.stopped = true;
        checkWinCondition();
    }
}

//checking the win conditions
function checkWinCondition() {
    let col = Math.floor(ball.x / cellSize);
    let row = Math.floor(ball.y / cellSize);
    let landedballCard = deck[row * grid5x5 + col];

    alert(`The ball landed on: ${landedballCard.value}${landedballCard.suite}`);

    let bet = parseFloat(betAmount.innerText);
    if (landedballCard.key === selectedCard) {
        alert("You won!! You have the exact same card as the winning card! Get 2x your money!");
        pot += bet * 2;
    } else if (landedballCard.value === selectedCard[0] && landedballCard.suite !== selectedCard[1]) {
        alert("You won! You have the same card value! Get 1.5 your money!");
        pot += bet * 1.5;
    } else if (landedballCard.suite === selectedCard[1] && landedballCard.value !== selectedCard[0]) {
        alert("You won! You have the same card suite! We just give you back your own money");
        pot += bet * 1;
    } else {
        alert("You lose! Gimme your money. Try again?");
    }

    //after the game, the pot subtraccts to the bet
    potDisplay.innerText = `$${pot}`;

    // resets the game
    cardSelected = false;
    selectedCard = null;
    betAmount.innerText = "";
    betCard.innerText = "";
}

// for smoother game performance
let lastTime = performance.now();
function animate() {
    let currentTime = performance.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 5x5 grid function and the ball is called
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawthegrid5x5grid();
    updateBall(deltaTime);
    drawBall();
    requestAnimationFrame(animate);
}

startBtn.addEventListener("click", () => { // LE STARTO BUTONNES, HOLA CHIKO, LET'S GO!
    let bet = parseFloat(betInput.value);

    if (pot <= 0) {
        alert("You need to fill the pot first!");
        return;
    }

    if (bet > 0 && bet <= pot) { 
        betAmount.innerText = bet;
        pot -= bet; // deduct money from pot
        potDisplay.innerText = `$${pot}`; // display the new pot amount

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

//pot of greed input function
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
