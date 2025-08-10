# ⚽ Keepie Upie - Soccer Ball Game

A fun physics-based game where you control a player to keep a soccer ball in the air by bouncing it off your head! Features progressive difficulty, powerups, coin collection, ad rewards, and enemy laser attacks!

## How to Play

1. **Objective**: Keep the soccer ball in the air by bouncing it off your player's head
2. **Controls**: 
   - Use `A` or `←` (Left Arrow) to move left
   - Use `D` or `→` (Right Arrow) to move right
   - Use `SPACEBAR` to jump (gives extra ball bounce power)
   - Use `S` or `↓` (Down Arrow) to crouch and dodge laser attacks
3. **Scoring**: Each time you successfully bounce the ball off your head, you get points
4. **Game Over**: The game ends when the ball hits the ground or you get hit by a laser
5. **Challenge**: See how many times you can bounce the ball while surviving enemy attacks!

## Game Features

- **Realistic Physics**: The ball responds to gravity and bounces realistically
- **Progressive Difficulty**: Every 10 hits, the ball gets faster and smaller
- **Wall Boundaries**: The ball bounces off the left and right sides of the screen
- **Jump Mechanics**: Use spacebar to jump and give the ball extra bounce power
- **Powerup System**: 
  - 🔴 **Double Points**: Earn 2 points per hit for 10 seconds
  - 🟡 **Big Ball**: Ball becomes larger and easier to hit for 15 seconds
  - � **Fast Crouch** (Rare): Move at normal speed while crouching for 30 seconds
- **Coin Collection**: Collect coins that appear randomly with different values and rarities:
  - 🥉 **Bronze Coins** (1 coin): Very common (70% chance)
  - 🥈 **Silver Coins** (2 coins): Common (20% chance) 
  - 🥇 **Gold Coins** (5 coins): Uncommon (8% chance)
  - 💜 **Purple Coins** (10 coins): Rare (2% chance)
- **Enemy Laser Attacks**: 5% chance per hit for laser-armed enemies to attack from the sides
- **Off-Screen Indicator**: Arrow shows where the ball is when it goes too high
- **Ad Rewards**: Watch ads to earn coin multipliers and powerup bonuses
- **Player Influence**: Your movement affects the ball's direction when you hit it
- **Score Tracking**: Keep track of your current score, best score, and coins collected
- **Soccer Ball Graphics**: Authentic soccer ball design with pentagon pattern

## How to Run

1. Simply open `index.html` in any modern web browser
2. The game will start automatically
3. Use the keyboard controls to move your player
4. Try to keep the ball bouncing!

## Game Mechanics

- **Gravity**: The ball constantly falls due to gravity
- **Bounce Physics**: Each bounce has realistic damping
- **Player Head Collision**: The ball bounces when it hits the player's head
- **Directional Control**: Move while hitting the ball to influence its direction
- **Wall Bouncing**: Balls bounce off the side walls with reduced velocity
- **Progressive Scaling**: Every 10 hits increases ball speed and decreases size
- **Powerup Exclusivity**: Only one powerup type can be active at a time
- **Countdown Timer**: 3-second countdown when starting or restarting
- **Enemy Combat**: 
  - Enemies spawn with 5% chance per ball hit
  - Warning phase (yellow dashed line) for 2 seconds
  - Shooting phase (red laser) with 5 shots, 2-4 seconds apart
  - Must crouch to avoid lasers or game over
  - Can move left/right while crouching (but slower)
  - Ball bounces lower when hit while crouching
- **Coin Economy**: Collect coins to unlock ad rewards and bonuses

## Tips for High Scores

1. **Stay Under the Ball**: Position yourself under the falling ball
2. **Use Movement**: Move left or right while hitting to control ball direction
3. **Time Your Hits**: Hit the ball at the right moment for better control
4. **Watch the Trajectory**: Predict where the ball will land
5. **Stay Calm**: Don't panic when the ball goes to the sides - use the wall bounces!
6. **Master Jumping**: Use spacebar to jump and give the ball extra bounce
7. **Collect Powerups**: Grab powerups in the top half of the screen to make the game easier
8. **Save Coins**: Collect 10 coins to unlock ad rewards for permanent bonuses
9. **Survive Enemies**: Watch for yellow warning lines and crouch when lasers fire
10. **Practice Crouching**: You can move while crouched but you're slower and ball bounces less
11. **Risk vs Reward**: Stay standing for better ball control, crouch only when necessary!
12. **Rare Powerup**: Look for purple Fast Crouch powerups to move normally while crouching!

## Browser Compatibility

This game works in all modern web browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Technical Details

- Built with HTML5 Canvas and JavaScript
- Smooth 60 FPS gameplay
- Responsive controls with keyboard input handling
- Local storage for best score persistence
- Physics simulation with gravity and collision detection
- Advanced powerup timer system
- Enemy AI with multi-phase attack patterns
- Responsive design that scales to different screen sizes
- Ad integration framework ready for monetization

Enjoy playing Keepie Upie! 🎮⚽
