# Keepie Upie Sprite Images

This directory contains the sprite images for the Keepie Upie game. The game will automatically fall back to vector graphics if these images are not found.

## Required Image Files

### Players (`images/players/`)
- `default.png` - Default player character
- `ninja.png` - Ninja character
- `robot.png` - Robot character  
- `superhero.png` - Superhero character

### Soccer Balls (`images/balls/`)
- `default.png` - Standard soccer ball
- `fire.png` - Fire ball
- `ice.png` - Ice ball
- `gold.png` - Golden soccer ball
- `rainbow.png` - Rainbow ball

### Enemies (`images/enemies/`)
- `tackler.png` - Sliding tackler enemy

### Powerups (`images/powerups/`)
- `doublePoints.png` - Double points powerup
- `bigBall.png` - Big ball powerup
- `fastCrouch.png` - Fast crouch powerup

### Coins (`images/coins/`)
- `bronze.png` - Bronze coin (1 point)
- `silver.png` - Silver coin (2 points)
- `gold.png` - Gold coin (5 points)
- `purple.png` - Purple coin (10 points)

## Image Specifications

- **Format**: PNG with transparency support
- **Player sprites**: Recommended 80x120 pixels
- **Ball sprites**: Recommended 50x50 pixels
- **Enemy sprites**: Recommended 120x50 pixels
- **Powerup sprites**: Recommended 40x40 pixels
- **Coin sprites**: Recommended 30x30 pixels

## Notes

- All images should have transparent backgrounds
- The game will automatically scale images to fit the game objects
- If any image fails to load, the game will use vector graphics as fallback
- Images are loaded once at the start of the game

## Creating Your Own Sprites

You can create custom sprites using any image editing software. Just make sure to:
1. Use the correct filenames listed above
2. Save as PNG format with transparency
3. Keep reasonable dimensions (the game will scale them)
4. Test that they look good both in the game and as fallbacks
