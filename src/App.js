import { useEffect, useState } from 'react';
import './App.css'
import Game from "./engine/game.js";

let game = new Game(4);

function App() {


  const [gameState, setGameState] = useState(game.getGameState())
  const [score, setScore] = useState(gameState.score);
  const [alert, setAlert] = useState("");
  
  useEffect(() => {
    document.addEventListener('keydown', pressKey);
    return () => document.removeEventListener('keydown', pressKey)
  })

  function pressKey(event) {
    event.preventDefault();
    if (event.key === 'ArrowUp') {
      game.move('up');
    }
    else if (event.key === 'ArrowRight') {
      game.move('right');
    }
    else if (event.key === 'ArrowLeft') {
      game.move('left');
    }
    
    else if (event.key === 'ArrowDown') {
      game.move('down');
    }

    setGameState({...gameState, ...tempObj});
    setScore(game.getGameState().score);

    if (game.getGameState().won === true || game.getGameState().over === true) {
      showAlert();
    }
    
  }

    const tempObj = {test: 1};

  const reset = () => {
    game.setupNewGame();
    setGameState(game.getGameState())
    setScore(game.getGameState().score);
  }

  function showAlert () {
    if (game.getGameState().over === true) {
      setAlert("Game Over!");
    }

    else if (game.getGameState().won === true) {
      setAlert("You won!");
    }
  }

  return (
  <div id='main' className="main">
    <h3 className='instructions'>Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!</h3>
    <div className='gameTable'>
      <h1>{alert}</h1>
      <h1>Score: {score}</h1>
      <button onClick={reset}>RESET GAME</button>
      
      
      <div className='row'>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[0]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[1]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[2]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[3]}</h1>
        </div>
      </div>

      <div className='row'>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[4]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[5]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[6]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[7]}</h1>
        </div>
      </div>

      <div className='row'>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[8]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[9]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[10]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[11]}</h1>
        </div>
      </div>

      <div className='row'>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[12]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[13]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[14]}</h1>
        </div>
        <div className='tile'>
          <h1 className='tile-value'>{gameState.board[15]}</h1>
        </div>
      </div>

    </div>
    
  </div>
  );
}


export default App;
