// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Store original dimensions to restore after versus
const ORIGINAL_CANVAS_WIDTH = canvas.width;
const ORIGINAL_CANVAS_HEIGHT = canvas.height; // (height unchanged but stored for completeness)

// Sprite system
const sprites = {
    player: {
        default: new Image(),
        ninja: new Image(),
        robot: new Image(),
        superhero: new Image()
    },
    ball: {
        default: new Image(),
        fire: new Image(),
        ice: new Image(),
        gold: new Image(),
        rainbow: new Image()
    },
    enemies: {
        tackler: new Image()
    },
    powerups: {
        doublePoints: new Image(),
        bigBall: new Image(),
        fastCrouch: new Image()
    },
    coins: {
        bronze: new Image(),
        silver: new Image(),
        gold: new Image(),
        purple: new Image()
    }
};

let spritesLoaded = false;
let loadedSprites = 0;
let totalSprites = 0;

// Load all sprites
function loadSprites() {
    // Player sprites - each character gets its own file
    sprites.player.default.src = 'images/players/default.png';
    sprites.player.ninja.src = 'images/players/ninja.png';
    sprites.player.robot.src = 'images/players/robot.png';
    sprites.player.superhero.src = 'images/players/superhero.png';
    
    // Ball sprites - each skin gets its own file
    sprites.ball.default.src = 'images/balls/default.png';
    sprites.ball.fire.src = 'images/balls/fire.png';
    sprites.ball.ice.src = 'images/balls/ice.png';
    sprites.ball.gold.src = 'images/balls/gold.png';
    sprites.ball.rainbow.src = 'images/balls/rainbow.png';
    
    // Enemy sprites - each enemy type gets its own file
    sprites.enemies.tackler.src = 'images/enemies/tackler.png';
    
    // Powerup sprites (matching actual game powerups)
    sprites.powerups.doublePoints.src = 'images/powerups/doublePoints.png';
    sprites.powerups.bigBall.src = 'images/powerups/bigBall.png';
    sprites.powerups.fastCrouch.src = 'images/powerups/fastCrouch.png';
    
    // Coin sprites - each coin type gets its own file
    sprites.coins.bronze.src = 'images/coins/bronze.png';
    sprites.coins.silver.src = 'images/coins/silver.png';
    sprites.coins.gold.src = 'images/coins/gold.png';
    sprites.coins.purple.src = 'images/coins/purple.png';
    
    // Count total sprites
    totalSprites = Object.values(sprites).reduce((total, category) => {
        return total + Object.keys(category).length;
    }, 0);
    
    // Set a timeout to mark sprites as "loaded" even if they fail
    // This ensures the game doesn't get stuck waiting for sprites
    setTimeout(() => {
        if (!spritesLoaded) {
            spritesLoaded = true;
            console.log('Sprite loading timeout reached - using fallback graphics');
        }
    }, 2000); // 2 second timeout
    
    // Add load event listeners
    Object.entries(sprites).forEach(([categoryName, category]) => {
        Object.entries(category).forEach(([spriteName, sprite]) => {
            sprite.onload = () => {
                loadedSprites++;
                console.log(`✅ Sprite loaded: ${categoryName}/${spriteName}`);
                if (loadedSprites === totalSprites) {
                    spritesLoaded = true;
                    console.log('All sprites loaded!');
                }
            };
            sprite.onerror = () => {
                loadedSprites++;
                console.log(`❌ Sprite failed to load: ${categoryName}/${spriteName} - ${sprite.src}`);
                if (loadedSprites === totalSprites) {
                    spritesLoaded = true;
                    console.log('Sprite loading complete (using fallback graphics for missing images)');
                }
            };
        });
    });
}

// Google Authentication
let isAuthenticated = false;
let currentUser = null;
const GOOGLE_CLIENT_ID = '805780499266-r5or58uj99h33u6pvalaulb2secsa3.apps.googleusercontent.com'; // Your actual client ID from Google Cloud Console

// Cloud storage simulation (in production, use Firebase or similar)
let cloudData = {};

// Authentication functions
function handleCredentialResponse(response) {
    // Parse the JWT token to get user info
    const userInfo = parseJwt(response.credential);
    currentUser = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
    };
    
    isAuthenticated = true;
    updateAuthUI();
    loadUserData();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function updateAuthUI() {
    const signInContainer = document.getElementById('signInContainer');
    const userContainer = document.getElementById('userContainer');
    
    if (isAuthenticated && currentUser) {
        signInContainer.style.display = 'none';
        userContainer.style.display = 'block';
        
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userAvatar').src = currentUser.picture;
        
        // Update sync status
        setTimeout(() => {
            document.getElementById('syncStatus').textContent = 'Data synced ✓';
        }, 1000);
    } else {
        signInContainer.style.display = 'block';
        userContainer.style.display = 'none';
    }
}

function signOut() {
    isAuthenticated = false;
    currentUser = null;
    
    // Clear any cached Google auth
    google.accounts.id.disableAutoSelect();
    
    updateAuthUI();
    
    // Optionally clear local data or switch to local-only mode
    alert('Signed out successfully! Your progress is now saved locally only.');
}

function saveUserData() {
    if (!isAuthenticated || !currentUser) return;
    
    const userData = {
        totalCoins: totalCoins,
        bestScore: bestScore,
        hasShield: hasShield,
        ownsShinGuards: ownsShinGuards,
        selectedBallSkin: selectedBallSkin,
        selectedCharacter: selectedCharacter,
        unlockedBallSkins: unlockedBallSkins,
        unlockedCharacters: unlockedCharacters,
        lastUpdated: new Date().toISOString()
    };
    
    // In production, save to Firebase/backend
    cloudData[currentUser.id] = userData;
    
    // Show sync status
    document.getElementById('syncStatus').textContent = 'Syncing...';
    setTimeout(() => {
        document.getElementById('syncStatus').textContent = 'Data synced ✓';
    }, 500);
}

function loadUserData() {
    if (!isAuthenticated || !currentUser) return;
    
    document.getElementById('syncStatus').textContent = 'Loading...';
    
    // Simulate loading from cloud (in production, load from Firebase/backend)
    setTimeout(() => {
        const userData = cloudData[currentUser.id];
        
        if (userData) {
            // Load cloud data
            totalCoins = userData.totalCoins || 0;
            bestScore = userData.bestScore || 0;
            hasShield = userData.hasShield || false;
            ownsShinGuards = userData.ownsShinGuards || false;
            selectedBallSkin = userData.selectedBallSkin || 'default';
            selectedCharacter = userData.selectedCharacter || 'default';
            unlockedBallSkins = userData.unlockedBallSkins || ['default'];
            unlockedCharacters = userData.unlockedCharacters || ['default'];
            
            // Update UI
            document.getElementById('bestScore').textContent = bestScore;
            updateTotalCoinsDisplay();
            
            // Update localStorage as backup
            localStorage.setItem('totalCoins', totalCoins);
            localStorage.setItem('keepieUpieBest', bestScore);
            localStorage.setItem('hasShield', JSON.stringify(hasShield));
            localStorage.setItem('selectedBallSkin', selectedBallSkin);
            localStorage.setItem('selectedCharacter', selectedCharacter);
            localStorage.setItem('unlockedBallSkins', JSON.stringify(unlockedBallSkins));
            localStorage.setItem('unlockedCharacters', JSON.stringify(unlockedCharacters));
            
            document.getElementById('syncStatus').textContent = 'Data loaded ✓';
            
            // Initialize shield if user owns it
            if (hasShield) {
                shieldHealth = maxShieldHealth;
            }
        } else {
            // First time user - upload current local data to cloud
            saveUserData();
        }
    }, 1000);
}

// Override save functions to also save to cloud
const originalLocalStorageSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalLocalStorageSetItem.call(this, key, value);
    
    // Also save to cloud if authenticated
    if (isAuthenticated) {
        setTimeout(saveUserData, 100); // Debounce saves
    }
};

// Game state
let gameRunning = true;
let countdownActive = false;
let countdownValue = 3;
let score = 0;
let gameTime = 0; // Track game time in milliseconds
let lastDifficultyUpdate = 0; // Track when we last updated difficulty
let currentLevel = 1; // Current difficulty level (starts at 1)
let timeToNextLevel = 30000; // Time remaining until next level (30 seconds)
let coinsCollected = 0; // Coins in current game
let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0; // Persistent coin bank
let bestScore = localStorage.getItem('keepieUpieBest') || 0;

// === MODE FLAGS ===
let isFreeplay = false; // When true: endless, no enemies/damage/level progression
let isVersus = false; // 1v1 mode flag (step 1 basic setup)
// Versus mode state
let versusP1Score = 0;
let versusP2Score = 0;
let versusServer = 1; // current server
// Static wall goal apertures (taller, fixed position)
const VERSUS_GOAL = { height: 220, top: 0 }; // top set at match start
// Versus point flow control
let versusBetweenPoints = false; // true while frozen between points (and pre-first serve)
let versusPointCountdown = 0; // current countdown value (3..2..1)
let versusPointCountdownTimer = null; // interval handle
let versusLastScorer = 0; // 1 or 2 for last scorer (0 = none yet)
// Versus setup selections & match config
let versusP1Character = null;
let versusP2Character = null;
let versusBallSkin = null;
let versusPointsToWin = 5;
let versusMatchMinutes = 5; // desired duration
let versusMatchStartTime = null; // timestamp when rally play begins (after first serve)
let versusOriginalCharacter = null; // store to restore after match
let versusOriginalBallSkin = null;
let versusHasStartedPlay = false; // becomes true after first serve
// Versus win condition state
let versusMatchEnded = false; // true once match concluded
let versusSuddenDeath = false; // true if time expired with tie and next point wins
// Sudden death wall closure state
let suddenDeathStartTime = null;
let suddenDeathLeftX = 0; // dynamic inward-moving left boundary
let suddenDeathRightX = canvas.width; // dynamic inward-moving right boundary
const SUDDEN_DEATH_CLOSE_DURATION = 45000; // slowed: 45s to reach minimum width
const SUDDEN_DEATH_MIN_WIDTH = 360; // don't shrink smaller than this playable width

// Track freeplay drops (optional metric)
let freeplayDrops = 0;

// Short ceiling feature state
let shortCeilingActive = false; // True during last 10s on levels divisible by 5
let shortCeilingCountdown = false; // True during the 5s pre-countdown on those levels

// Customization system
let selectedBallSkin = localStorage.getItem('selectedBallSkin') || 'default';
let selectedCharacter = localStorage.getItem('selectedCharacter') || 'default';

// Health and defense system (will be updated after CHARACTERS is defined)
let playerHealth = 100; // Default, will be updated
let maxHealth = 100; // Default, will be updated
let shieldHealth = 0;
let maxShieldHealth = 50;
let hasShield = JSON.parse(localStorage.getItem('hasShield')) || false;

// Defense ownership (separate from equipped status)
let ownsShinGuards = JSON.parse(localStorage.getItem('ownsShinGuards')) || false;

// Unlocked items
let unlockedBallSkins = JSON.parse(localStorage.getItem('unlockedBallSkins')) || ['default'];
let unlockedCharacters = JSON.parse(localStorage.getItem('unlockedCharacters')) || ['default'];
// Restore last versus selections if valid
try {
    const _vp1 = localStorage.getItem('versusP1Character'); if (_vp1 && unlockedCharacters.includes(_vp1)) versusP1Character = _vp1;
    const _vp2 = localStorage.getItem('versusP2Character'); if (_vp2 && unlockedCharacters.includes(_vp2)) versusP2Character = _vp2;
    const _vball = localStorage.getItem('versusBallSkin'); if (_vball && unlockedBallSkins.includes(_vball)) versusBallSkin = _vball;
    const _vpts = parseInt(localStorage.getItem('versusPointsToWin'),10); if (!isNaN(_vpts) && _vpts>=1 && _vpts<=20) versusPointsToWin = _vpts;
    const _vmins = parseInt(localStorage.getItem('versusMatchMinutes'),10); if (!isNaN(_vmins) && _vmins>=1 && _vmins<=20) versusMatchMinutes = _vmins;
} catch(e) {}

// Shop items
const BALL_SKINS = {
    default: { name: 'Classic Soccer', cost: 0, color: '#FFFFFF', pattern: 'pentagon' },
    fire: { name: 'Fire Ball', cost: 50, color: '#FF4500', pattern: 'flames' },
    ice: { name: 'Ice Ball', cost: 75, color: '#87CEEB', pattern: 'crystals' },
    gold: { name: 'Golden Ball', cost: 100, color: '#FFD700', pattern: 'sparkles' },
    rainbow: { name: 'Rainbow Ball', cost: 150, color: 'rainbow', pattern: 'stripes' }
};

const CHARACTERS = {
    default: { name: 'Soccer Player', cost: 0, color: '#4169E1', health: 10 },
    ninja: { name: 'Ninja', cost: 80, color: '#2F4F4F', health: 100 },
    robot: { name: 'Robot', cost: 120, color: '#C0C0C0', health: 100 },
    superhero: { name: 'Superhero', cost: 200, color: '#DC143C', health: 100 }
};

// Update health values now that CHARACTERS is defined
maxHealth = CHARACTERS[selectedCharacter].health;
playerHealth = maxHealth;

// Defense items
const DEFENSE_ITEMS = {
    ShinGuards: { name: 'Shin Guards', cost: 500, description: 'Absorbs 25 points of damage' }
};

// Coin types with different values and rarities
const COIN_TYPES = {
    bronze: { value: 1, color: '#FFD700', rarity: 0.7 }, // 70% chance (increased)
    silver: { value: 2, color: '#C0C0C0', rarity: 0.4 }, // 20% chance  
    gold: { value: 5, color: '#CD7F32', rarity: 0.2 }, // 8% chance
    purple: { value: 10, color: '#9932CC', rarity: 0.1 } // 2% chance
};
document.getElementById('bestScore').textContent = bestScore;
document.getElementById('coins').textContent = coinsCollected;
updateTotalCoinsDisplay(); // Initialize total coins display

