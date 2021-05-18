/*
Add your code for Game here
 */
export default class Game {
    
    constructor(size) {
        this.size = size;
        this.onMoveArr = [];
        this.onWinArr = [];
        this.onLoseArr = [];

        this.gameState = {
            board: new Array(this.size**2),
            score: 0,
            won: false,
            over: false,
        }

        for (let i = 0; i < this.getGameState().board.length; i++) {
            this.getGameState().board[i] = 0;
        }
        let addedTiles = false;
        let counter = 0;
        while (addedTiles === false) {
            if (counter === 2) {
                addedTiles = true;
                break;
            }
            let randomIndex = Math.floor(Math.random() * this.getGameState().board.length);
            if (this.getGameState().board[randomIndex] === 0) {
                this.getGameState().board[randomIndex] = this.addTile();
                counter++;
            }

        }

    }

    setupNewGame() {
        let newGameState = {
            board: new Array(this.size**2),
            score: 0,
            won: false,
            over: false,
        }

        for (let i = 0; i < newGameState.board.length; i++) {
            newGameState.board[i] = 0;
        }
        let addedTiles = false;
        let counter = 0;
        while (addedTiles === false) {
            if (counter === 2) {
                addedTiles = true;
                break;
            }
            let randomIndex = Math.floor(Math.random() * newGameState.board.length);
            if (newGameState.board[randomIndex] === 0) {
                newGameState.board[randomIndex] = this.addTile();
                counter++;
            }

        }

        this.gameState = newGameState;
    }

    loadGame(gameState) {
        if (Math.sqrt(gameState.board.length) % 1 !== 0) {
            console.log("ERROR: gameState object passed is not a square board.")
        }

        if (gameState.score >= 2048) {
            gameState.won = true;
        }

        this.gameState = gameState;
    }

    move(direction) {

        if (this.getGameState().won === true || this.getGameState().over === true) {
            return;
        }

        let currOnWinArr = this.onWinArr;
        

        let componentDirection = this.componentDirection(direction); //returns object with x, y directions to head in
        let arrayOrder = this.arrayOrder(componentDirection); //uses direction to calculate order to move through array

        let currentGameState = this.getGameState(); //saves game state for use, will reassign later.
        let size = this.size; 
        let nextTurn = false; //to determine when to add tiles.
        let merged = []; //array for storing whether a position has already been merged -- set true
        
        for (let i = 0; i < size**2; i++) {
            merged[i] = false;
        }
        
        
        arrayOrder.x.forEach(function(x) {
            arrayOrder.y.forEach(function (y) {

                let cellPosition = {x: x, y: y};
                let cellContent = currentGameState.board[cellPosition.x + (size * cellPosition.y)];
                if (cellContent !== 0) { // we're only gonna bother to operate on cells with tiles
                    let positionsData = positionData(cellPosition, componentDirection, size, currentGameState); // returns data on farthest position and the next obstacle
                    let nextObstacle = positionsData.nextObstacle; // data on next obstacle

                    if (withinBoardBounds(nextObstacle, size) && (currentGameState.board[nextObstacle.x + (size * nextObstacle.y)] === cellContent) && (merged[nextObstacle.x + (size * nextObstacle.y)] === false))
                    {
                        let mergeValue = cellContent + currentGameState.board[nextObstacle.x + (size * nextObstacle.y)];
                        currentGameState.board[cellPosition.x + (size * cellPosition.y)] = 0;
                        currentGameState.board[nextObstacle.x + (size * nextObstacle.y)] = mergeValue;
                        merged[nextObstacle.x + (size * nextObstacle.y)] = true;
                        currentGameState.score += mergeValue;

                        if (mergeValue === 2048) {
                            currentGameState.won = true;
                            for (let i = 0; i < currOnWinArr.length; i++) {
                                currOnWinArr[i](currentGameState);
                            }
                        }
                    }

                    else {
                        currentGameState.board[cellPosition.x + (size * cellPosition.y)] = 0;
                        currentGameState.board[positionsData.farthestAvailable.x + (size * positionsData.farthestAvailable.y)] = cellContent;
                    }

                    if (currentGameState.board[cellPosition.x + (size * cellPosition.y)] !== cellContent) {
                        nextTurn = true;
                    }
                }
            })
        })

        if (currentGameState.won === true) {
            return;
        }

        let addedTiles = false;
        if (nextTurn === true) {
            while (addedTiles === false) {
                let randomIndex = Math.floor(Math.random() * currentGameState.board.length);
                if (currentGameState.board[randomIndex] === 0) {
                    currentGameState.board[randomIndex] = this.addTile();
                    addedTiles = true;
                }
            }
        }
        this.gameState = currentGameState;
        for (let i = 0; i < this.onMoveArr.length; i++) {
            this.onMoveArr[i](this.getGameState());
        }
        let filledCells = 0;
        for (let i = 0; i < this.getGameState().board.length; i++) {
            if (this.getGameState().board[i] !== 0) {
                filledCells++;
            }
        }
        if ((filledCells === size**2) && (this.checkBoard(this.getGameState(), size) === false)) {
            this.getGameState().over = true;
            for (let i = 0; i < this.onLoseArr.length; i++) {
                this.onLoseArr[i](this.getGameState());
            }
        }
    }

