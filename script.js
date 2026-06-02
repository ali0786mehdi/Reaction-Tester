// ==========================================
// --- MENTAL MATH GAME LOGIC ---
// ==========================================

let mathScore = 0;
let mathTimeLeft = 30;
let currentMathAnswer = 0;
let mathTimerInterval;

// Cache DOM elements for better performance
const mathElements = {
    scoreDisplay: document.getElementById('math-score'),
    timerDisplay: document.getElementById('math-timer'),
    questionDisplay: document.getElementById('math-question'),
    inputField: document.getElementById('math-input'),
    startBtn: document.getElementById('start-math-btn')
};

function startMathGame() {
    // 1. Reset Game State
    mathScore = 0;
    mathTimeLeft = 30;
    mathElements.scoreDisplay.innerText = mathScore;
    mathElements.timerDisplay.innerText = `${mathTimeLeft}s`;

    // 2. Enable Input & Disable Start Button (The Fix!)
    mathElements.inputField.disabled = false;
    mathElements.inputField.value = '';
    mathElements.inputField.focus(); // Auto-selects the input box so you can type immediately
    
    mathElements.startBtn.disabled = true;
    mathElements.startBtn.innerText = "Playing...";
    mathElements.startBtn.style.opacity = '0.5';
    mathElements.startBtn.style.cursor = 'not-allowed';

    // 3. Clear existing intervals (prevents timer speeding up if clicked twice)
    clearInterval(mathTimerInterval);

    // 4. Start Countdown
    mathTimerInterval = setInterval(() => {
        mathTimeLeft--;
        mathElements.timerDisplay.innerText = `${mathTimeLeft}s`;

        if (mathTimeLeft <= 0) {
            endMathGame();
        }
    }, 1000);

    // 5. Show first question
    generateMathQuestion();
}

function generateMathQuestion() {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1, num2;

    // Helper function: Generates a random number between 2 and 20
    const getRandomInRange = () => Math.floor(Math.random() * 19) + 2; 

    switch (operator) {
        case '+':
            num1 = getRandomInRange();
            num2 = getRandomInRange();
            currentMathAnswer = num1 + num2;
            break;
        case '-':
            num1 = getRandomInRange();
            num2 = getRandomInRange();
            // Swap if num1 is smaller to avoid negative answers
            if (num1 < num2) {
                let temp = num1;
                num1 = num2;
                num2 = temp;
            }
            currentMathAnswer = num1 - num2;
            break;
        case '*':
            num1 = getRandomInRange();
            num2 = getRandomInRange();
            currentMathAnswer = num1 * num2;
            break;
        case '/':
            // To ensure clean division (no decimals):
            // We generate the divisor and the answer first (both 2-20), 
            // then multiply them to get the dividend.
            num2 = getRandomInRange(); 
            currentMathAnswer = getRandomInRange(); 
            num1 = num2 * currentMathAnswer; 
            break;
    }

    mathElements.questionDisplay.innerText = `${num1} ${operator} ${num2} = ?`;
    mathElements.inputField.value = '';
}

// Ensure the HTML triggers this function on keyup
function checkAnswer(event) {
    if (event.key === 'Enter') {
        const userAnswer = parseInt(event.target.value);

        if (userAnswer === currentMathAnswer) {
            // Correct Answer
            mathScore++;
            mathElements.scoreDisplay.innerText = mathScore;
            generateMathQuestion();
        } else {
            // Wrong Answer: Just clear the box so they can re-type immediately
            event.target.value = '';
        }
    }
}

function endMathGame() {
    clearInterval(mathTimerInterval);
    
    mathElements.questionDisplay.innerText = `Time's Up! Score: ${mathScore}`;
    
    // Disable input
    mathElements.inputField.disabled = true;
    mathElements.inputField.value = '';
    mathElements.inputField.blur();

    // Reset Start Button
    mathElements.startBtn.disabled = false;
    mathElements.startBtn.innerText = "Play Again";
    mathElements.startBtn.style.opacity = '1';
    mathElements.startBtn.style.cursor = 'pointer';
}
