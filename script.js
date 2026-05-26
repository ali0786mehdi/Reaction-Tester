// --- DOM ELEMENTS ---
const elements = {
    playArea: document.getElementById('play-area'),
    target: document.getElementById('target'),
    overlay: document.getElementById('message-overlay'),
    mainMessage: document.getElementById('main-message'),
    subMessage: document.getElementById('sub-message'),
    roundDisplay: document.getElementById('round-display'),
    avgTimeDisplay: document.getElementById('average-time'),
    bestTimeDisplay: document.getElementById('best-time')
};

// --- GAME STATE ARCHITECTURE ---
const state = {
    status: 'start', // 'start', 'waiting', 'ready', 'finished'
    currentRound: 0,
    maxRounds: 5,
    reactionTimes: [],
    startTime: 0,
    timeoutId: null
};

// --- EVENT LISTENERS ---
elements.overlay.addEventListener('click', handleOverlayClick);
elements.playArea.addEventListener('mousedown', handleEarlyClick);
elements.target.addEventListener('mousedown', handleTargetClick);

// Prevents default mobile double-tap zooming
document.addEventListener('touchstart', (e) => {
    if (e.target === elements.target || e.target === elements.overlay) {
        e.preventDefault(); 
    }
}, { passive: false });

// --- CORE LOGIC ---

function handleOverlayClick(e) {
    e.stopPropagation(); // Prevents click from bubbling to playArea
    if (state.status === 'start' || state.status === 'finished') {
        resetGameStatsIfNeeded();
        startRound();
    }
}

function startRound() {
    state.status = 'waiting';
    elements.overlay.classList.add('hidden');
    elements.target.classList.add('hidden');

    // Update Round UI
    elements.roundDisplay.innerText = `${state.currentRound + 1}/${state.maxRounds}`;

    // Random delay between 1s and 3.5s
    const delay = Math.floor(Math.random() * 2500) + 1000;

    state.timeoutId = setTimeout(() => {
        spawnTarget();
    }, delay);
}

function spawnTarget() {
    state.status = 'ready';
    
    // Calculate max X and Y so the target stays inside the box
    const maxX = elements.playArea.clientWidth - elements.target.clientWidth;
    const maxY = elements.playArea.clientHeight - elements.target.clientHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Apply positions
    elements.target.style.left = `${randomX}px`;
    elements.target.style.top = `${randomY}px`;
    
    // Show target and start timer using high-resolution time
    elements.target.classList.remove('hidden');
    state.startTime = performance.now();
}

function handleTargetClick(e) {
    e.stopPropagation(); // Prevent triggering early click on playArea
    if (state.status !== 'ready') return;

    const endTime = performance.now();
    const reactionTime = (endTime - state.startTime) / 1000; // Convert to seconds

    elements.target.classList.add('hidden');
    state.reactionTimes.push(reactionTime);
    state.currentRound++;

    updateDashboardStats();

    if (state.currentRound >= state.maxRounds) {
        endGame();
    } else {
        showOverlay(`Time: ${reactionTime.toFixed(3)}s`, "Click to start next round");
        state.status = 'start';
    }
}

function handleEarlyClick() {
    // If they click the background while waiting for the target to spawn
    if (state.status === 'waiting') {
        clearTimeout(state.timeoutId);
        showOverlay("Too Soon!", "You clicked before the target appeared.");
        elements.target.classList.add('hidden');
        state.status = 'start';
    }
}

// --- UTILITY FUNCTIONS ---

function showOverlay(mainText, subText) {
    elements.mainMessage.innerText = mainText;
    elements.subMessage.innerText = subText;
    elements.overlay.classList.remove('hidden');
}

function updateDashboardStats() {
    // Calculate Average
    const sum = state.reactionTimes.reduce((a, b) => a + b, 0);
    const avg = sum / state.reactionTimes.length;
    elements.avgTimeDisplay.innerText = `${avg.toFixed(3)}s`;

    // Calculate Best
    const best = Math.min(...state.reactionTimes);
    elements.bestTimeDisplay.innerText = `${best.toFixed(3)}s`;
}

function endGame() {
    state.status = 'finished';
    const finalAvg = elements.avgTimeDisplay.innerText;
    showOverlay("Test Complete", `Your average time was ${finalAvg}. Click to play again.`);
}

function resetGameStatsIfNeeded() {
    if (state.status === 'finished') {
        state.currentRound = 0;
        state.reactionTimes = [];
        elements.avgTimeDisplay.innerText = "0.000s";
        elements.bestTimeDisplay.innerText = "0.000s";
        elements.roundDisplay.innerText = `1/${state.maxRounds}`;
    }
}