    checkBoard(gameState, size) {
        for (let i = 0; i < gameState.board.length; i++) {
            let side = 0;
            let adjacentIndex = 0;
            for (let j = 0; j < 4; j++) {
                if (j === 0) {
                    side = this.componentDirection('up');
                }
                else if (j === 1) {
                    if (i % size === (size-1)) continue;
                    side = this.componentDirection('right');
                }
                else if (j === 2) {
                    if (i % size === 0) continue;
                    side = this.componentDirection('left');
                }
                else {
                    side = this.componentDirection('down');
                }
                adjacentIndex = i + (side.x + (size * side.y));
                if (typeof gameState.board[adjacentIndex] === undefined) {
                    continue;
                }
                else {
                    if (gameState.board[i] === gameState.board[adjacentIndex]) {
                        return true;
                    }
                }

            }
        }
        return false;
    }

    componentDirection(direction) {
        if (direction === 'up') {
            return {x: 0, y: -1};
        }
    
        else if (direction === 'down') {
            return {x: 0, y: 1};
        }
    
        else if (direction === 'left') {
            return {x: -1, y: 0};
        }
    
        else if (direction === 'right') {
            return {x: 1, y: 0};
        }
        else {
            console.log("ERROR: Direction passed in is invalid. Must be up, down, right, or left.")
        }
    }

    arrayOrder(componentDirection) {
        let componentOrder = {x: [], y: []};

        for (let i = 0; i < this.size; i++) {
            componentOrder.x.push(i);
            componentOrder.y.push(i);
        }

        if (componentDirection.x === 1) {
            componentOrder.x = componentOrder.x.reverse();
        }

        if (componentDirection.y === 1) {
            componentOrder.y = componentOrder.y.reverse()
        }

        return componentOrder;
    }

    toString() {
        let asciiString = '';
        for (let i = 0; i < this.getGameState().board.length; i++) {
            if ((i % 4 === 0) && (i !== 0)) {
                asciiString += '\n';
            }
            if (this.getGameState().board[i] === 0) {
                asciiString += '[] ';
            }
            else {
                asciiString += `[${this.getGameState().board[i]}] `;
            }
        }
        return asciiString;
    }

    onMove(callback) {
        this.onMoveArr.push(callback);

    }

    onWin(callback) {
        this.onWinArr.push(callback);
    }
    
    onLose(callback) {
        this.onLoseArr.push(callback);
    }

    getGameState() {
        return this.gameState;
    }

    addTile() { //chooses tile by odds
        let probability = Math.random();
        if (probability >= 0.9) {
            return 4;
        }

        else {
            return 2;
        }
    }

}

 function positionData(cellPosition, componentDirection, size, gameState) {
    let previous = {x: -1, y: -1};
    let currPosition = cellPosition;

    do {
        previous = currPosition;
        currPosition = {x: previous.x + componentDirection.x, y: previous.y + componentDirection.y};
    } while (withinBoardBounds(currPosition, size) && (gameState.board[(currPosition.x + (size * currPosition.y))] === 0))

    return {
        farthestAvailable: previous,
        nextObstacle: currPosition,
    }
}

function withinBoardBounds (boardPosition, size) {
    if (boardPosition.x >= 0 && boardPosition.x < size && boardPosition.y >= 0 && boardPosition.y < size) {
        return true;
    }
    else {
        return false;
    }
}