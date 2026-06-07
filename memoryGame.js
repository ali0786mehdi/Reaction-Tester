// ==========================================
// --- MEMORY MATRIX LOGIC ---
// ==========================================

const memoryElements = {
    levelDisplay: document.getElementById('memory-level'),
    trialsDisplay: document.getElementById('memory-trials'),
    scoreDisplay: document.getElementById('memory-score'),
    message: document.getElementById('memory-message'),
    grid: document.getElementById('memory-grid'),
    startBtn: document.getElementById('start-memory-btn')
};

let memoryState = {
    level: 1,
    score: 0,
    trials: 3,
    gridSize: 3,
    activeTiles: [],
    guessedTiles: [],
    isPlaying: false, 
    hideTimer: null
};

// Initializes a brand new game
function startMemoryGame() {
    memoryState.level = 1;
    memoryState.score = 0;
    memoryState.trials = 3;
    
    memoryElements.startBtn.classList.add('hidden');
    memoryElements.grid.classList.remove('hidden');
    
    updateMemoryDashboard();
    loadMemoryLevel();
}

// Loads the current level data and builds the grid
function loadMemoryLevel() {
    memoryState.isPlaying = false; // Prevent clicking during flash
    memoryState.guessedTiles = [];
    
    // Scale Difficulty: Grid increases every 2 levels (max 7x7)
    memoryState.gridSize = Math.min(3 + Math.floor((memoryState.level - 1) / 2), 7);
    const totalTiles = memoryState.gridSize * memoryState.gridSize;
    
    // Scale Difficulty: Add more tiles to memorize as level goes up
    const numTilesToMemorize = memoryState.level + 2; 
    
    // Pick random tiles to be active
    memoryState.activeTiles = [];
    while (memoryState.activeTiles.length < numTilesToMemorize) {
        let randomTile = Math.floor(Math.random() * totalTiles);
        if (!memoryState.activeTiles.includes(randomTile)) {
            memoryState.activeTiles.push(randomTile);
        }
    }

    renderMemoryGrid(totalTiles);
    updateMemoryDashboard();
    
    memoryElements.message.innerText = "Memorize the pattern!";
    memoryElements.message.style.color = "var(--accent-color)";

    // Flash for exactly 2 seconds, then hide
    clearTimeout(memoryState.hideTimer);
    memoryState.hideTimer = setTimeout(() => {
        hideMemoryPattern();
    }, 2000);
}

// Draws the HTML grid
function renderMemoryGrid(totalTiles) {
    memoryElements.grid.innerHTML = '';
    
    // Scale the CSS grid layout dynamically
    memoryElements.grid.style.gridTemplateColumns = `repeat(${memoryState.gridSize}, 1fr)`;
    // Scale width depending on grid size so it doesn't look stretched out early on
    memoryElements.grid.style.width = `${Math.min(memoryState.gridSize * 50, 100)}%`; 

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('memory-tile');
        
        // If this tile is part of the pattern, show it initially
        if (memoryState.activeTiles.includes(i)) {
            tile.classList.add('showing');
        }

        tile.addEventListener('click', () => handleTileClick(i, tile));
        memoryElements.grid.appendChild(tile);
    }
}

// Removes the "showing" class and unlocks player input
function hideMemoryPattern() {
    const tiles = document.querySelectorAll('.memory-tile');
    tiles.forEach(tile => tile.classList.remove('showing'));
    
    memoryState.isPlaying = true;
    memoryElements.message.innerText = "Recall the pattern.";
    memoryElements.message.style.color = "var(--text-secondary)";
}

// Handles user guessing
function handleTileClick(index, tileElement) {
    // Block clicks if game is resetting, showing, or tile was already clicked
    if (!memoryState.isPlaying || memoryState.guessedTiles.includes(index) || tileElement.classList.contains('wrong')) {
        return;
    }

    if (memoryState.activeTiles.includes(index)) {
        // CORRECT GUESS
        tileElement.classList.add('correct');
        memoryState.guessedTiles.push(index);
        memoryState.score += (10 * memoryState.level);
        updateMemoryDashboard();

        // Did they find all tiles for this level?
        if (memoryState.guessedTiles.length === memoryState.activeTiles.length) {
            memoryState.isPlaying = false;
            memoryElements.message.innerText = "Perfect! Preparing next level...";
            memoryElements.message.style.color = "var(--target-color)"; // Green success
            
            // Wait 1.5 seconds, then load next level
            setTimeout(() => {
                memoryState.level++;
                loadMemoryLevel();
            }, 1500);
        }
    } else {
        // WRONG GUESS
        tileElement.classList.add('wrong');
        memoryState.trials--;
        updateMemoryDashboard();

        if (memoryState.trials <= 0) {
            triggerMemoryGameOver();
        }
    }
}

// Updates the top UI cards
function updateMemoryDashboard() {
    memoryElements.levelDisplay.innerText = memoryState.level;
    memoryElements.trialsDisplay.innerText = memoryState.trials;
    memoryElements.scoreDisplay.innerText = memoryState.score;
}

// Ends the game
function triggerMemoryGameOver() {
    memoryState.isPlaying = false;
    memoryElements.message.innerText = `Game Over! You reached Level ${memoryState.level}.`;
    memoryElements.message.style.color = "var(--error-color)";
    
    memoryElements.grid.classList.add('hidden');
    memoryElements.startBtn.innerText = "Try Again";
    memoryElements.startBtn.classList.remove('hidden');
}