// Ad system
let coinMultiplierActive = false;
let coinMultiplierTimeLeft = 0;
let adPopupCooldown = 60000; // 1 minute between ad popups
let lastAdPopupTime = 0;

// Physics constants
const GRAVITY = 0.2;
const BOUNCE_DAMPING = 0.85;
const WALL_BOUNCE_DAMPING = 0.7;

// Player object
const player = {
    x: canvas.width / 2 - 60, // Adjusted for larger width (80 * 1.5 = 120, so offset is 60)
    y: canvas.height - 150, // Adjusted for larger height (100 * 1.5 = 150)
    width: 120, // 80 * 1.5
    height: 150, // 100 * 1.5
    speed: 10,
    baseSpeed: 10,
    moveLeft: false,
    moveRight: false,
    isJumping: false,
    jumpVelocity: 0,
    baseY: canvas.height - 150, // Adjusted for larger height
    jumpPower: -15,
    isCrouching: false,
    crouchHeight: 90, // 60 * 1.5
    facingDirection: 'right' // 'left' or 'right' - track which way player is facing
};

// Second player (P2) for versus mode (initial simple clone) - step 1
const player2 = {
    x: canvas.width / 2 + 140,
    y: canvas.height - 150,
    width: 120,
    height: 150,
    speed: 10,
    baseSpeed: 10,
    moveLeft: false,
    moveRight: false,
    isJumping: false,
    jumpVelocity: 0,
    baseY: canvas.height - 150,
    jumpPower: -15,
    isCrouching: false,
    crouchHeight: 90,
    facingDirection: 'left'
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 72,
    baseRadius: 72,
    vx: 0,
    vy: 0,
    speedMultiplier: 1,
    onGround: false,
    lastHitByPlayer: false
};

// Powerups
let powerups = [];
let coinsList = [];
let activePowerups = {
    doublePoints: { active: false, timeLeft: 0 },
    bigBall: { active: false, timeLeft: 0 },
    fastCrouch: { active: false, timeLeft: 0 }
};

// Powerup types
const POWERUP_TYPES = {
    DOUBLE_POINTS: 'doublePoints',
    BIG_BALL: 'bigBall',
    FAST_CROUCH: 'fastCrouch'
};

// Enemy system
let enemy = null;
let slideTacklers = []; // Changed from soccerBalls to slideTacklers
let enemyActive = false;

// Warning system for slide tacklers
let tacklerWarnings = []; // Array to store warning states
let warningPhases = {
    EARLY: { duration: 2000, exclamations: 1 }, // 2 seconds with 1 !
    URGENT: { duration: 1000, exclamations: 3 }  // 1 second with 3 !!!
};

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;
    // Player 1 (A/D/W/S/Space)
    switch(key) {
        case 'a':
            player.moveLeft = true; break;
        case 'd':
            player.moveRight = true; break;
        case 's':
            if (!player.isJumping && gameRunning && !countdownActive) player.isCrouching = true; break;
        case 'w':
        case ' ':
        case 'space':
            if (!player.isJumping && !player.isCrouching && gameRunning && !countdownActive) {
                player.isJumping = true; player.jumpVelocity = player.jumpPower;
            }
            e.preventDefault();
            break;
    }
    // Player 2 (Arrow keys) active only in versus
    if (isVersus) {
        switch(key) {
            case 'arrowleft': player2.moveLeft = true; e.preventDefault(); break;
            case 'arrowright': player2.moveRight = true; e.preventDefault(); break;
            case 'arrowdown':
                if (!player2.isJumping && gameRunning && !countdownActive) player2.isCrouching = true; e.preventDefault(); break;
            case 'arrowup':
                if (!player2.isJumping && !player2.isCrouching && gameRunning && !countdownActive) {
                    player2.isJumping = true; player2.jumpVelocity = player2.jumpPower;
                }
                e.preventDefault();
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = false;
    switch(key) {
        case 'a': player.moveLeft = false; break;
        case 'd': player.moveRight = false; break;
        case 's': player.isCrouching = false; break;
    }
    if (isVersus) {
        switch(key) {
            case 'arrowleft': player2.moveLeft = false; break;
            case 'arrowright': player2.moveRight = false; break;
            case 'arrowdown': player2.isCrouching = false; break;
        }
    }
});

// Draw soccer ball with pattern
function drawSoccerBall(x, y, radius) {
    const ballSprite = sprites.ball[selectedBallSkin];
    
    if (ballSprite && ballSprite.complete && ballSprite.naturalWidth > 0) {
        // Draw sprite if it loaded successfully - maintain aspect ratio
        const spriteSize = radius * 2;
        ctx.drawImage(
            ballSprite,
            x - radius,
            y - radius,
            spriteSize,
            spriteSize
        );
    } else {
        // Fallback to vector ball if sprite not loaded
        drawVectorBall(x, y, radius);
    }
}

// Fallback vector ball drawing (original code)
function drawVectorBall(x, y, radius) {
    const skin = BALL_SKINS[selectedBallSkin];
    
    // Draw ball base with skin color
    if (skin.color === 'rainbow') {
        // Create rainbow gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(0.17, '#FF8800');
        gradient.addColorStop(0.33, '#FFFF00');
        gradient.addColorStop(0.5, '#00FF00');
        gradient.addColorStop(0.67, '#0088FF');
        gradient.addColorStop(0.83, '#8800FF');
        gradient.addColorStop(1, '#FF0088');
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = skin.color;
    }
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pattern based on skin
    switch(skin.pattern) {
        case 'pentagon':
            drawPentagonPattern(x, y, radius);
            break;
        case 'flames':
            drawFlamePattern(x, y, radius);
            break;
        case 'crystals':
            drawCrystalPattern(x, y, radius);
            break;
        case 'sparkles':
            drawSparklePattern(x, y, radius);
            break;
        case 'stripes':
            drawStripePattern(x, y, radius);
            break;
    }
}

function drawPentagonPattern(x, y, radius) {
    ctx.fillStyle = '#000000';
    
    // Central pentagon
    ctx.beginPath();
    const centerSize = radius * 0.3;
    for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * centerSize;
        const py = y + Math.sin(angle) * centerSize;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    
    // Surrounding curved lines
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const startX = x + Math.cos(angle) * centerSize;
        const startY = y + Math.sin(angle) * centerSize;
        const endX = x + Math.cos(angle) * radius * 0.8;
        const endY = y + Math.sin(angle) * radius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(x, y, endX, endY);
        ctx.stroke();
    }
}

function drawFlamePattern(x, y, radius) {
    ctx.fillStyle = '#FF8C00';
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        const flameX = x + Math.cos(angle) * radius * 0.6;
        const flameY = y + Math.sin(angle) * radius * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(flameX, flameY);
        ctx.lineTo(flameX + Math.cos(angle) * radius * 0.3, flameY + Math.sin(angle) * radius * 0.3);
        ctx.stroke();
    }
}

function drawCrystalPattern(x, y, radius) {
    ctx.strokeStyle = '#B0E0E6';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * radius * 0.8, y + Math.sin(angle) * radius * 0.8);
        ctx.stroke();
    }
}

function drawSparklePattern(x, y, radius) {
    ctx.fillStyle = '#FFD700';
    
    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius * 0.7;
        const sparkleX = x + Math.cos(angle) * distance;
        const sparkleY = y + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawStripePattern(x, y, radius) {
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 4;
    
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(angle) * radius, y - Math.sin(angle) * radius);
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        ctx.stroke();
    }
}

// Draw player (simple stick figure with head)
function drawPlayer() {
    const centerX = player.x + player.width / 2;
    const currentHeight = player.isCrouching ? player.crouchHeight : player.height;
    const currentY = player.y + (player.height - currentHeight);
    
    const playerSprite = sprites.player[selectedCharacter];
    
    if (playerSprite && playerSprite.complete && playerSprite.naturalWidth > 0) {
        // Draw sprite if it loaded successfully - maintain aspect ratio
        const aspectRatio = playerSprite.naturalWidth / playerSprite.naturalHeight;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
            // Wider than tall - fit to width
            drawWidth = player.width;
            drawHeight = player.width / aspectRatio;
        } else {
            // Taller than wide - fit to height
            drawHeight = currentHeight;
            drawWidth = currentHeight * aspectRatio;
        }
        
        // Center the sprite
        const drawX = player.x + (player.width - drawWidth) / 2;
        const drawY = currentY + (currentHeight - drawHeight) / 2;
        
        // Save context for flipping
        ctx.save();
        
        // Flip sprite if facing left
        if (player.facingDirection === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(
                playerSprite,
                -(drawX + drawWidth), // Negative x for flipped drawing
                drawY,
                drawWidth,
                drawHeight
            );
        } else {
            ctx.drawImage(
                playerSprite,
                drawX,
                drawY,
                drawWidth,
                drawHeight
            );
        }
        
        ctx.restore();
    } else {
        // Fallback to stick figure if sprite not loaded
        // Debug: Log why we're falling back
        if (!playerSprite) {
            console.log(`No player sprite found for character: ${selectedCharacter}`);
        } else if (!playerSprite.complete) {
            console.log(`Player sprite not complete for character: ${selectedCharacter}`);
        } else if (playerSprite.naturalWidth <= 0) {
            console.log(`Player sprite has no natural width for character: ${selectedCharacter}`);
        }
        drawStickFigurePlayer();
    }
    
    // Always draw shield effect over sprite or stick figure
    if (hasShield && shieldHealth > 0) {
        const headY = currentY + 20;
        const shieldAlpha = Math.max(0.3, shieldHealth / maxShieldHealth);
        ctx.save();
        ctx.globalAlpha = shieldAlpha;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, headY, 25, 0, Math.PI * 2);
        ctx.stroke();
        
        // Shield energy lines
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const innerRadius = 20;
            const outerRadius = 25;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle) * innerRadius, headY + Math.sin(angle) * innerRadius);
            ctx.lineTo(centerX + Math.cos(angle) * outerRadius, headY + Math.sin(angle) * outerRadius);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// Basic second player drawing (simplified stick figure for step 1)
function drawSecondPlayer() {
    if (!isVersus) return;
    const p = player2;
    const centerX = p.x + p.width / 2;
    const currentHeight = p.isCrouching ? p.crouchHeight : p.height;
    const currentY = p.y + (p.height - currentHeight);
    const headY = currentY + 20;
    const bodyStartY = currentY + 40;
    const bodyEndY = currentY + (currentHeight - 25);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 6;
    ctx.fillStyle = '#FFDBAC';
    ctx.beginPath();
    ctx.arc(centerX, headY, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, bodyStartY); ctx.lineTo(centerX, bodyEndY); ctx.stroke();
    ctx.beginPath();
    if (p.isCrouching) { ctx.moveTo(centerX - 20, bodyStartY + 10); ctx.lineTo(centerX + 20, bodyStartY + 10); }
    else { ctx.moveTo(centerX - 24, bodyStartY + 20); ctx.lineTo(centerX + 24, bodyStartY + 20); }
    ctx.stroke();
    ctx.beginPath();
    if (p.isCrouching) {
        ctx.moveTo(centerX, bodyEndY); ctx.lineTo(centerX - 20, currentY + currentHeight);
        ctx.moveTo(centerX, bodyEndY); ctx.lineTo(centerX + 20, currentY + currentHeight);
    } else {
        ctx.moveTo(centerX, bodyEndY); ctx.lineTo(centerX - 16, p.y + p.height);
        ctx.moveTo(centerX, bodyEndY); ctx.lineTo(centerX + 16, p.y + p.height);
    }
    ctx.stroke();
}

// Fallback stick figure drawing (original code)
function drawStickFigurePlayer() {
    const centerX = player.x + player.width / 2;
    const currentHeight = player.isCrouching ? player.crouchHeight : player.height;
    const currentY = player.y + (player.height - currentHeight);
    
    const headY = currentY + 20;
    const bodyStartY = currentY + 40;
    const bodyEndY = currentY + (currentHeight - 25);
    
    const character = CHARACTERS[selectedCharacter];
    ctx.strokeStyle = character.color;
    ctx.lineWidth = 6;
    
    // Head
    ctx.fillStyle = selectedCharacter === 'robot' ? '#C0C0C0' : '#FFDBAC';
    ctx.beginPath();
    ctx.arc(centerX, headY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add character-specific head features
    switch(selectedCharacter) {
        case 'ninja':
            // Ninja mask
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(centerX - 12, headY - 5, 24, 8);
            break;
        case 'robot':
            // Robot eyes
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(centerX - 8, headY - 4, 4, 4);
            ctx.fillRect(centerX + 4, headY - 4, 4, 4);
            break;
        case 'superhero':
            // Cape
            ctx.fillStyle = '#DC143C';
            ctx.beginPath();
            ctx.moveTo(centerX + 16, bodyStartY);
            ctx.lineTo(centerX + 25, bodyEndY);
            ctx.lineTo(centerX + 10, bodyEndY - 10);
            ctx.closePath();
            ctx.fill();
            break;
    }
    
    // Body
    ctx.strokeStyle = character.color;
    ctx.beginPath();
    ctx.moveTo(centerX, bodyStartY);
    ctx.lineTo(centerX, bodyEndY);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    if (player.isCrouching) {
        // Arms positioned differently when crouching
        ctx.moveTo(centerX - 20, bodyStartY + 10);
        ctx.lineTo(centerX + 20, bodyStartY + 10);
    } else {
        ctx.moveTo(centerX - 24, bodyStartY + 20);
        ctx.lineTo(centerX + 24, bodyStartY + 20);
    }
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    if (player.isCrouching) {
        // Bent legs when crouching
        ctx.moveTo(centerX, bodyEndY);
        ctx.lineTo(centerX - 20, currentY + currentHeight);
        ctx.moveTo(centerX, bodyEndY);
        ctx.lineTo(centerX + 20, currentY + currentHeight);
    } else {
        ctx.moveTo(centerX, bodyEndY);
        ctx.lineTo(centerX - 16, player.y + player.height);
        ctx.moveTo(centerX, bodyEndY);
        ctx.lineTo(centerX + 16, player.y + player.height);
    }
    ctx.stroke();
}

// Draw ground
function drawGround() {
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Draw grass texture
    ctx.strokeStyle = '#32CD32';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 30);
        ctx.lineTo(i + 3, canvas.height - 35);
        ctx.stroke();
    }
}

