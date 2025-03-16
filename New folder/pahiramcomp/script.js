// Pseudocode for the Card-Based Ball Toss Game
// Before all this, the user MUST enter amount to POT
// 1. Initialize game, the cards section generates all 26 cards in sorted positions.
// 2. Player places a bet, it must be higher than 0 and less than or equal to the pot.
// 3. Player chooses a card from the cards section. (2-10, A, J, Q, K)
// 4. Player pressed the "Start" button, and will only proceed when a proper bet is inputted and a card is chosen.
// 5. if the start button is pressed without proper bet input AND a card is not chosen, send alert(). Else; proceed to next step.
// 5. System Randomly Generates the 26 card positions, all both 26 red and black cards of all suites. No duplicates, all cards appear only once.
// 6. Player throws ball (dunno if 1-3 balls??)
// 7. Determine the card on which the ball lands (Player thorws ball Gobble-de-gook what-cha-ma-call-it)
// 8. Check for matching properties (Number, Suite)
/*
    8.1. IF NO property matches the chosen card (number and suite is different)
        9. Player loses, gimme our money (get all bet)
    8.2. IF ANY property matches the chosen card (for one ball)
        10.1. Player wins, if the chosen card is the same card (number and suite); gets 2x the reward
        10.2. Player wins, if the chosen card is the same number but different suit; gets 1.5x the reward
        10.3. Player wins, if the chosen card is the same suite but different number; gets 1x the reward
    8.3 IF 2 OR MORE balls land on the same card (for 2 or 3 balls)
        11.1. Player wins, if the chosen card is the same card (number and suite); gets 4-8x the reward (2 balls = 4x; 3 balls = 8x)
        11.2. Player wins, if the chosen card is the same number but different suit; gets 3-6x the reward (2 balls = 3x; 3 balls = 6x)
        11.3. Player wins, if the chosen card is the same suite but different number; gets 2-4x the reward (2 balls = 2x; 3 balls = 4x)
*/

const cards = document.getElementById("cards");
const betInput = document.getElementById("betinput");
const betCard = document.getElementById("betcard");
const betAmount = document.getElementById("betamount");
const pot = document.getElementById("pot");
const startBtn = document.getElementById("start");
const shuffleBtn = document.getElementById("shuffle");
let cardSelected = false;
let gameStarted = false;
let selectedCard = null; 
const suites = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = [];

const orderedGen = () => { // START UP, EVERYTHING IS ORDERED, PLAYER CHOOSES A CARD FROM HERE
    cards.innerHTML = ``;
    for(let i = 0;i < values.length*2;i++) {
        const orderColor = i > 12 ? 'white' : 'red';
        const orderSuite = i % suites.length;
        const orderValue = i % 13;
        deck.push({
            color: orderColor,
            suite: suites[orderSuite],
            value: values[orderValue]
        });
        cards.innerHTML += `<div class="card ${orderColor}">${values[orderValue]}${suites[orderSuite]}</div>`;
    }
};
orderedGen();

const randBall = () => {
    const rand = Math.floor(Math.random() * deck.length);
    const getRandomcard = deck[rand];
    alert(`The ball has dropped and landed on a: ${getRandomcard.value}${getRandomcard.suite}`);
    return getRandomcard;
};

// const didPlayerWin = () => {
//     const ball = randBall();
//     if (ball.value === betCard.innerText && ball.suite === betCard.innerText) {
//         alert("Player wins!");
//     } else {
//         alert("Player loses!");
//     }
// }

startBtn.addEventListener("click", () => { // LE STARTO BUTONNES, HOLA CHIKO, LET'S GO!
    const bet = parseFloat(betInput.value);
    if (bet > 0) {
        betAmount.innerText = bet;
        if (cardSelected) {
            gameStarted = true;

            const getRandomcard = randBall();
            if (`${getRandomcard.value}${getRandomcard.suite}` === selectedCard) {
                alert("You have selected the winning card!");
            } else {
                alert("You lose!");
            }

        } else { alert("A card must be selected!") }
    } else { alert("Bet must be higher than 0!") }

});

