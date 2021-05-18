# 2048 Web Game
Website created for COMP 426. The goal of this assignment was to make a working web version of the game [2048](https://play2048.co/). Some of the game mechanics for 2048 are described below, but you should play the game a few times to better understand how it works.

2048 is designed using the MVC design pattern. Below I'll describe the files and how the game works segmented by the MVC components.

## Demo
![2048-game-demo](https://github.com/sarao-creates/2048-game/blob/master/demo.gif)

## Model
The Model code is encapsulated inside a Game class and exported from src/engine/game.js. There is a special object, called the gameState object, to load game states into the Game class. The gameState object completely specifies the current state of a game at any instant in time, including (1) the position of the tiles on the board, (2) the current score, (3) whether the game has been won, and (4) whether the game is over. The gameState object has the following structure:
```
gameState = {
  board: number[],
  score: number,
  won: boolean,
  over: boolean
}
```
* board: A one-dimensional array of (size squared) numbers that represents the value of each tile on the board. Represented as a flat array in row major order. 0 is used where no tile is present.
* score: The score of the game at the current instant in time. Initially, the score is set to zero. Every time the player makes a move that combines two tiles, the combined value is added to the score (e.g. if two 128 tiles are merged to make a 256 tile, then you add 256 to the score).
* won: True if a user has combined two 1024 tiles to make a 2048 tile
* over: True if the board is in a state such that no more moves can be made

**Starting a game**
When a game is started, the board is defaulted to setup to a board size of 4x4. This size can be modified to 2x2 onwards. Two tiles are automatically added to the board at start.

**Adding tiles**
A new tile has a 90% chance of being a 2 and a 10% chance of 4. Tiles are added at the start of a game and after a legal move occurs (one is added).

**Legal moves**
A legal move is one that causes pieces to slide or collapse on the board. If a player tries to make a move that does not change the state of the board, no move occurs and no new tiles are added to the board. Once a move causes a 2048 tile to be created, the state updates to reflect that the game is "won". Once no legal moves are available, the state should reflect that the game is "over".

**Events**
* move event: occurs every time a valid move is made
* lose event: occurs when the game transitions into a state that is 'over'
* win event: occurs when the game transitions into a state that is 'won'

## View
The view is constructed in ReactJS.

## Controller
The controller takes user input (users pressing the arrow keys) and communicates to the model and subsequently the view.