// Update health and shield bars (now HTML elements instead of canvas drawing)
function updateHealthBars() {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    const shieldBar = document.getElementById('shieldBar');
    const shieldFill = document.getElementById('shieldFill');
    const shieldText = document.getElementById('shieldText');
    
    if (healthFill && healthText) {
        // Update health bar
        const healthPercent = (playerHealth / maxHealth) * 100;
        healthFill.style.width = healthPercent + '%';
        healthText.textContent = `Health: ${playerHealth}/${maxHealth}`;
        
        // Change health bar color based on health level
        healthFill.className = 'bar-fill health-fill';
        if (healthPercent <= 25) {
            healthFill.classList.add('critical');
        } else if (healthPercent <= 50) {
            healthFill.classList.add('low');
        }
    }
    
    // Update shield bar (only if player has shield)
    if (hasShield && shieldBar && shieldFill && shieldText) {
        shieldBar.style.display = 'flex';
        const shieldPercent = (shieldHealth / maxShieldHealth) * 100;
        shieldFill.style.width = shieldPercent + '%';
        shieldText.textContent = `Shield: ${shieldHealth}/${maxShieldHealth}`;
    } else if (shieldBar) {
        shieldBar.style.display = 'none';
    }
}

// New: Update level bar (HTML)
function updateLevelBar() {
    const levelFill = document.getElementById('levelFill');
    const levelText = document.getElementById('levelText');
    if (!levelFill || !levelText) return;
    if (isFreeplay) {
        levelFill.style.width = '100%';
        levelText.textContent = 'Freeplay — Endless';
        return;
    }
    const timeUntilNext = Math.max(0, timeToNextLevel);
    const secondsRemaining = Math.ceil(timeUntilNext / 1000);
    const progress = 1 - (timeUntilNext / 30000); // 0 to 1 over the 30s level duration
    const percent = Math.max(0, Math.min(100, progress * 100));
    levelFill.style.width = percent + '%';
    levelText.textContent = `Level ${currentLevel} — Next: ${secondsRemaining}s`;
}

// Draw countdown
function drawCountdown() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (countdownValue > 0) {
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 120px Arial';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeText(countdownValue.toString(), canvas.width / 2, canvas.height / 2);
        ctx.fillText(countdownValue.toString(), canvas.width / 2, canvas.height / 2);
    } else {
        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 100px Arial';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeText('GO!', canvas.width / 2, canvas.height / 2);
        ctx.fillText('GO!', canvas.width / 2, canvas.height / 2);
    }
}

// Create random powerup
function createPowerup() {
    // Fast Crouch is rare (10% chance), others are common
    let type;
    const randomValue = Math.random();
    if (randomValue < 0.1) {
        type = POWERUP_TYPES.FAST_CROUCH; // 10% chance
    } else if (randomValue < 0.55) {
        type = POWERUP_TYPES.DOUBLE_POINTS; // 45% chance
    } else {
        type = POWERUP_TYPES.BIG_BALL; // 45% chance
    }
    
    powerups.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height / 2) + 50, // Top half only
        width: 30,
        height: 30,
        type: type,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        lifeTime: 15000 // 15 seconds
    });
}

// Create coin
function createCoin() {
    // Determine coin type based on rarity
    const random = Math.random();
    let coinType = 'bronze'; // default
    
    if (random < COIN_TYPES.purple.rarity) {
        coinType = 'purple';
    } else if (random < COIN_TYPES.purple.rarity + COIN_TYPES.gold.rarity) {
        coinType = 'gold';
    } else if (random < COIN_TYPES.purple.rarity + COIN_TYPES.gold.rarity + COIN_TYPES.silver.rarity) {
        coinType = 'silver';
    } else {
        coinType = 'bronze';
    }
    
    
    const coinX = Math.random() * (canvas.width - 100) + 50; // Leave more space for protected coins
    const coinY = Math.random() * (canvas.height / 2) + 50;
    
    if (coinType === 'purple') {
        // Create protected purple coin with 8 surrounding blocks
        const protectedCoin = {
            x: coinX,
            y: coinY,
            radius: 15,
            lifeTime: 30000, // 30 seconds for purple coins
            alpha: 1.0,
            type: coinType,
            value: COIN_TYPES[coinType].value,
            isProtected: true,
            blocks: []
        };
        
        // Create 8 protective blocks around the coin
        const blockRadius = 25; // Distance from coin center
        const blockSize = 15;
        for (let i = 0; i < 8; i++) {
            const angle = (i * 2 * Math.PI) / 8;
            const blockX = coinX + Math.cos(angle) * blockRadius;
            const blockY = coinY + Math.sin(angle) * blockRadius;
            
            protectedCoin.blocks.push({
                x: blockX,
                y: blockY,
                size: blockSize,
                hits: 0,
                maxHits: 1, // Only 1 hit needed to destroy
                alpha: 1.0
            });
        }
        
        coinsList.push(protectedCoin);
    } else {
        // Regular coin
        coinsList.push({
            x: coinX,
            y: coinY,
            radius: 15,
            lifeTime: 5000, // 5 seconds
            alpha: 1.0,
            type: coinType,
            value: COIN_TYPES[coinType].value,
            isProtected: false
        });
    }
}

// Draw powerups
function drawPowerups() {
    powerups.forEach(powerup => {
        const powerupSprite = sprites.powerups[powerup.type];
        
        if (powerupSprite && powerupSprite.complete && powerupSprite.naturalWidth > 0) {
            // Draw sprite if it loaded successfully - maintain aspect ratio
            const aspectRatio = powerupSprite.naturalWidth / powerupSprite.naturalHeight;
            let drawWidth, drawHeight;
            
            if (aspectRatio > 1) {
                // Wider than tall - fit to width
                drawWidth = powerup.width;
                drawHeight = powerup.width / aspectRatio;
            } else {
                // Taller than wide - fit to height
                drawHeight = powerup.height;
                drawWidth = powerup.height * aspectRatio;
            }
            
            // Center the sprite
            const drawX = powerup.x + (powerup.width - drawWidth) / 2;
            const drawY = powerup.y + (powerup.height - drawHeight) / 2;
            
            ctx.drawImage(
                powerupSprite,
                drawX,
                drawY,
                drawWidth,
                drawHeight
            );
        } else {
            // Fallback to geometric shapes
            drawVectorPowerup(powerup);
        }
    });
}

// Fallback powerup drawing (original code)
function drawVectorPowerup(powerup) {
    ctx.save();
    ctx.fillStyle = getPowerupColor(powerup.type);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Draw powerup box
    ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    ctx.strokeRect(powerup.x, powerup.y, powerup.width, powerup.height);
    
    // Draw powerup symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const symbol = getPowerupSymbol(powerup.type);
    ctx.fillText(symbol, powerup.x + powerup.width/2, powerup.y + powerup.height/2);
    
    ctx.restore();
}

// Draw coins
function drawCoins() {
    coinsList.forEach(coin => {
        ctx.save();
        ctx.globalAlpha = coin.alpha;
        
        const coinData = COIN_TYPES[coin.type];
        const coinSprite = sprites.coins[coin.type];
        
        // Draw protective blocks first (so they appear behind the coin)
        if (coin.isProtected && coin.blocks) {
            coin.blocks.forEach(block => {
                if (block.hits < block.maxHits) {
                    ctx.save();
                    
                    // Color gets lighter with each hit
                    const grayValue = block.hits === 0 ? 0 : 64; // Black -> Dark Gray
                    ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    
                    // Draw block as a square
                    ctx.fillRect(block.x - block.size/2, block.y - block.size/2, block.size, block.size);
                    ctx.strokeRect(block.x - block.size/2, block.y - block.size/2, block.size, block.size);
                    
                    ctx.restore();
                }
            });
        }
        
        if (coinSprite && coinSprite.complete && coinSprite.naturalWidth > 0) {
            // Draw coin sprite if it loaded successfully - maintain aspect ratio
            const spriteSize = coin.radius * 2;
            ctx.drawImage(
                coinSprite,
                coin.x - coin.radius,
                coin.y - coin.radius,
                spriteSize,
                spriteSize
            );
        } else {
            // Fallback to circle drawing
            drawVectorCoin(coin);
        }
        
        ctx.restore();
    });
}

// Fallback coin drawing (original code)
function drawVectorCoin(coin) {
    const coinData = COIN_TYPES[coin.type];
    
    // Draw coin with type-specific color
    ctx.fillStyle = coinData.color;
    ctx.strokeStyle = coin.type === 'bronze' ? '#FFA500' : 
                     coin.type === 'silver' ? '#A0A0A0' :
                     coin.type === 'gold' ? '#B8860B' : '#7B68EE';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw value number prominently
    ctx.fillStyle = coin.type === 'silver' ? '#333333' : '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = coin.type === 'silver' ? '#FFFFFF' : '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText(coin.value.toString(), coin.x, coin.y);
    ctx.fillText(coin.value.toString(), coin.x, coin.y);
}