betInput.addEventListener("keydown", (e) => {
    const bet = parseFloat(betInput.value);
    if (e.key === "Enter") {
        if (bet > 0) {
            betAmount.innerText = bet;
            if (cardSelected) {
                gameStarted = true;
                randBall();
            } else { alert("A card must be selected!") }
        } else { alert("Bet must be higher than 0!") }
    }
  })

    cards.addEventListener("click", () => { // A IS CARD IS CLICKED, IT IS RECORDED IN THE SYSTEM
        if (event.target.classList.contains("card")){
            cardSelected = true;
            const selectedCard = event.target.innerText;
            betCard.innerText = `${selectedCard}`;
        }
});

// const cards = document.getElementById("cards");
// const betInput = document.getElementById("betinput");
// const betCard = document.getElementById("betcard");
// const betAmount = document.getElementById("betamount");
// const potDisplay = document.getElementById("pot");
// const startBtn = document.getElementById("start");
// const fillPotBtn = document.getElementById("fill-the-pot");

// let cardSelected = false;
// let gameStarted = false;
// let selectedCard = null;
// let pot = 0; // Pot starts at 0

// const suites = ['♠', '♣', '♥', '♦'];
// const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
// const deck = [];

// // Function to generate and display the ordered deck
// const orderedGen = () => {
//     cards.innerHTML = ``;
//     deck.length = 0; // Reset deck

//     for (let i = 0; i < values.length * 2; i++) {
//         const orderColor = i > 12 ? 'white' : 'red';
//         const orderSuite = i % suites.length;
//         const orderValue = i % 13;
//         deck.push({
//             color: orderColor,
//             suite: suites[orderSuite],
//             value: values[orderValue]
//         });
//         cards.innerHTML += `<div class="card ${orderColor}" data-value="${values[orderValue]}" data-suite="${suites[orderSuite]}">${values[orderValue]}${suites[orderSuite]}</div>`;
//     }
// };
// orderedGen(); // Initialize the game deck

// // Function to drop the ball randomly and get a card
// const randBall = () => {
//     const rand = Math.floor(Math.random() * deck.length);
//     const getRandomCard = deck[rand];
//     alert(`The ball has landed on: ${getRandomCard.value}${getRandomCard.suite}`);
//     return getRandomCard;
// };

// // Function to handle the betting and game start
// startBtn.addEventListener("click", () => {
//     const bet = parseFloat(betInput.value);

//     if (pot <= 0) {
//         alert("Pot is empty! Please insert money before betting.");
//         return;
//     }

//     if (bet > 0 && bet <= pot) {
//         betAmount.innerText = bet;
//         pot -= bet; // Deduct bet from pot
//         potDisplay.innerText = `$${pot}`;

//         if (cardSelected) {
//             gameStarted = true;
//             const getRandomCard = randBall();

//             if (`${getRandomCard.value}${getRandomCard.suite}` === selectedCard) {
//                 alert("You won! Doubling your bet.");
//                 pot += bet * 2; // Win condition: double the bet
//             } else {
//                 alert("You lost. Try again!");
//             }
//         } else {
//             alert("Please select a card before betting!");
//         }
//     } else {
//         alert(bet <= 0 ? "Bet must be higher than 0!" : "Bet cannot be greater than the pot!");
//     }
// });

// // Allow bet placement by pressing Enter
// betInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//         startBtn.click();
//     }
// });

// // Select a card when clicked
// cards.addEventListener("click", (event) => {
//     if (event.target.classList.contains("card")) {
//         cardSelected = true;
//         selectedCard = `${event.target.dataset.value}${event.target.dataset.suite}`;
//         betCard.innerText = selectedCard;
//     }
// });

// // Function to refill the pot
// fillPotBtn.addEventListener("click", () => {
//     const amount = parseFloat(prompt("Enter amount to add to the pot:"));
//     if (!isNaN(amount) && amount > 0) {
//         pot += amount;
//         potDisplay.innerText = `$${pot}`;
//         alert(`Added $${amount} to the pot!`);
//     } else {
//         alert("Invalid amount! Please enter a positive number.");
//     }
// });
