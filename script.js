const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const answer = document.getElementById('answer');

const figureParts = document.querySelectorAll('.figure-part');

let selectedWord = "";
const correctLetters = [];
const wrongLetters = [];
 
async function getWord() {
    const words = await (await fetch('words.json')).json();
    selectedWord = await words[Math.floor(Math.random() * words.length)];
    displayWord()
}

function displayWord() {
    wordEl.innerHTML = `
        ${selectedWord
            .split("")
            .map(letter => `
                <span class="letter">
                    ${correctLetters.includes(letter) ? letter : ""}
                </span>
                `
            )
            .join("")}
    `;

    console.log(selectedWord);

    const innerWord = wordEl.innerText.replace(/\n/g, ""); 

    if (innerWord === selectedWord) {
        finalMessage.innerText = "Congratulations! You Won! 🎉";
        popup.style.display = 'flex';
    }
}

function updateWrongLettersEl() {
    // Display wrong letters
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? `<p>Wrong</p>` : ""}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    // Display Parts 
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;
        console.log("wrong letters", wrongLetters);
        console.log("index:", index);
        console.log("errors", errors);
        // console.log(figureParts);

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = "none"
        }
    });

    // Check if Lost 
    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = `Unfortunately, you lost. 😭`;
        answer.innerText = `The answer was: ${selectedWord}`;
        popup.style.display = 'flex';
    }
}

function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 1500);
}

function restartGame() {
   // Empty Arrays
   correctLetters.splice(0);
   wrongLetters.splice(0);

   selectedWord = getWord();

   updateWrongLettersEl();

   popup.style.display = 'none';
}

window.addEventListener('keydown', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;

        if(selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);

                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);

                updateWrongLettersEl();
            } else {
                showNotification();
            }
        }
    //Restarts Game if 'Enter' key pressed    
    } else if (e.keyCode === 13) {
        if (popup.style.display === 'flex') {
            restartGame();
        }
    }   
});

// Restart gamne and play again 
playAgainBtn.addEventListener('click', restartGame);

  
window.addEventListener('load', getWord);

  