// Draw off-screen ball indicator
function drawBallIndicator() {
    if (ball.y + ball.radius < 0) {
        // Ball is above the screen
        const distanceAbove = Math.abs(ball.y + ball.radius);
        const maxDistance = 300; // Maximum distance to show indicator
        const minSize = 15;
        const maxSize = 40;
        
        // Calculate arrow size based on distance (closer = bigger)
        const normalizedDistance = Math.min(distanceAbove / maxDistance, 1);
        const arrowSize = maxSize - (normalizedDistance * (maxSize - minSize));
        
        // Position arrow above the ball's horizontal position
        const arrowX = Math.max(arrowSize, Math.min(canvas.width - arrowSize, ball.x));
        const arrowY = 20;
        
        // Draw arrow pointing down
        ctx.fillStyle = '#FF4500';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY + arrowSize);
        ctx.lineTo(arrowX - arrowSize/2, arrowY);
        ctx.lineTo(arrowX + arrowSize/2, arrowY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add distance text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(distanceAbove)}px`, arrowX, arrowY + arrowSize + 15);
    }
}

// Get powerup color
function getPowerupColor(type) {
    switch(type) {
        case POWERUP_TYPES.DOUBLE_POINTS: return '#FFD700';
        case POWERUP_TYPES.BIG_BALL: return '#32CD32';
        case POWERUP_TYPES.FAST_CROUCH: return '#9932CC'; // Purple for rare powerup
        default: return '#808080';
    }
}

// Get powerup symbol
function getPowerupSymbol(type) {
    switch(type) {
        case POWERUP_TYPES.DOUBLE_POINTS: return '2X';
        case POWERUP_TYPES.BIG_BALL: return '⚽';
        case POWERUP_TYPES.FAST_CROUCH: return '🏃'; // Running person for crouch speed
        default: return '?';
    }
}

// Update player position
function updatePlayer() {
    // Horizontal movement (slower while crouching unless Fast Crouch is active)
    const crouchSpeedMultiplier = activePowerups.fastCrouch.active ? 1.0 : 0.6; // Normal speed with Fast Crouch
    const currentSpeed = player.isCrouching ? player.speed * crouchSpeedMultiplier : player.speed;
    
    if (player.moveLeft && player.x > 0) {
        player.x -= currentSpeed;
        player.facingDirection = 'left'; // Update facing direction
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += currentSpeed;
        player.facingDirection = 'right'; // Update facing direction
    }
    
    // Jumping physics
    if (player.isJumping) {
        player.jumpVelocity += 0.8; // Gravity for jumping
        player.y += player.jumpVelocity;
        
        // Land when reaching ground level
        if (player.y >= player.baseY) {
            player.y = player.baseY;
            player.isJumping = false;
            player.jumpVelocity = 0;
        }
    }
}

function updatePlayer2() {
    if (!isVersus) return;
    const p = player2;
    const crouchSpeedMultiplier = activePowerups.fastCrouch.active ? 1.0 : 0.6;
    const currentSpeed = p.isCrouching ? p.speed * crouchSpeedMultiplier : p.speed;
    if (p.moveLeft && p.x > 0) { p.x -= currentSpeed; p.facingDirection = 'left'; }
    if (p.moveRight && p.x < canvas.width - p.width) { p.x += currentSpeed; p.facingDirection = 'right'; }
    if (p.isJumping) {
        p.jumpVelocity += 0.8;
        p.y += p.jumpVelocity;
        if (p.y >= p.baseY) { p.y = p.baseY; p.isJumping = false; p.jumpVelocity = 0; }
    }
}

// Update powerups
function updatePowerups() {
    // Move powerups
    powerups.forEach(powerup => {
        powerup.x += powerup.vx;
        powerup.y += powerup.vy;
        
        // Bounce off walls
        if (powerup.x <= 0 || powerup.x >= canvas.width - powerup.width) {
            powerup.vx *= -1;
        }
        if (powerup.y <= 0 || powerup.y >= canvas.height - 50) {
            powerup.vy *= -1;
        }
        
        powerup.lifeTime -= 16; // Approximate frame time
    });
    
    // Remove expired powerups
    powerups = powerups.filter(powerup => powerup.lifeTime > 0);
    
    // Update coins
    coinsList.forEach(coin => {
        coin.lifeTime -= 16;
        // Start fading in last 2 seconds
        if (coin.lifeTime < 2000) {
            coin.alpha = coin.lifeTime / 2000;
        }
    });
    
    // Remove expired coins
    coinsList = coinsList.filter(coin => coin.lifeTime > 0);
    
    // Update active powerup timers
    Object.keys(activePowerups).forEach(key => {
        if (activePowerups[key].active) {
            activePowerups[key].timeLeft -= 16;
            if (activePowerups[key].timeLeft <= 0) {
                deactivatePowerup(key);
            }
        }
    });
    
    updatePowerupDisplay();
}

// Check if any powerups are currently active
function hasActivePowerups() {
    return Object.values(activePowerups).some(powerup => powerup.active);
}

// Check collision between ball and player's head
function checkPlayerCollision() {
    // Internal helper
    function collide(p) {
        const playerCenterX = p.x + p.width / 2;
        const playerHeadY = p.y + 20;
        const headRadius = 16;
        const dx = ball.x - playerCenterX;
        const dy = ball.y - playerHeadY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ball.radius + headRadius) {
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            const bounceSpeed = Math.max(speed * 0.8, 6);
            const randomFactor = (Math.random() - 0.5) * 0.2;
            const playerInfluence = p.moveLeft ? -2 : p.moveRight ? 2 : 0;
            const jumpBonus = p.isJumping ? -3 : 0;
            const crouchPenalty = p.isCrouching ? 0.5 : 1;
            ball.vx = Math.cos(angle) * bounceSpeed + playerInfluence + randomFactor;
            ball.vy = (Math.sin(angle) * bounceSpeed - 3 + jumpBonus) * crouchPenalty;
            const minBounce = p.isJumping ? -7 : (p.isCrouching ? -2 : -4);
            if (ball.vy > -1.5) ball.vy = minBounce;
            ball.x = playerCenterX + Math.cos(angle) * (ball.radius + headRadius + 2);
            ball.y = playerHeadY + Math.sin(angle) * (ball.radius + headRadius + 2);
            if (!ball.lastHitByPlayer) {
                const points = activePowerups.doublePoints.active ? 2 : 1;
                score += points;
                document.getElementById('score').textContent = score;
                ball.lastHitByPlayer = true;
                const baseChance = 0.05;
                const scoreBonus = Math.floor(score / 10) * 0.01;
                const maxChance = 0.25;
                const tackleChance = Math.min(baseChance + scoreBonus, maxChance);
                if (!shortCeilingActive && !shortCeilingCountdown && !enemyActive && Math.random() < tackleChance) {
                    createEnemy();
                }
            }
        }
    }
    collide(player);
    if (isVersus) collide(player2);
}

// Check powerup and coin collisions
function checkPowerupCollisions() {
    // Check powerup collisions
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        const dx = ball.x - (powerup.x + powerup.width/2);
        const dy = ball.y - (powerup.y + powerup.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + 15) {
            activatePowerup(powerup.type);
            powerups.splice(i, 1);
        }
    }
    
    // Check coin collisions
    for (let i = coinsList.length - 1; i >= 0; i--) {
        const coin = coinsList[i];
        
        // Check protective blocks first if this is a protected coin
        if (coin.isProtected && coin.blocks) {
            // Check collision with blocks first
            for (let j = coin.blocks.length - 1; j >= 0; j--) {
                const block = coin.blocks[j];
                
                if (block.hits < block.maxHits) {
                    // Check collision with block
                    const blockDx = ball.x - block.x;
                    const blockDy = ball.y - block.y;
                    const blockDistance = Math.sqrt(blockDx * blockDx + blockDy * blockDy);
                    
                    if (blockDistance < ball.radius + block.size/2) {
                        // Hit the block - destroy it immediately (1 hit)
                        block.hits = block.maxHits;
                        
                        // Bounce ball away from block
                        const angle = Math.atan2(blockDy, blockDx);
                        const bounceSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * 0.8;
                        ball.vx = Math.cos(angle) * bounceSpeed;
                        ball.vy = Math.sin(angle) * bounceSpeed;
                        
                        // Move ball away from block
                        ball.x = block.x + Math.cos(angle) * (ball.radius + block.size/2 + 2);
                        ball.y = block.y + Math.sin(angle) * (ball.radius + block.size/2 + 2);
                        
                        break; // Only hit one block per frame
                    }
                }
            }
            
            // Remove destroyed blocks
            coin.blocks = coin.blocks.filter(block => block.hits < block.maxHits);
            
            // Check if ball can reach coin (through gaps or no blocks left)
            const dx = ball.x - coin.x;
            const dy = ball.y - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ball.radius + coin.radius) {
                // Check if any remaining blocks are blocking the path to the coin
                let blockedByBlock = false;
                
                for (const block of coin.blocks) {
                    if (block.hits < block.maxHits) {
                        // Check if this block is between ball and coin
                        const ballToCoinAngle = Math.atan2(coin.y - ball.y, coin.x - ball.x);
                        const ballToBlockAngle = Math.atan2(block.y - ball.y, block.x - ball.x);
                        const coinToBlockDist = Math.sqrt((coin.x - block.x) ** 2 + (coin.y - block.y) ** 2);
                        
                        // If block is close to the line between ball and coin, it might be blocking
                        const angleDiff = Math.abs(ballToCoinAngle - ballToBlockAngle);
                        const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff);
                        
                        if (normalizedAngleDiff < 0.3 && coinToBlockDist < 20) { // Block is roughly in the way
                            blockedByBlock = true;
                            break;
                        }
                    }
                }
                
                if (!blockedByBlock) {
                    // Coin can be collected!
                    const baseValue = coin.value || 1;
                    const coinsToAdd = coinMultiplierActive ? baseValue * 2 : baseValue;
                    coinsCollected += coinsToAdd;
                    if (!isFreeplay) {
                        totalCoins += coinsToAdd;
                        localStorage.setItem('totalCoins', totalCoins);
                    }
                    document.getElementById('coins').textContent = coinsCollected;
                    updateTotalCoinsDisplay();
                    coinsList.splice(i, 1);
                    
                    // Save to cloud if authenticated (debounced)
                    if (isAuthenticated) {
                        clearTimeout(window.coinSaveTimeout);
                        window.coinSaveTimeout = setTimeout(saveUserData, 2000);
                    }
                }
            }
        } else {
            // Regular coin collision (non-protected)
            const dx = ball.x - coin.x;
            const dy = ball.y - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ball.radius + coin.radius) {
                const baseValue = coin.value || 1;
                const coinsToAdd = coinMultiplierActive ? baseValue * 2 : baseValue;
                coinsCollected += coinsToAdd;
                if (!isFreeplay) {
                    totalCoins += coinsToAdd;
                    localStorage.setItem('totalCoins', totalCoins);
                }
                document.getElementById('coins').textContent = coinsCollected;
                updateTotalCoinsDisplay();
                coinsList.splice(i, 1);
                
                // Save to cloud if authenticated (debounced)
                if (isAuthenticated) {
                    clearTimeout(window.coinSaveTimeout);
                    window.coinSaveTimeout = setTimeout(saveUserData, 2000);
                }
            }
        }
        
        // Reset ball if 10 coins collected
        if (coinsCollected >= 10) {
            // Reset ball properties but respect current difficulty level
            ball.speedMultiplier = 1;
            coinsCollected = 0;
            document.getElementById('coins').textContent = coinsCollected;
            
            // Only reset ball size if big ball powerup is not active
            if (!activePowerups.bigBall.active) {
                // Reset to base size first, then apply current difficulty
                ball.radius = ball.baseRadius;
                updateBallDifficulty(); // This will apply the correct size for current time
            }
        }
    }
}

// Shop and customization functions
function updateTotalCoinsDisplay() {
    const totalCoinsElement = document.getElementById('totalCoins');
    const totalCoinsShopElement = document.getElementById('totalCoinsShop');
    if (totalCoinsElement) {
        totalCoinsElement.textContent = totalCoins;
    }
    if (totalCoinsShopElement) {
        totalCoinsShopElement.textContent = totalCoins;
    }
}

function buyItem(itemType, itemId) {
    if (itemType === 'defense') {
        const item = DEFENSE_ITEMS[itemId];
        if (itemId === 'ShinGuards' && totalCoins >= item.cost && !ownsShinGuards) {
            totalCoins -= item.cost;
            ownsShinGuards = true; // Mark as owned
            hasShield = true; // Also equip them
            shieldHealth = maxShieldHealth; // Start with full shield
            localStorage.setItem('totalCoins', totalCoins);
            localStorage.setItem('ownsShinGuards', JSON.stringify(ownsShinGuards));
            localStorage.setItem('hasShield', JSON.stringify(hasShield));
            updateTotalCoinsDisplay();
            updateShopDisplay();
            updateHealthBars(); // Update health bars display
            
            // Save to cloud if authenticated
            if (isAuthenticated) {
                saveUserData();
            }
            
            return true;
        }
        return false;
    }
    
    const items = itemType === 'ball' ? BALL_SKINS : CHARACTERS;
    const item = items[itemId];
    const unlockedArray = itemType === 'ball' ? unlockedBallSkins : unlockedCharacters;
    const storageKey = itemType === 'ball' ? 'unlockedBallSkins' : 'unlockedCharacters';
    
    if (totalCoins >= item.cost && !unlockedArray.includes(itemId)) {
        totalCoins -= item.cost;
        unlockedArray.push(itemId);
        localStorage.setItem('totalCoins', totalCoins);
        localStorage.setItem(storageKey, JSON.stringify(unlockedArray));
        updateTotalCoinsDisplay();
        updateShopDisplay();
        
        // Save to cloud if authenticated
        if (isAuthenticated) {
            saveUserData();
        }
        
        return true;
    }
    return false;
}

function selectItem(itemType, itemId) {
    const unlockedArray = itemType === 'ball' ? unlockedBallSkins : unlockedCharacters;
    
    if (unlockedArray.includes(itemId)) {
        if (itemType === 'ball') {
            selectedBallSkin = itemId;
            localStorage.setItem('selectedBallSkin', itemId);
        } else {
            selectedCharacter = itemId;
            localStorage.setItem('selectedCharacter', itemId);
            
            // Update health when character changes
            maxHealth = CHARACTERS[selectedCharacter].health;
            playerHealth = Math.min(playerHealth, maxHealth); // Don't exceed new max health
            updateHealthBars(); // Update health bars display
        }
        updateShopDisplay();
        
        // Save to cloud if authenticated
        if (isAuthenticated) {
            saveUserData();
        }
        
        return true;
    }
    return false;
}

function unequipItem(itemType, itemId) {
    if (itemType === 'defense' && itemId === 'ShinGuards' && ownsShinGuards && hasShield) {
        // Unequip shin guards (but keep ownership)
        hasShield = false;
        shieldHealth = 0;
        localStorage.setItem('hasShield', JSON.stringify(hasShield));
        updateShopDisplay();
        updateHealthBars(); // Update health bars display
        
        // Save to cloud if authenticated
        if (isAuthenticated) {
            saveUserData();
        }
        
        return true;
    }
    return false;
}

function equipItem(itemType, itemId) {
    if (itemType === 'defense' && itemId === 'ShinGuards' && ownsShinGuards && !hasShield) {
        // Equip shin guards
        hasShield = true;
        shieldHealth = maxShieldHealth; // Start with full shield
        localStorage.setItem('hasShield', JSON.stringify(hasShield));
        updateShopDisplay();
        updateHealthBars(); // Update health bars display
        
        // Save to cloud if authenticated
        if (isAuthenticated) {
            saveUserData();
        }
        
        return true;
    }
    return false;
}

function toggleShop() {
    const shopModal = document.getElementById('shopModal');
    if (shopModal.style.display === 'block') {
        shopModal.style.display = 'none';
    } else {
        shopModal.style.display = 'block';
        updateShopDisplay();
    }
}

function updateShopDisplay() {
    updateTotalCoinsDisplay();
    updateBallSkinsDisplay();
    updateCharactersDisplay();
    updateDefenseDisplay();
}

function updateBallSkinsDisplay() {
    const container = document.getElementById('ballSkinsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    Object.keys(BALL_SKINS).forEach(skinId => {
        const skin = BALL_SKINS[skinId];
        const isUnlocked = unlockedBallSkins.includes(skinId);
        const isSelected = selectedBallSkin === skinId;
        
        const skinDiv = document.createElement('div');
        skinDiv.className = `shop-item ${isSelected ? 'selected' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        skinDiv.innerHTML = `
            <div class="item-preview" style="background: ${skin.color === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)' : skin.color}"></div>
            <div class="item-name">${skin.name}</div>
            <div class="item-action">
                ${isUnlocked ? 
                    (isSelected ? 'Selected' : `<button onclick="selectItem('ball', '${skinId}')">Select</button>`) :
                    `<button onclick="buyItem('ball', '${skinId}')" ${totalCoins >= skin.cost ? '' : 'disabled'}>Buy ${skin.cost} coins</button>`
                }
            </div>
        `;
        
        container.appendChild(skinDiv);
    });
}

