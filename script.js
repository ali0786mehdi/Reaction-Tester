// ==========================================
// --- VIEW ROUTER ---
// ==========================================
function switchGame(gameName) {
    document.querySelectorAll('.game-view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const selectedView = document.getElementById(`view-${gameName}`);
    selectedView.classList.remove('hidden');
    selectedView.classList.add('active');

    document.getElementById(`btn-${gameName}`).classList.add('active');
}

// ==========================================
// --- REACTION TESTER LOGIC ---
// ==========================================

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

const state = {
    status: 'start', 
    currentRound: 0,
    maxRounds: 5,
    reactionTimes: [],
    startTime: 0,
    timeoutId: null
};

if (elements.overlay) elements.overlay.addEventListener('click', handleOverlayClick);
if (elements.playArea) elements.playArea.addEventListener('mousedown', handleEarlyClick);
if (elements.target) elements.target.addEventListener('mousedown', handleTargetClick);

document.addEventListener('touchstart', (e) => {
    if (e.target === elements.target || e.target === elements.overlay) {
        e.preventDefault(); 
    }
}, { passive: false });

function handleOverlayClick(e) {
    e.stopPropagation(); 
    if (state.status === 'start' || state.status === 'finished') {
        resetGameStatsIfNeeded();
        startRound();
    }
}

function startRound() {
    state.status = 'waiting';
    elements.overlay.classList.add('hidden');
    elements.target.classList.add('hidden');
    elements.roundDisplay.innerText = `${state.currentRound + 1}/${state.maxRounds}`;

    const delay = Math.floor(Math.random() * 2500) + 1000;
    state.timeoutId = setTimeout(() => {
        spawnTarget();
    }, delay);
}

function spawnTarget() {
    state.status = 'ready';
    const maxX = elements.playArea.clientWidth - elements.target.clientWidth;
    const maxY = elements.playArea.clientHeight - elements.target.clientHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    elements.target.style.left = `${randomX}px`;
    elements.target.style.top = `${randomY}px`;
    elements.target.classList.remove('hidden');
    state.startTime = performance.now();
}

function handleTargetClick(e) {
    e.stopPropagation(); 
    if (state.status !== 'ready') return;

    const endTime = performance.now();
    const reactionTime = (endTime - state.startTime) / 1000; 

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
    if (state.status === 'waiting') {
        clearTimeout(state.timeoutId);
        showOverlay("Too Soon!", "You clicked before the target appeared.");
        elements.target.classList.add('hidden');
        state.status = 'start';
    }
}

function showOverlay(mainText, subText) {
    elements.mainMessage.innerText = mainText;
    elements.subMessage.innerText = subText;
    elements.overlay.classList.remove('hidden');
}

function updateDashboardStats() {
    const sum = state.reactionTimes.reduce((a, b) => a + b, 0);
    const avg = sum / state.reactionTimes.length;
    elements.avgTimeDisplay.innerText = `${avg.toFixed(3)}s`;

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
