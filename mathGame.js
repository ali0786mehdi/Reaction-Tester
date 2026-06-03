// ==========================================
// --- MENTAL MATH GAME LOGIC ---
// ==========================================

let mathScore = 0;
let mathTimeLeft = 30;
let currentMathAnswer = 0;
let mathTimerInterval;

// --- Time Selection Logic ---
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (document.getElementById('start-math-btn').disabled) return;

        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const timeVal = e.target.getAttribute('data-time');
        const customInput = document.getElementById('custom-time-input');
        
        if (timeVal === 'custom') {
            customInput.classList.remove('hidden');
            customInput.focus();
        } else {
            customInput.classList.add('hidden');
        }
    });
});

// --- THE INSTANT SUBMIT FEATURE ---
document.getElementById('math-input').addEventListener('input', (event) => {
    const userAnswer = parseInt(event.target.value);
    
    // Check if the exact typed number matches the answer
    if (userAnswer === currentMathAnswer) {
        mathScore++;
        document.getElementById('math-score').innerText = mathScore;
        generateMathQuestion();
    }
    // If it doesn't match yet, we do nothing. 
    // This allows the user to keep typing if the answer is two digits.
});

function startMathGame() {
    const scoreDisplay = document.getElementById('math-score');
    const timerDisplay = document.getElementById('math-timer');
    const inputField = document.getElementById('math-input');
    const startBtn = document.getElementById('start-math-btn');

    let startingTime = 30; 
    const activeBtn = document.querySelector('.time-btn.active');
    
    if (activeBtn.getAttribute('data-time') === 'custom') {
        const customVal = parseInt(document.getElementById('custom-time-input').value);
        startingTime = (customVal && customVal > 0) ? customVal : 30; 
    } else {
        startingTime = parseInt(activeBtn.getAttribute('data-time'));
    }

    mathScore = 0;
    mathTimeLeft = startingTime;
    scoreDisplay.innerText = mathScore;
    timerDisplay.innerText = `${mathTimeLeft}s`;

    inputField.disabled = false;
    inputField.value = '';
    inputField.focus(); 
    
    startBtn.disabled = true;
    startBtn.innerText = "Playing...";
    startBtn.style.opacity = '0.5';
    startBtn.style.cursor = 'not-allowed';
    document.querySelectorAll('.time-btn').forEach(btn => btn.style.opacity = '0.5');

    clearInterval(mathTimerInterval);

    mathTimerInterval = setInterval(() => {
        mathTimeLeft--;
        timerDisplay.innerText = `${mathTimeLeft}s`;
        if (mathTimeLeft <= 0) endMathGame();
    }, 1000);

    generateMathQuestion();
}

function generateMathQuestion() {
    const questionDisplay = document.getElementById('math-question');
    const inputField = document.getElementById('math-input');
    
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1, num2;
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
            num2 = getRandomInRange(); 
            currentMathAnswer = getRandomInRange(); 
            num1 = num2 * currentMathAnswer; 
            break;
    }

    questionDisplay.innerText = `${num1} ${operator} ${num2} = ?`;
    inputField.value = ''; 
}

function endMathGame() {
    clearInterval(mathTimerInterval);
    
    const questionDisplay = document.getElementById('math-question');
    const inputField = document.getElementById('math-input');
    const startBtn = document.getElementById('start-math-btn');

    questionDisplay.innerText = `Time's Up! Score: ${mathScore}`;
    
    inputField.disabled = true;
    inputField.value = '';
    inputField.blur();

    startBtn.disabled = false;
    startBtn.innerText = "Start Game";
    startBtn.style.opacity = '1';
    startBtn.style.cursor = 'pointer';

    document.querySelectorAll('.time-btn').forEach(btn => btn.style.opacity = '1');
}