function updateCharactersDisplay() {
    const container = document.getElementById('charactersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    Object.keys(CHARACTERS).forEach(charId => {
        const character = CHARACTERS[charId];
        const isUnlocked = unlockedCharacters.includes(charId);
        const isSelected = selectedCharacter === charId;
        
        const charDiv = document.createElement('div');
        charDiv.className = `shop-item ${isSelected ? 'selected' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        charDiv.innerHTML = `
            <div class="item-preview character-preview" style="background: ${character.color}"></div>
            <div class="item-name">${character.name}</div>
            <div class="item-description">Health: ${character.health}</div>
            <div class="item-action">
                ${isUnlocked ? 
                    (isSelected ? 'Selected' : `<button onclick="selectItem('character', '${charId}')">Select</button>`) :
                    `<button onclick="buyItem('character', '${charId}')" ${totalCoins >= character.cost ? '' : 'disabled'}>Buy ${character.cost} coins</button>`
                }
            </div>
        `;
        
        container.appendChild(charDiv);
    });
}

function updateDefenseDisplay() {
    const container = document.getElementById('defenseContainer');
    if (!container) return;
    
    container.innerHTML = '';
    Object.keys(DEFENSE_ITEMS).forEach(itemId => {
        const item = DEFENSE_ITEMS[itemId];
        const isOwned = itemId === 'ShinGuards' ? ownsShinGuards : false;
        const isEquipped = itemId === 'ShinGuards' ? hasShield : false;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `shop-item ${isOwned ? 'unlocked' : 'locked'}`;
        
        let actionButton = '';
        if (!isOwned) {
            // Not owned - show buy button
            actionButton = `<button onclick="buyItem('defense', '${itemId}')" ${totalCoins >= item.cost ? '' : 'disabled'}>Buy ${item.cost} coins</button>`;
        } else if (isEquipped) {
            // Owned and equipped - show unequip button
            actionButton = `<button onclick="unequipItem('defense', '${itemId}')" class="unequip-btn">Unequip</button>`;
        } else {
            // Owned but not equipped - show equip button
            actionButton = `<button onclick="equipItem('defense', '${itemId}')" class="equip-btn">Equip</button>`;
        }
        
        itemDiv.innerHTML = `
            <div class="item-preview defense-preview" style="background: linear-gradient(45deg, #00FFFF, #0088FF)"></div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-action">
                ${actionButton}
            </div>
        `;
        
        container.appendChild(itemDiv);
    });
}

// Ad system functions
function showAdPopup() {
    const currentTime = Date.now();
    if (isVersus) return; // never show during 1v1
    if (currentTime - lastAdPopupTime >= adPopupCooldown && !coinMultiplierActive) {
        document.getElementById('adPopup').style.display = 'block';
        lastAdPopupTime = currentTime;
    }
}

function closeAdPopup() {
    document.getElementById('adPopup').style.display = 'none';
}

function watchRewardedAd() {
    // Simulate watching a 30-second ad
    closeAdPopup();
    
    // In a real implementation, you would call:
    // - AdMob: googletag.cmd.push(function() { ... });
    // - Unity Ads: unityAds.show({ ... });
    // - AppLovin: applovin.showRewardedAd({ ... });
    
    alert('Ad is playing... (30 seconds)');
    
    // Simulate ad completion after 2 seconds (for demo purposes)
    setTimeout(() => {
        activateCoinMultiplier();
        alert('Ad completed! You now have 2X coins for 5 minutes!');
    }, 2000);
}

function activateCoinMultiplier() {
    coinMultiplierActive = true;
    coinMultiplierTimeLeft = 300000; // 5 minutes in milliseconds
}

function updateCoinMultiplier() {
    if (coinMultiplierActive) {
        coinMultiplierTimeLeft -= 16; // Approximate frame time
        if (coinMultiplierTimeLeft <= 0) {
            coinMultiplierActive = false;
            coinMultiplierTimeLeft = 0;
        }
    }
}

// Activate powerup
function activatePowerup(type) {
    switch(type) {
        case POWERUP_TYPES.DOUBLE_POINTS:
            activePowerups.doublePoints = { active: true, timeLeft: 10000 };
            break;
        case POWERUP_TYPES.BIG_BALL:
            activePowerups.bigBall = { active: true, timeLeft: 15000 };
            ball.radius = ball.baseRadius * 2;
            break;
        case POWERUP_TYPES.FAST_CROUCH:
            activePowerups.fastCrouch = { active: true, timeLeft: 30000 }; // 30 seconds
            break;
    }
}

// Deactivate powerup
function deactivatePowerup(type) {
    activePowerups[type].active = false;
    activePowerups[type].timeLeft = 0;
    
    switch(type) {
        case 'bigBall':
            // Reset ball to size appropriate for current level-based difficulty
            const difficultyLevel = currentLevel - 1; // Level 1 = difficulty 0, Level 2 = difficulty 1, etc.
            ball.radius = ball.baseRadius - (difficultyLevel * ball.baseRadius * 0.1);
            if (ball.radius < 10) ball.radius = 10;
            break;
        // Fast Crouch doesn't need deactivation logic - just timer expires
    }
}

// Update powerup display
function updatePowerupDisplay() {
    const timersDiv = document.getElementById('powerupTimers');
    timersDiv.innerHTML = '';
    
    // Show active powerups
    Object.keys(activePowerups).forEach(key => {
        if (activePowerups[key].active) {
            const timer = document.createElement('div');
            timer.className = `timer ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            const timeLeft = Math.ceil(activePowerups[key].timeLeft / 1000);
            
            let name = '';
            switch(key) {
                case 'doublePoints': name = 'Double Points'; break;
                case 'bigBall': name = 'Big Ball'; break;
                case 'fastCrouch': name = 'Fast Crouch'; break;
            }
            
            timer.textContent = `${name}: ${timeLeft}s`;
            timersDiv.appendChild(timer);
        }
    });
    
    // Show coin multiplier if active
    if (coinMultiplierActive) {
        const timer = document.createElement('div');
        timer.className = 'timer coin-multiplier';
        const timeLeft = Math.ceil(coinMultiplierTimeLeft / 1000);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.textContent = `2X Coins: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        timersDiv.appendChild(timer);
    }
}

// Update ball physics
function updateBall() {
    // Freeze ball entirely between versus points (no physics updates)
    if (isVersus && versusBetweenPoints) return;
    // Apply gravity with speed multiplier
    ball.vy += GRAVITY * ball.speedMultiplier;
    
    // Update position with speed multiplier
    ball.x += ball.vx * ball.speedMultiplier;
    ball.y += ball.vy * ball.speedMultiplier;
    
    // Wall collision (or goal portals in versus)
    if (isVersus) {
        // Update shrinking walls during sudden death
        if (versusSuddenDeath && suddenDeathStartTime) {
            const elapsedSD = performance.now() - suddenDeathStartTime;
            const t = Math.min(1, elapsedSD / SUDDEN_DEATH_CLOSE_DURATION);
            const targetWidth = Math.max(SUDDEN_DEATH_MIN_WIDTH, canvas.width * (1 - 0.5 * t)); // shrink to 50% width or min
            const margin = (canvas.width - targetWidth) / 2;
            suddenDeathLeftX = margin;
            suddenDeathRightX = canvas.width - margin;
        }

        if (versusSuddenDeath) {
            // Entire shrinking walls act as goals on contact (touch = score)
            if (ball.x - ball.radius <= suddenDeathLeftX) {
                // P2 scores (left side)
                versusP2Score++; const el = document.getElementById('p2Score'); if (el) el.textContent = versusP2Score; versusServer = 1; handleVersusPointScored(2); return;
            }
            if (ball.x + ball.radius >= suddenDeathRightX) {
                // P1 scores (right side)
                versusP1Score++; const el = document.getElementById('p1Score'); if (el) el.textContent = versusP1Score; versusServer = 2; handleVersusPointScored(1); return;
            }
            // Solid ceiling in sudden death (bounce)
            if (ball.y - ball.radius <= 0) {
                ball.y = ball.radius;
                ball.vy = Math.abs(ball.vy) * WALL_BOUNCE_DAMPING; // reflect downward
            }
        } else {
            const top = VERSUS_GOAL.top;
            const bottom = top + VERSUS_GOAL.height;
            // Left goal: score only when ball fully crosses plane (x + radius < 0) AND within vertical aperture
            if (ball.x + ball.radius < 0 && ball.y >= top && ball.y <= bottom) {
                versusP2Score++; const el = document.getElementById('p2Score'); if (el) el.textContent = versusP2Score; versusServer = 1; handleVersusPointScored(2); return;
            }
            // Right goal: full pass-through (x - radius > canvas.width)
            if (ball.x - ball.radius > canvas.width && ball.y >= top && ball.y <= bottom) {
                versusP1Score++; const el = document.getElementById('p1Score'); if (el) el.textContent = versusP1Score; versusServer = 2; handleVersusPointScored(1); return;
            }
            // Handle bounces if not inside aperture & touching wall
            if (ball.x - ball.radius <= 0 && !(ball.y >= top && ball.y <= bottom)) {
                ball.x = ball.radius; ball.vx = Math.abs(ball.vx) * WALL_BOUNCE_DAMPING;
            } else if (ball.x + ball.radius >= canvas.width && !(ball.y >= top && ball.y <= bottom)) {
                ball.x = canvas.width - ball.radius; ball.vx = -Math.abs(ball.vx) * WALL_BOUNCE_DAMPING;
            }
            // Solid full ceiling in versus (non-sudden death)
            if (ball.y - ball.radius <= 0) {
                ball.y = ball.radius;
                ball.vy = Math.abs(ball.vy) * WALL_BOUNCE_DAMPING; // reflect downward
            }
        }
    } else {
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx) * WALL_BOUNCE_DAMPING;
        } else if (ball.x + ball.radius >= canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx = -Math.abs(ball.vx) * WALL_BOUNCE_DAMPING;
        }
    }

    // New: Ceiling collision when short ceiling is active
    if (shortCeilingActive && !versusSuddenDeath) { // disable short ceiling during sudden death
        const ceilingBottom = Math.floor(canvas.height * 0.25); // Top 1/4 blocked
        const effectiveRadiusTop = ball.radius; // Use actual current radius
        if (ball.y - effectiveRadiusTop <= ceilingBottom) {
            ball.y = ceilingBottom + effectiveRadiusTop;
            ball.vy = Math.abs(ball.vy) * WALL_BOUNCE_DAMPING; // Bounce downward
        }
    }
    
    // Ground collision (game over) - use base radius for consistent collision detection
    const effectiveRadius = ball.radius; // Always use actual current radius
    if (ball.y + effectiveRadius >= canvas.height - 30) {
        ball.y = canvas.height - 30 - effectiveRadius;
        if (isFreeplay || isVersus) {
            // Bounce off ground (no point, continuous rally in versus)
            ball.vy = -Math.abs(ball.vy) * BOUNCE_DAMPING;
            if (Math.abs(ball.vy) < 4) ball.vy = -4; // Minimum bounce energy
            ball.vx *= 0.95; // horizontal friction
            ball.onGround = false;
        } else {
            ball.vy = 0;
            ball.vx = 0;
            ball.onGround = true;
            endGame();
        }
    }
    
    // Reset player hit flag when ball is moving upward
    if (ball.vy < 0) {
        ball.lastHitByPlayer = false;
    }
}

// After a versus point has been scored, decide whether match ends or start next countdown
function handleVersusPointScored(scoringPlayer) {
    if (!isVersus || versusMatchEnded) return;
    // Check immediate points win (only if not sudden death; in sudden death any point ends match)
    if (!versusSuddenDeath) {
        if (versusP1Score >= versusPointsToWin || versusP2Score >= versusPointsToWin) {
            const winner = versusP1Score > versusP2Score ? 1 : 2;
            endVersusMatch(winner, 'points');
            return;
        }
    } else {
        // Sudden death: first point after activation decides winner
        const winner = scoringPlayer;
        endVersusMatch(winner, 'suddenDeath');
        return;
    }
    // Otherwise continue with countdown for next point
    startVersusPointCountdown(scoringPlayer);
}

// Update ball difficulty based on current level
function updateBallDifficulty() {
    const difficultyLevel = currentLevel - 1; // Level 1 = difficulty 0, Level 2 = difficulty 1, etc.
    ball.speedMultiplier = 1 + (difficultyLevel * 0.1);
    
    // Only update ball size if big ball powerup is not active
    if (!activePowerups.bigBall.active) {
        ball.radius = ball.baseRadius - (difficultyLevel * ball.baseRadius * 0.1);
        
        // Ensure ball doesn't get too small
        if (ball.radius < 10) {
            ball.radius = 10;
        }
    }
}

// Serve ball from center toward receiver after a goal
function centerServe() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2 - 120;
    ball.vx = (versusServer === 1 ? 2 : -2);
    ball.vy = -6;
    versusBetweenPoints = false; // release freeze
    if (isVersus) { gameRunning = true; }
    if (isVersus && !versusHasStartedPlay) {
        versusHasStartedPlay = true;
        versusMatchStartTime = performance.now();
    }
}

// Begin a 3-2-1 countdown after a goal (or before first serve) then serve
function startVersusPointCountdown(scoringPlayer) {
    versusBetweenPoints = true;
    versusLastScorer = scoringPlayer; // 0 means pre-first serve
    // Reset & freeze ball at center (no motion during countdown)
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2 - 120;
    ball.vx = 0; ball.vy = 0;
    // Clear old timer
    if (versusPointCountdownTimer) { clearInterval(versusPointCountdownTimer); versusPointCountdownTimer = null; }
    versusPointCountdown = 3;
    versusPointCountdownTimer = setInterval(() => {
        versusPointCountdown--;
        if (versusPointCountdown <= 0) {
            clearInterval(versusPointCountdownTimer); versusPointCountdownTimer = null;
            centerServe();
        }
    }, 1000);
}

function drawVersusPointOverlay() {
    if (!isVersus || !versusBetweenPoints) return;
    ctx.save();
    // Dim box (avoid full-screen dark so goals remain visible)
    const boxW = 340, boxH = 140;
    const boxX = canvas.width/2 - boxW/2;
    const boxY = 70;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.textAlign = 'center';
    // Header
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#FFFFFF';
    let header;
    if (versusMatchEnded) header = 'Match Over';
    else if (versusSuddenDeath && versusLastScorer === 0) header = 'Sudden Death';
    else if (versusLastScorer === 0) header = 'Get Ready';
    else header = `Goal Player ${versusLastScorer}!`;
    ctx.fillText(header, canvas.width/2, boxY + 40);
    // Countdown number (pulse)
    ctx.font = 'bold 60px Arial';
    const pulse = 1 + 0.05 * Math.sin(performance.now() * 0.01);
    ctx.save();
    ctx.translate(canvas.width/2, boxY + 102);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.strokeText(versusPointCountdown.toString(), 0, 0);
    ctx.fillText(versusPointCountdown.toString(), 0, 0);
    ctx.restore();
    // Server indicator
    ctx.font = '16px Arial';
    ctx.fillStyle = '#DDD';
    const footer = versusSuddenDeath ? 'Sudden Death • Next Point Wins' : `Server: P${versusServer}`;
    ctx.fillText(footer, canvas.width/2, boxY + boxH + 18);
    ctx.restore();
}

// Enhanced sudden death visual overlay (vignette, title pulse, closure progress)
function drawSuddenDeathEffects() {
    if (!isVersus || !versusSuddenDeath || versusMatchEnded) return;
    const now = performance.now();
    const elapsed = suddenDeathStartTime ? now - suddenDeathStartTime : 0;
    const progress = Math.min(1, elapsed / SUDDEN_DEATH_CLOSE_DURATION);
    // Radial vignette pulse
    ctx.save();
    const maxR = Math.max(canvas.width, canvas.height);
    const vg = ctx.createRadialGradient(canvas.width/2, canvas.height/2, maxR*0.15, canvas.width/2, canvas.height/2, maxR*0.75);
    const edgeAlpha = 0.55 + 0.25*Math.sin(now*0.004);
    vg.addColorStop(0,'rgba(0,0,0,0)');
    vg.addColorStop(1,`rgba(120,0,0,${edgeAlpha})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // Title pulse
    const pulse = 1 + 0.08*Math.sin(now*0.006);
    ctx.translate(canvas.width/2, 60);
    ctx.scale(pulse,pulse);
    ctx.font='bold 48px Arial';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.lineWidth=8; ctx.strokeStyle='#000'; ctx.fillStyle='#FF3333';
    ctx.strokeText('SUDDEN DEATH',0,0);
    ctx.fillText('SUDDEN DEATH',0,0);
    ctx.restore();
    // Closure progress bar
    ctx.save();
    const barW = Math.min(600, canvas.width*0.6); const barH=14;
    const barX = canvas.width/2 - barW/2; const barY = 100;
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(barX,barY,barW,barH);
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.strokeRect(barX,barY,barW,barH);
    const fillW = barW*progress;
    const grad = ctx.createLinearGradient(barX,barY,barX+barW,barY);
    grad.addColorStop(0,'#ff8800'); grad.addColorStop(1,'#ff0000');
    ctx.fillStyle = grad; ctx.fillRect(barX,barY,fillW,barH);
    ctx.font='12px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('Field Closing', barX+barW/2, barY+barH/2);
    ctx.restore();
}

