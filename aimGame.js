// ==========================================
// --- AIM TRAINER LOGIC ---
// ==========================================

const aimElements = {
    scoreDisplay: document.getElementById('aim-score'),
    timerDisplay: document.getElementById('aim-timer'),
    accuracyDisplay: document.getElementById('aim-accuracy'),
    playArea: document.getElementById('aim-play-area'),
    target: document.getElementById('aim-target'),
    overlay: document.getElementById('aim-overlay'),
    mainMessage: document.getElementById('aim-main-message'),
    subMessage: document.getElementById('aim-sub-message'),
    timeButtons: document.querySelectorAll('.aim-time-btn'),
    customTimeInput: document.getElementById('aim-custom-time-input')
};

let aimState = {
    isPlaying: false,
    score: 0,
    misses: 0,
    timeLeft: 30,
    selectedTime: 30,
    timerInterval: null
};

// --- TIME SELECTOR ---
// Lets the player pick a 15s / 30s / 60s / custom round length before starting.
aimElements.timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        aimElements.timeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.time === 'custom') {
            aimElements.customTimeInput.classList.remove('hidden');
            aimElements.customTimeInput.focus();
        } else {
            aimElements.customTimeInput.classList.add('hidden');
            setAimDuration(parseInt(btn.dataset.time, 10));
        }
    });
});

aimElements.customTimeInput.addEventListener('input', () => {
    const val = parseInt(aimElements.customTimeInput.value, 10);
    if (val > 0) {
        setAimDuration(val);
    }
});

// Updates the selected round length, and refreshes the timer display
// if the player hasn't started a round yet.
function setAimDuration(seconds) {
    aimState.selectedTime = seconds;
    if (!aimState.isPlaying) {
        aimState.timeLeft = seconds;
        aimElements.timerDisplay.innerText = `${seconds}s`;
    }
}

// --- GAME START ---
function startAimGame() {
    aimState.isPlaying = true;
    aimState.score = 0;
    aimState.misses = 0;
    aimState.timeLeft = aimState.selectedTime;

    updateAimDashboard();
    aimElements.overlay.classList.add('hidden');
    spawnAimTarget();

    clearInterval(aimState.timerInterval);
    aimState.timerInterval = setInterval(() => {
        aimState.timeLeft--;
        aimElements.timerDisplay.innerText = `${aimState.timeLeft}s`;

        if (aimState.timeLeft <= 0) {
            endAimGame();
        }
    }, 1000);
}

// --- TARGET SPAWNING ---
// Moves the target to a random position fully inside the play area.
function spawnAimTarget() {
    const areaW = aimElements.playArea.clientWidth;
    const areaH = aimElements.playArea.clientHeight;
    const size = aimElements.target.offsetWidth || 60;

    const maxX = Math.max(areaW - size, 0);
    const maxY = Math.max(areaH - size, 0);

    aimElements.target.style.left = `${Math.random() * maxX}px`;
    aimElements.target.style.top = `${Math.random() * maxY}px`;
    aimElements.target.classList.remove('hidden');
}

// --- HIT / MISS HANDLING ---

// Hitting the target: stop the click from bubbling to the play area
// (so it doesn't also count as a miss), then score and respawn.
aimElements.target.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!aimState.isPlaying) return;

    aimState.score++;
    updateAimDashboard();
    spawnAimTarget();
});

// Clicking the play area background (anywhere that isn't the target)
// counts as a miss while a round is active.
aimElements.playArea.addEventListener('click', () => {
    if (!aimState.isPlaying) return;

    aimState.misses++;
    updateAimDashboard();
    flashAimMiss();
});

// Clicking the start/results overlay begins a new round.
aimElements.overlay.addEventListener('click', (e) => {
    if (!aimState.isPlaying) {
        e.stopPropagation();
        startAimGame();
    }
});

// Quick red border flash so a missed click still gives feedback.
function flashAimMiss() {
    aimElements.playArea.classList.add('miss-flash');
    setTimeout(() => aimElements.playArea.classList.remove('miss-flash'), 200);
}

// --- DASHBOARD ---
function updateAimDashboard() {
    aimElements.scoreDisplay.innerText = aimState.score;
    aimElements.timerDisplay.innerText = `${aimState.timeLeft}s`;

    const totalClicks = aimState.score + aimState.misses;
    const accuracy = totalClicks === 0 ? 100 : Math.round((aimState.score / totalClicks) * 100);
    aimElements.accuracyDisplay.innerText = `${accuracy}%`;
}

// --- GAME END ---
function endAimGame() {
    aimState.isPlaying = false;
    clearInterval(aimState.timerInterval);

    aimElements.target.classList.add('hidden');
    aimElements.timerDisplay.innerText = '0s';

    const totalClicks = aimState.score + aimState.misses;
    const accuracy = totalClicks === 0 ? 100 : Math.round((aimState.score / totalClicks) * 100);

    aimElements.mainMessage.innerText = `Time's Up! Score: ${aimState.score}`;
    aimElements.subMessage.innerText = `Accuracy: ${accuracy}% — Click to play again.`;
    aimElements.overlay.classList.remove('hidden');
}
