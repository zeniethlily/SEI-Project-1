# SEI-23 Project #1: Breakout!

## Gameplay

Objective of the game is to destroy all the blocks presented at the top of the screen. Left and Right arrow keys control the paddle and P pauses/unpauses the game. SPACEBAR launches balls.

Occasionally, power ups will be granted :
* **Paddle Up!** - extends the paddle for a duration
* **Super Ball** - the ball will bulldoze through all bricks instead of bouncing off them
* **Multi Ball** - grants the ability to launch up to 5 balls per powerup.

Player will lose a life if the last ball drops off a screen, the game is over once all lives are lost. High score is totalled and recorded after each round and score is lost when game is over.

## Approach

Game was chosen due to the simple game mechanics and the ability to extend
functionality relatively easily. I started by defining the canvas size and 
worked on getting the code to draw the ball in it. The next step was to start animating the ball and getting collision detection on all 4 sides of the canvas screen. From there, all the remaining features were added after testing each one. Ran into some issues with game logic when I was working on the furthers, hence I decided to rewrite the script from scratch and implemented classes/objects to allow for better scaling of features. From there I could add in new physics options, track multiple balls on the screen and have better scoring.

### Tech used

To implement this game, I used :
* HTML to define and contain the canvas.
* JavaScript for DOM and canvas manipulation 
* Minor CSS additions to style the elements
* Classes, objects, arrays and all their respective methods

## Unsolved problems

Working on loading unique levels by setting the state of the blocks during the initialisation phase. Ran into some issues with the arrays used.

*RARE* bug - ball sometimes clips through the paddle at very specific locations.

### Game Link

[https://zeniethlily.github.io/SEI23-Project-1-Darrell](https://zeniethlily.github.io/SEI23-Project-1-Darrell)