function drawVersusGoals() {
    if (!isVersus) return;
    const top = VERSUS_GOAL.top; const h = VERSUS_GOAL.height;
    const t = performance.now() * 0.002; // animation time
    const pulse = (Math.sin(t) + 1) / 2; // 0..1
    ctx.save();
    if (versusSuddenDeath) {
        // Draw shrinking inner walls instead of fixed outer walls
        const wallWidth = 16;
        // Darken outside area for dramatic effect
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        // Left outside
        ctx.fillRect(0, 0, suddenDeathLeftX, canvas.height);
        // Right outside
        ctx.fillRect(suddenDeathRightX, 0, canvas.width - suddenDeathRightX, canvas.height);
        // Inner walls
        ctx.fillStyle = '#222';
        ctx.fillRect(suddenDeathLeftX, 0, wallWidth, canvas.height);
        ctx.fillRect(suddenDeathRightX - wallWidth, 0, wallWidth, canvas.height);
        // Full-height goal glow at extreme edges (visual cue entire walls score earlier; now inside shrinks)
    } else {
        // Solid wall strips
        ctx.fillStyle = '#1b1b1b';
        ctx.fillRect(0, 0, 24, canvas.height);
        ctx.fillRect(canvas.width-24, 0, 24, canvas.height);
        // Carve out goal apertures (clear to show background)
        ctx.clearRect(0, top, 24, h);
        ctx.clearRect(canvas.width-24, top, 24, h);
    }

    // Animated portal glow intensity
    const intensityA = 0.35 + pulse * 0.35; // 0.35 - 0.70
    const intensityB = 0.25 + pulse * 0.25; // 0.25 - 0.50
    ctx.globalCompositeOperation = 'lighter';
    if (versusSuddenDeath) {
        // Pulsing gradient along entire vertical span of shrinking inner walls
        const wallWidth = 16;
        for (let i=0;i<3;i++) {
            const w = wallWidth - i*5;
            const alpha = (intensityA - i*0.15);
            if (alpha <= 0) continue;
            const gL = ctx.createLinearGradient(suddenDeathLeftX + wallWidth/2, 0, suddenDeathLeftX + wallWidth/2, canvas.height);
            gL.addColorStop(0, `rgba(255,230,140,${alpha})`);
            gL.addColorStop(1, `rgba(255,150,0,${alpha*0.95})`);
            ctx.fillStyle = gL;
            ctx.fillRect(suddenDeathLeftX + i*3, 0, w, canvas.height);
            const alphaR = (intensityB - i*0.12);
            if (alphaR <= 0) continue;
            const gR = ctx.createLinearGradient(suddenDeathRightX - wallWidth/2, 0, suddenDeathRightX - wallWidth/2, canvas.height);
            gR.addColorStop(0, `rgba(140,220,255,${alphaR})`);
            gR.addColorStop(1, `rgba(0,120,255,${alphaR*0.95})`);
            ctx.fillStyle = gR;
            ctx.fillRect(suddenDeathRightX - wallWidth + i*3, 0, w, canvas.height);
        }
    } else {
        // Left glow layers (normal mode)
        for (let i=0;i<3;i++) {
            const w = 20 - i*6;
            const alpha = (intensityA - i*0.15);
            if (alpha <= 0) continue;
            const g = ctx.createLinearGradient(8, top, 8, top + h);
            g.addColorStop(0, `rgba(255,230,140,${alpha})`);
            g.addColorStop(1, `rgba(255,150,0,${alpha*0.95})`);
            ctx.fillStyle = g;
            ctx.fillRect(2 + i*3, top, w, h);
        }
        // Right glow layers
        for (let i=0;i<3;i++) {
            const w = 20 - i*6;
            const alpha = (intensityB - i*0.12);
            if (alpha <= 0) continue;
            const g = ctx.createLinearGradient(canvas.width-8, top, canvas.width-8, top + h);
            g.addColorStop(0, `rgba(140,220,255,${alpha})`);
            g.addColorStop(1, `rgba(0,120,255,${alpha*0.95})`);
            ctx.fillStyle = g;
            ctx.fillRect(canvas.width-22 + i*3, top, w, h);
        }
    }
    ctx.globalCompositeOperation = 'source-over';

    // Physical lip / bevel (inner edge shading) to suggest wall thickness
    // Left lip: a thin dark strip inside aperture, plus highlight on inner edge
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(24, top, 6, h); // inner shadow just inside left aperture edge
    const lipGradL = ctx.createLinearGradient(24, top, 30, top);
    lipGradL.addColorStop(0,'rgba(255,255,255,0.15)');
    lipGradL.addColorStop(1,'rgba(0,0,0,0.4)');
    ctx.fillStyle = lipGradL;
    ctx.fillRect(24, top, 6, h);
    // Right lip
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(canvas.width-30, top, 6, h);
    const lipGradR = ctx.createLinearGradient(canvas.width-30, top, canvas.width-24, top);
    lipGradR.addColorStop(0,'rgba(0,0,0,0.4)');
    lipGradR.addColorStop(1,'rgba(255,255,255,0.15)');
    ctx.fillStyle = lipGradR;
    ctx.fillRect(canvas.width-30, top, 6, h);

    // Inner vertical edge strokes to emphasize opening
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    if (!versusSuddenDeath) {
        ctx.beginPath();
        ctx.moveTo(22, top); ctx.lineTo(22, top + h);
        ctx.moveTo(canvas.width-22, top); ctx.lineTo(canvas.width-22, top + h);
        ctx.stroke();
    }
    ctx.restore();
}

// End game
function endGame() {
    if (isFreeplay || isVersus) return; // Suppress single-player game over in freeplay or versus
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalBounces').textContent = score;
    document.getElementById('finalLevel').textContent = currentLevel;
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('keepieUpieBest', bestScore);
        document.getElementById('bestScore').textContent = bestScore;
        
        // Save new high score to cloud if authenticated
        if (isAuthenticated) {
            saveUserData();
        }
    }
    
    document.getElementById('gameOver').style.display = 'block';
}

// Restart game
function restartGame() {
    // Prevent single-player restart logic from firing during versus mode
    if (isVersus) return;
    gameRunning = false;
    countdownActive = true;
    countdownValue = 3;
    score = 0;
    gameTime = 0; // Reset game timer
    lastDifficultyUpdate = 0; // Reset difficulty timer
    currentLevel = 1; // Reset to level 1
    timeToNextLevel = 30000; // Reset timer to 30 seconds
    coinsCollected = 0;
    maxHealth = CHARACTERS[selectedCharacter].health; // Reset max health for current character
    playerHealth = maxHealth; // Reset health
    if (hasShield) shieldHealth = maxShieldHealth; // Reset shield if owned
    updateHealthBars(); // Update health bars display
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coinsCollected;
    document.getElementById('gameOver').style.display = 'none';
    
    // Reset powerups and coins
    powerups = [];
    coinsList = [];
    activePowerups = {
        doublePoints: { active: false, timeLeft: 0 },
        bigBall: { active: false, timeLeft: 0 },
        fastCrouch: { active: false, timeLeft: 0 }
    };
    
    // Reset enemy system
    enemy = null;
    enemyActive = false;
    slideTacklers = []; // Reset slide tacklers
    tacklerWarnings = []; // Reset warnings
    
    // Don't reset coin multiplier on game restart - it persists
    closeAdPopup();
    updatePowerupDisplay();
    
    // Reset player
    player.x = canvas.width / 2 - player.width / 2;
    player.y = player.baseY;
    player.speed = player.baseSpeed;
    player.isJumping = false;
    player.jumpVelocity = 0;
    
    // Reset ball
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.radius = ball.baseRadius;
    ball.speedMultiplier = 1;
    ball.onGround = false;
    ball.lastHitByPlayer = false;
    
    // Start countdown
    startCountdown();
}

// === FREEPLAY MODE ===
// Toggle function wired to button in index.html (🎮 Freeplay)
function toggleFreeplay() {
    // Can't toggle during countdown for clarity; allow after start or from game over
    if (countdownActive) return;
    // If currently in versus, exit versus first so freeplay toggle acts on base mode
    if (isVersus) {
        exitVersusMode();
    }
    isFreeplay = !isFreeplay;
    const modeBadge = document.getElementById('modeBadge');
    const freeplayBtn = document.querySelector('.freeplay-button');
    if (isFreeplay) {
        modeBadge.style.display = 'inline-block';
        modeBadge.textContent = 'Freeplay Mode';
        freeplayBtn.textContent = '🎮 Exit Freeplay';
        // Reset state to clean start but keep coin multiplier and unlocks
        restartGame();
    } else {
        modeBadge.style.display = 'none';
        freeplayBtn.textContent = '🎮 Freeplay';
        restartGame();
    }
}

// Basic versus start (step 1) – will be expanded in later steps
function startVersusMatch() {
    if (isVersus) return;
    // Hide start overlay if still visible (entering versus directly before starting main game)
    const so = document.getElementById('startOverlay'); if (so) so.style.display = 'none';
    // Pull current selections (fallback to defaults if somehow null)
    if (!versusP1Character) versusP1Character = unlockedCharacters[0];
    if (!versusP2Character) versusP2Character = unlockedCharacters.length > 1 ? unlockedCharacters[1] : unlockedCharacters[0];
    if (!versusBallSkin) versusBallSkin = unlockedBallSkins[0];
    // Store originals to restore after match
    versusOriginalCharacter = selectedCharacter;
    versusOriginalBallSkin = selectedBallSkin;
    // Apply P1 character & ball skin to global drawing system
    selectedCharacter = versusP1Character;
    selectedBallSkin = versusBallSkin;
    updateHealthBars(); // reflect any health change from character
    // Read sliders
    const pointsSlider = document.getElementById('pointsSlider');
    const timeSlider = document.getElementById('timeSlider');
    if (pointsSlider) versusPointsToWin = parseInt(pointsSlider.value,10) || 5;
    if (timeSlider) versusMatchMinutes = parseInt(timeSlider.value,10) || 5;
    // Update scoreboard labels
    const pointsCapLabel = document.getElementById('pointsCapLabel');
    if (pointsCapLabel) pointsCapLabel.textContent = versusPointsToWin;
    const matchTimer = document.getElementById('matchTimer'); if (matchTimer) matchTimer.textContent = '0:00';
    // Hide setup modal
    const modal = document.getElementById('versusModal'); if (modal) modal.style.display = 'none';
    // Start mode
    isVersus = true;
    isFreeplay = false; const modeBadge = document.getElementById('modeBadge'); if (modeBadge) modeBadge.style.display = 'none';
    // Expand field: hide sidebars & resize canvas to maximum available width
    const leftSidebar = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    if (leftSidebar) leftSidebar.style.display = 'none';
    if (rightSidebar) rightSidebar.style.display = 'none';
    // Hide any active ad popup just in case
    const adPopup = document.getElementById('adPopup'); if (adPopup) adPopup.style.display = 'none';
    adjustVersusCanvasSize();
    // Ensure core loop runs (bypass single-player countdown system)
    gameRunning = true;
    countdownActive = false; // suppress single-player start overlay if it was active
    // Reset state & positions
    player.x = canvas.width / 2 - 220; player.y = player.baseY; player.isJumping = false; player.jumpVelocity = 0;
    player2.x = canvas.width / 2 + 100; player2.y = player2.baseY; player2.isJumping = false; player2.jumpVelocity = 0;
    ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.vx = 0; ball.vy = -3; ball.onGround = false;
    versusP1Score = 0; versusP2Score = 0; versusServer = Math.random() < 0.5 ? 1 : 2;
    VERSUS_GOAL.top = (canvas.height - VERSUS_GOAL.height) / 2;
    const p1 = document.getElementById('p1Score'); const p2 = document.getElementById('p2Score'); if (p1) p1.textContent = '0'; if (p2) p2.textContent = '0';
    // Swap UI panels
    const gameInfo = document.getElementById('gameInfo'); const versusInfo = document.getElementById('versusInfo'); if (gameInfo) gameInfo.style.display = 'none'; if (versusInfo) versusInfo.style.display = 'flex';
    // Hide any lingering single-player game over overlay
    const go = document.getElementById('gameOver'); if (go) go.style.display = 'none';
    // Reset timing flags
    versusMatchStartTime = null; versusHasStartedPlay = false;
    versusMatchEnded = false; versusSuddenDeath = false;
    suddenDeathStartTime = null; suddenDeathLeftX = 0; suddenDeathRightX = canvas.width;
    // Begin pre-first serve countdown
    versusBetweenPoints = true; versusLastScorer = 0; startVersusPointCountdown(0);
}

// Temporary stub: clicking the 1v1 button will instantly start a test match (no setup modal yet)
function openVersusSetup() {
    if (isVersus) return; // don't open during a match
    const modal = document.getElementById('versusModal');
    if (modal) modal.style.display = 'block';
    buildVersusOptionGrids();
    const ps = document.getElementById('pointsSlider'); if (ps) { ps.value = versusPointsToWin; updateVersusPointsLabel(ps.value); }
    const ts = document.getElementById('timeSlider'); if (ts) { ts.value = versusMatchMinutes; updateVersusTimeLabel(ts.value); }
}

function closeVersusSetup() {
    const modal = document.getElementById('versusModal'); if (modal) modal.style.display = 'none';
}

function updateVersusPointsLabel(v) { const lbl = document.getElementById('pointsLabel'); if (lbl) lbl.textContent = v; localStorage.setItem('versusPointsToWin', v); }
function updateVersusTimeLabel(v) { const lbl = document.getElementById('timeLabel'); if (lbl) lbl.textContent = v; localStorage.setItem('versusMatchMinutes', v); }

function buildVersusOptionGrids() {
    // Characters for P1 & P2
    const p1Div = document.getElementById('p1Characters');
    const p2Div = document.getElementById('p2Characters');
    const ballDiv = document.getElementById('ballOptions');
    if (!p1Div || !p2Div || !ballDiv) return;
    p1Div.innerHTML=''; p2Div.innerHTML=''; ballDiv.innerHTML='';
    // Ensure defaults
    if (!versusP1Character) versusP1Character = unlockedCharacters[0];
    if (!versusP2Character) versusP2Character = unlockedCharacters.length > 1 ? unlockedCharacters[1] : unlockedCharacters[0];
    if (!versusBallSkin) versusBallSkin = unlockedBallSkins[0];
    Object.keys(CHARACTERS).forEach(charId => {
        const owned = unlockedCharacters.includes(charId);
        // P1 card
        const c1 = document.createElement('div');
        c1.className = 'option-card' + (owned ? '' : ' locked') + (versusP1Character === charId ? ' selected' : '');
        c1.innerHTML = `<div class="option-preview" style="background:${CHARACTERS[charId].color}"></div><div>${CHARACTERS[charId].name}</div>`;
        if (owned) c1.onclick = () => { versusP1Character = charId; buildVersusOptionGrids(); };
        p1Div.appendChild(c1);
        // P2 card
        const c2 = document.createElement('div');
        c2.className = 'option-card' + (owned ? '' : ' locked') + (versusP2Character === charId ? ' selected' : '');
        c2.innerHTML = `<div class="option-preview" style="background:${CHARACTERS[charId].color}"></div><div>${CHARACTERS[charId].name}</div>`;
        if (owned) c2.onclick = () => { versusP2Character = charId; buildVersusOptionGrids(); };
        p2Div.appendChild(c2);
    });
    // Ball skins (single chooser)
    Object.keys(BALL_SKINS).forEach(skinId => {
        const owned = unlockedBallSkins.includes(skinId);
        const card = document.createElement('div');
        const bg = BALL_SKINS[skinId].color === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)' : BALL_SKINS[skinId].color;
        card.className = 'option-card' + (owned ? '' : ' locked') + (versusBallSkin === skinId ? ' selected' : '');
        card.innerHTML = `<div class="option-preview" style="border-radius:50%;background:${bg}"></div><div>${BALL_SKINS[skinId].name}</div>`;
        if (owned) card.onclick = () => { versusBallSkin = skinId; buildVersusOptionGrids(); };
        ballDiv.appendChild(card);
    });
}

// Stubs for end modal actions (implemented after win conditions later)
function restartVersusSameSettings() {
    if (!isVersus && !versusMatchEnded) return; // Only allowed after a versus match (ended or still active)
    // Hide end modal if visible
    const endModal = document.getElementById('versusEndModal'); if (endModal) endModal.style.display = 'none';
    // Keep prior selections (versusP1Character, versusP2Character, versusBallSkin, points/time)
    isVersus = false; // Force fresh startVersusMatch path
    startVersusMatch();
}
function exitVersusToHome() {
    const endModal = document.getElementById('versusEndModal'); if (endModal) endModal.style.display = 'none';
    exitVersusMode();
}
// End the current versus match
function endVersusMatch(winner, reason) {
    if (!isVersus || versusMatchEnded) return;
    versusMatchEnded = true;
    versusBetweenPoints = false;
    gameRunning = false; // Freeze updates
    // Populate end modal
    const endModal = document.getElementById('versusEndModal');
    const res = document.getElementById('versusResult');
    const f1 = document.getElementById('finalP1');
    const f2 = document.getElementById('finalP2');
    if (f1) f1.textContent = versusP1Score;
    if (f2) f2.textContent = versusP2Score;
    if (res) {
        if (winner === 0) res.textContent = 'Draw';
        else res.textContent = `Player ${winner} Wins!${versusSuddenDeath ? ' (Sudden Death)' : ''}`;
    }
    if (endModal) endModal.style.display = 'block';
}
// Cleanly exit current versus match back to single-player (no game over logic)
function exitVersusMode() {
    // Stop versus state
    isVersus = false;
    versusBetweenPoints = false;
    // Restore original selected character & ball skin if stored
    if (versusOriginalCharacter) selectedCharacter = versusOriginalCharacter;
    if (versusOriginalBallSkin) selectedBallSkin = versusOriginalBallSkin;
    updateHealthBars();
    // Hide versus UI, show standard UI
    const versusInfo = document.getElementById('versusInfo'); if (versusInfo) versusInfo.style.display = 'none';
    const gameInfo = document.getElementById('gameInfo'); if (gameInfo) gameInfo.style.display = 'flex';
    // Restore sidebars and canvas size
    const leftSidebar = document.getElementById('leftSidebar'); if (leftSidebar) leftSidebar.style.display = 'block';
    const rightSidebar = document.getElementById('rightSidebar'); if (rightSidebar) rightSidebar.style.display = 'block';
    canvas.width = ORIGINAL_CANVAS_WIDTH; canvas.height = ORIGINAL_CANVAS_HEIGHT;
    // Recompute goal top for restored dimensions
    VERSUS_GOAL.top = (canvas.height - VERSUS_GOAL.height) / 2;
    // Reset ball & players to single-player defaults
    player.x = canvas.width / 2 - player.width / 2; player.y = player.baseY; player.isJumping = false; player.jumpVelocity = 0;
    player2.x = canvas.width / 2 + 100; player2.y = player2.baseY; // keep out of way (or could hide drawSecondPlayer via isVersus false)
    ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.vx = 0; ball.vy = 0; ball.onGround = false; ball.lastHitByPlayer = false;
    // Reset server/time flags
    versusHasStartedPlay = false; versusMatchStartTime = null;
    suddenDeathStartTime = null; suddenDeathLeftX = 0; suddenDeathRightX = canvas.width; versusSuddenDeath = false; versusMatchEnded = false;
    // Ensure standard gameplay state is paused until user restarts or toggles freeplay
    gameRunning = false;
    countdownActive = true; countdownValue = 3; startCountdown();
}

// Adjust canvas size to fill available width during versus
function adjustVersusCanvasSize() {
    if (!isVersus) return;
    // Calculate available width (window inner width minus small margin)
    const margin = 20; // padding around
    const maxWidth = Math.max(ORIGINAL_CANVAS_WIDTH, window.innerWidth - margin * 2);
    canvas.width = maxWidth;
    // Height kept constant for layout stability
    canvas.height = ORIGINAL_CANVAS_HEIGHT;
    // Re-center players proportionally (keep relative positions)
    player.x = canvas.width / 2 - 220;
    player2.x = canvas.width / 2 + 100;
    // Re-center ball if between points
    if (versusBetweenPoints) {
        ball.x = canvas.width / 2;
    }
    // Update sudden death bounds and goal vertical placement
    VERSUS_GOAL.top = (canvas.height - VERSUS_GOAL.height) / 2;
    suddenDeathRightX = canvas.width; // ensure shrinking logic uses new width baseline
}

// Listen for window resizes to keep versus field maximized
window.addEventListener('resize', () => { if (isVersus) adjustVersusCanvasSize(); });

// Start countdown timer
function startCountdown() {
    const countdownInterval = setInterval(() => {
        countdownValue--;
        
        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            // Show GO! for a brief moment then start game
            setTimeout(() => {
                countdownActive = false;
                gameRunning = true;
                // Give ball initial velocity (slower start)
                ball.vx = (Math.random() - 0.5) * 2;
                ball.vy = -3;
            }, 500);
        }
    }, 1000);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine short ceiling states based on level timing
    const isShortCeilingLevel = !isFreeplay && !isVersus && currentLevel % 5 === 0; // Disabled in freeplay and versus
    shortCeilingCountdown = isShortCeilingLevel && timeToNextLevel <= 15000 && timeToNextLevel > 10000;
    const shouldCeilingBeActive = isShortCeilingLevel && timeToNextLevel <= 10000;

    // Transition handling for ceiling activation
    if (shouldCeilingBeActive && !shortCeilingActive) {
        shortCeilingActive = true;
        // Clear existing tacklers and warnings; disable enemy during window
        slideTacklers = [];
        tacklerWarnings = [];
        enemyActive = false;
    } else if (!shouldCeilingBeActive && shortCeilingActive) {
        shortCeilingActive = false;
    }
    
    // Always draw background elements
    drawGround();
    drawPlayer();
    if (isVersus) drawSecondPlayer();
    drawSoccerBall(ball.x, ball.y, ball.radius);
    drawVersusGoals();
    drawVersusPointOverlay();
    drawSuddenDeathEffects();
    drawPowerups();
    drawCoins();
    drawBallIndicator();
    // Only draw enemies and warnings when not in countdown/ceiling
    if (!shortCeilingActive && !shortCeilingCountdown) {
        drawEnemy();
        drawTacklerWarnings(); // Draw warning exclamation points
    }
    updateHealthBars(); // Update health and shield bars in HTML
    updateLevelBar(); // Update Level bar in HTML

    // Overlay elements for short ceiling phases
    if (shortCeilingActive) {
        drawShortCeilingOverlay();
    } else if (shortCeilingCountdown) {
        drawShortCeilingCountdown();
    }
    
    if (countdownActive) {
        // Show countdown overlay
        drawCountdown();
    } else if (gameRunning) {
        // Update game only when running
        // Update game time (approximately 16ms per frame at 60fps)
        gameTime += 16;
        
        if (!isFreeplay) {
            // Update time to next level
            timeToNextLevel = 30000 - (gameTime % 30000);
            // Check if we need to update difficulty (every 30 seconds)
            if (gameTime - lastDifficultyUpdate >= 30000) {
                currentLevel++;
                updateBallDifficulty();
                lastDifficultyUpdate = gameTime;
                timeToNextLevel = 30000; // Reset timer for next level
            }
        } else {
            // Keep a static level 1 label progress bar full
            timeToNextLevel = 30000;
            currentLevel = 1;
            lastDifficultyUpdate = 0;
        }
        
    updatePlayer();
    if (isVersus) updatePlayer2();
        updateBall();
        updatePowerups();
        updateCoinMultiplier();
        // Only update enemies when not in countdown/ceiling
        // Allow enemies (tacklers) to appear in freeplay; they won't deal damage there
        if (!shortCeilingActive && !shortCeilingCountdown) {
            updateEnemy();
        }
        checkPlayerCollision();
        checkPowerupCollisions();
        
        // Spawn powerups occasionally only if no powerups are active
        if (!hasActivePowerups() && Math.random() < 0.003 && powerups.length < 1) {
            createPowerup();
        }
        
        // Spawn coins more frequently (1 in 200 chance per frame) - doubled rate
        if (Math.random() < 0.005 && coinsList.length < 4) {
            createCoin();
        }
        
        // Show ad popup occasionally (disable during versus to reduce distraction)
        if (!isVersus && Math.random() < 0.0003) showAdPopup();
        // Update versus match timer UI
        if (isVersus && versusHasStartedPlay && versusMatchStartTime) {
            const elapsed = performance.now() - versusMatchStartTime;
            const totalLimitMs = versusMatchMinutes * 60000;
            const remaining = Math.max(0, totalLimitMs - elapsed);
            const mm = Math.floor(remaining / 60000);
            const ss = Math.floor((remaining % 60000) / 1000).toString().padStart(2,'0');
            const mt = document.getElementById('matchTimer'); if (mt) mt.textContent = `${mm}:${ss}`;
            if (!versusMatchEnded && remaining <= 0) {
                // Time expired: decide winner or sudden death
                if (versusP1Score === versusP2Score) {
                    // Activate sudden death if not already
                    if (!versusSuddenDeath) {
                        versusSuddenDeath = true;
                        suddenDeathStartTime = performance.now();
                        suddenDeathLeftX = 0; suddenDeathRightX = canvas.width;
                        // Show a brief between-points overlay announcing sudden death if ball currently in play
                        // Freeze play and start countdown only if not already between points
                        if (!versusBetweenPoints) {
                            versusBetweenPoints = true;
                            versusLastScorer = 0; // neutral header
                            startVersusPointCountdown(0);
                        }
                    }
                } else {
                    const winner = versusP1Score > versusP2Score ? 1 : 2;
                    endVersusMatch(winner, 'time');
                }
            }
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// === INITIALIZATION / MANUAL START ===
// We now wait for user to click Start button instead of auto-starting
gameRunning = false;
countdownActive = false; // not active until user starts
countdownValue = 3;
ball.vx = 0; ball.vy = 0;

function startMainGame() {
    const overlay = document.getElementById('startOverlay');
    if (overlay) overlay.style.display = 'none';
    // Reset base state similar to restartGame but without clearing unlock progress
    score = 0; coinsCollected = 0; gameTime = 0; lastDifficultyUpdate = 0; currentLevel = 1; timeToNextLevel = 30000;
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coinsCollected;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = player.baseY;
    player.isJumping = false; player.jumpVelocity = 0;
    ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.vx = 0; ball.vy = 0; ball.radius = ball.baseRadius; ball.onGround = false;
    gameRunning = false; countdownActive = true; countdownValue = 3;
    startCountdown();
}

// Kick off HUD and assets so things render immediately for static screen
updateTotalCoinsDisplay(); updateHealthBars(); updateLevelBar(); updatePowerupDisplay(); loadSprites();
requestAnimationFrame(gameLoop); // start render loop only; gameplay waits for start

// Enemy system functions
function createEnemy() {
    // Create warning before spawning tackler
    const side = Math.random() < 0.5 ? 'left' : 'right';
    
    // Create warning system
    const warning = {
        side: side,
        phase: 'EARLY', // Start with early warning
        timeLeft: warningPhases.EARLY.duration,
        totalWarningTime: warningPhases.EARLY.duration + warningPhases.URGENT.duration
    };
    
    tacklerWarnings.push(warning);
    
    // Don't create the actual tackler yet - it will be created after warnings expire
}

function createActualTackler(side) {
    // Create sliding tackler from specified side
    const startX = side === 'left' ? -100 : canvas.width + 100;
    const speed = side === 'left' ? 8 : -8; // Slower sliding speed for better visibility
    
    const slideTackler = {
        x: startX,
        y: canvas.height - 100, // Ground level for sliding (adjusted for larger size)
        width: 120, // Keep width
        height: 80, // Much larger height to match player better
        vx: speed,
        side: side,
        active: true,
        timer: 0,
        duration: 15 // Longer duration since they're slower
    };
    
    slideTacklers.push(slideTackler);
    enemyActive = true;
}

function updateEnemy() {
    // Update warnings
    updateTacklerWarnings();
    
    if (!enemyActive) return;
    
    // Update slide tacklers
    updateSlideTacklers();
    
    // Check if any tacklers are still active
    if (slideTacklers.length === 0) {
        enemyActive = false;
    }
}

function updateTacklerWarnings() {
    for (let i = tacklerWarnings.length - 1; i >= 0; i--) {
        const warning = tacklerWarnings[i];
        warning.timeLeft -= 16; // Approximate frame time
        
        // Check if we need to advance to urgent phase
        if (warning.phase === 'EARLY' && warning.timeLeft <= warningPhases.URGENT.duration) {
            warning.phase = 'URGENT';
        }
        
        // If warning time is up, spawn the actual tackler
        if (warning.timeLeft <= 0) {
            createActualTackler(warning.side);
            tacklerWarnings.splice(i, 1);
        }
    }
}

function updateSlideTacklers() {
    for (let i = slideTacklers.length - 1; i >= 0; i--) {
        const tackler = slideTacklers[i];
        tackler.timer += 1/60;
        
        // Move tackler across screen
        tackler.x += tackler.vx;
        
        // Check collision with player (only if player is standing, not jumping)
        const playerCenterX = player.x + player.width / 2;
        const playerBottomY = player.y + player.height;
        
        // Collision detection - slide tackler hits player's legs/body if not jumping
        if (!player.isJumping &&
            tackler.x < playerCenterX + 40 && 
            tackler.x + tackler.width > playerCenterX - 40 &&
            tackler.y < playerBottomY && 
            tackler.y + tackler.height > player.y + 50) {
            // Collision detected
            if (!isFreeplay) {
                const baseDamage = 2;
                const levelMultiplier = Math.pow(1.5, currentLevel - 1);
                const scaledDamage = Math.round(baseDamage * levelMultiplier);
                takeDamage(scaledDamage);
            }
            // In freeplay let them pass through; in normal remove on impact
            if (!isFreeplay) {
                slideTacklers.splice(i, 1);
                continue;
            }
        }
        
        // Remove tackler if it goes off screen or exceeds duration
        if ((tackler.side === 'left' && tackler.x > canvas.width + 100) ||
            (tackler.side === 'right' && tackler.x < -100) ||
            tackler.timer >= tackler.duration) {
            slideTacklers.splice(i, 1);
        }
    }
}

function takeDamage(damage) {
    if (isFreeplay) return; // Invulnerable in freeplay
    if (hasShield && shieldHealth > 0) {
        // Shield absorbs damage first
        const shieldDamage = Math.min(damage, shieldHealth);
        shieldHealth -= shieldDamage;
        damage -= shieldDamage;
        
        // If shield is depleted, any remaining damage goes to health
        if (damage > 0) {
            playerHealth -= damage;
        }
    } else {
        // No shield or shield depleted, damage goes directly to health
        playerHealth -= damage;
    }
    
    // Update health bars
    updateHealthBars();
    
    // Check if player died
    if (playerHealth <= 0) {
        playerHealth = 0;
        endGame(); // Use endGame() instead of directly showing game over
    }
}

function drawEnemy() {
    if (!enemyActive) return;
    
    slideTacklers.forEach(tackler => {
        const tacklerSprite = sprites.enemies.tackler;
        
        if (tacklerSprite && tacklerSprite.complete && tacklerSprite.naturalWidth > 0) {
            // Draw sprite if it loaded successfully - maintain aspect ratio
            const aspectRatio = tacklerSprite.naturalWidth / tacklerSprite.naturalHeight;
            const drawHeight = tackler.height;
            const drawWidth = drawHeight * aspectRatio;
            
            ctx.save();
            if (tackler.side === 'right') {
                // Flip sprite for right-side tackler
                ctx.scale(-1, 1);
                ctx.drawImage(
                    tacklerSprite,
                    -(tackler.x + drawWidth),
                    tackler.y,
                    drawWidth,
                    drawHeight
                );
            } else {
                ctx.drawImage(
                    tacklerSprite,
                    tackler.x,
                    tackler.y,
                    drawWidth,
                    drawHeight
                );
            }
            ctx.restore();
        } else {
            // Fallback to stick figure drawing
            drawVectorTackler(tackler);
        }
    });
}

// Draw warning exclamation points
function drawTacklerWarnings() {
    tacklerWarnings.forEach(warning => {
        const exclamationCount = warningPhases[warning.phase].exclamations;
        
        // Position warning on appropriate side
        let warningX;
        if (warning.side === 'left') {
            warningX = 50; // Bottom left
        } else {
            warningX = canvas.width - 50; // Bottom right
        }
        const warningY = canvas.height - 80;
        
        // Create pulsing effect
        const pulseIntensity = Math.sin(Date.now() * 0.01) * 0.3 + 0.7; // Pulse between 0.4 and 1.0
        
        // Color based on phase
        let warningColor;
        if (warning.phase === 'EARLY') {
            warningColor = `rgba(255, 255, 0, ${pulseIntensity})`; // Yellow
        } else {
            warningColor = `rgba(255, 0, 0, ${pulseIntensity})`; // Red for urgent
        }
        
        // Draw exclamation points
        ctx.fillStyle = warningColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let exclamationText = '';
        for (let i = 0; i < exclamationCount; i++) {
            exclamationText += '!';
        }
        
        // Draw text with outline
        ctx.strokeText(exclamationText, warningX, warningY);
        ctx.fillText(exclamationText, warningX, warningY);
        
        // Add directional arrow pointing where tackler will come from
        ctx.save();
        ctx.fillStyle = warningColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        const arrowY = warningY + 40;
        const arrowSize = 15;
        
        if (warning.side === 'left') {
            // Arrow pointing right (tackler coming from left)
            ctx.beginPath();
            ctx.moveTo(warningX - arrowSize, arrowY);
            ctx.lineTo(warningX + arrowSize, arrowY);
            ctx.lineTo(warningX + arrowSize - 8, arrowY - 8);
            ctx.moveTo(warningX + arrowSize, arrowY);
            ctx.lineTo(warningX + arrowSize - 8, arrowY + 8);
            ctx.stroke();
        } else {
            // Arrow pointing left (tackler coming from right)
            ctx.beginPath();
            ctx.moveTo(warningX + arrowSize, arrowY);
            ctx.lineTo(warningX - arrowSize, arrowY);
            ctx.lineTo(warningX - arrowSize + 8, arrowY - 8);
            ctx.moveTo(warningX - arrowSize, arrowY);
            ctx.lineTo(warningX - arrowSize + 8, arrowY + 8);
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

// Fallback tackler drawing (original code)
function drawVectorTackler(tackler) {
    const x = tackler.x;
    const y = tackler.y;
    
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4; // Thicker lines for better visibility
    
    // Draw sliding stick figure (bigger)
    // Head (lower because sliding)
    ctx.beginPath();
    ctx.arc(x + (tackler.side === 'left' ? 90 : 30), y + 15, 15, 0, Math.PI * 2); // Bigger head
    ctx.stroke();
    
    // Body (horizontal because sliding)
    ctx.beginPath();
    ctx.moveTo(x + (tackler.side === 'left' ? 75 : 45), y + 25);
    ctx.lineTo(x + (tackler.side === 'left' ? 30 : 90), y + 30);
    ctx.stroke();
    
    // Arms (extended for sliding motion)
    ctx.beginPath();
    if (tackler.side === 'left') {
        // Left-sliding tackler
        ctx.moveTo(x + 65, y + 27);
        ctx.lineTo(x + 50, y + 15);
        ctx.moveTo(x + 45, y + 28);
        ctx.lineTo(x + 25, y + 40);
    } else {
        // Right-sliding tackler
        ctx.moveTo(x + 55, y + 27);
        ctx.lineTo(x + 70, y + 15);
        ctx.moveTo(x + 75, y + 28);
        ctx.lineTo(x + 95, y + 40);
    }
    ctx.stroke();
    
    // Legs (extended for sliding tackle)
    ctx.beginPath();
    if (tackler.side === 'left') {
        // Leading leg extended
        ctx.moveTo(x + 40, y + 30);
        ctx.lineTo(x + 10, y + 40);
        // Trailing leg bent
        ctx.moveTo(x + 55, y + 30);
        ctx.lineTo(x + 40, y + 45);
    } else {
        // Leading leg extended
        ctx.moveTo(x + 80, y + 30);
        ctx.lineTo(x + 110, y + 40);
        // Trailing leg bent
        ctx.moveTo(x + 65, y + 30);
        ctx.lineTo(x + 80, y + 45);
    }
    ctx.stroke();
    
    // Add motion lines for effect (more visible)
    ctx.strokeStyle = '#FF6666';
    ctx.lineWidth = 2;
    for (let j = 0; j < 5; j++) { // More motion lines
        ctx.beginPath();
        const offsetX = tackler.side === 'left' ? -20 - (j * 12) : 140 + (j * 12);
        ctx.moveTo(x + offsetX, y + 20 + (j * 4));
        ctx.lineTo(x + offsetX + (tackler.side === 'left' ? -12 : 12), y + 20 + (j * 4));
        ctx.stroke();
    }
}

// Draw the short ceiling overlay (top 1/4 of the screen)
function drawShortCeilingOverlay() {
    const h = Math.floor(canvas.height * 0.25);
    ctx.save();
    ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
    ctx.fillRect(0, 0, canvas.width, h);
    // Optional hazard stripes at the bottom edge
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(canvas.width, h);
    ctx.stroke();
    ctx.restore();
}

// Draw 5-second pre-ceiling countdown in center (red with black outline)
function drawShortCeilingCountdown() {
    const seconds = Math.max(1, Math.ceil((timeToNextLevel - 10000) / 1000)); // 5..1
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 96px Arial';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FF0000';
    ctx.strokeText(seconds.toString(), canvas.width / 2, canvas.height / 2);
    ctx.fillText(seconds.toString(), canvas.width / 2, canvas.height / 2);
    ctx.restore();
}
