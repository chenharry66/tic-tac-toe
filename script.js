// no public access with iife
function GameBoard() {
    const board = [];

    const getBoard = () => { 
        return board; 
    }

    const initializeBoard = () => { 
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }
    // have to ensure that the slot isnt already full
    const getCellValue = (i,j) => { 
        return board[i][j];
    }

    const fillSquare = (i, j, user) => {
        if (!user) {
            board[i][j]="X";
        }
        else {
            board[i][j]="O";
        }
    }

    const checkOver = () => { 
        //rows and cols
        for (let j = 0; j < 3; j++) {
            if ((board[0][j] != "" &&
                board[0][j] == board[1][j] &&
                board[1][j] == board[2][j])){
                    return 1;
                }
        }

        for (let i = 0; i < 3; i++) {
            if (board[i][0] != "" && board[i][0] == board[i][1] 
            && board[i][1] == board[i][2]){
                return 1
            }
        }
        
        // diags
        if ((board[0][0] != "" &&
                board[0][0] == board[1][1] &&
                board[1][1] == board[2][2]) ||
                (board[0][2] != "" &&
                board[0][2] == board[1][1] &&
                board[1][1] == board[2][0])){
            return 1;
             }
        
        let nonEmpty = true;
        // if there is a nonempty return -1
        for (let i = 0; i < 3; i++) {
            for(let j = 0; j<3; j++) {
                if (board[i][j] == ""){
                    nonEmpty = false;
                    return -1
                }
            }
        }
        // draw return 
        return 0;
    }

    initializeBoard();

    return {getBoard, getCellValue, fillSquare, initializeBoard, checkOver}
    // check for win three in a row 
    // playMove
    // iterate horizontal, vertical, diagonal
};

function Player(name, playerType=0) { 
    const getName = () => {
        return name;
    }

    const getPlayerType = () => {
        return playerType;
    }

    return {getName, getPlayerType};
}

// the stuff returned by the obejcts are the direct methos you have access to from that object 
// other stuff is private only internal access 


function GameController(player1, player2) { 
    let playerTurn = 0; 

    let isOver = false;

    const board = GameBoard();

    const players = [player1,player2];

    const getIsOver = () => { 
        return isOver;
    }

    const getPlayers = () => { 
        return players;
    }
    const getActivePlayer = () => { 
        return players[playerTurn];
    }

    const playTurn = (i, j) => {
        if (board.getCellValue(i,j) != "") {
            return;
        }

        board.fillSquare(i,j, playerTurn)
        if (board.checkOver() == -1){
            playerTurn = (-1 * playerTurn) + 1;
        }
        else if(board.checkOver() == 0){
            isOver = true;
            return 0
        } else { 
            isOver = true;
            return 1
        }
    }
    
    return {playTurn, getActivePlayer, getBoard: board.getBoard, getCellValue: board.getCellValue, getPlayers, getIsOver};
}

// hales all the displa stuff 

const ScreenController  = (function createDisplayController() { 
    // create display for grid 
    let game;
    const container = document.querySelector(".container");

    function handlePlayerForm(e){
        e.preventDefault();
        //get values for the names crate new game
        const player1Name = document.querySelector("#play1").value;
        const player2Name = document.querySelector("#play2").value;
        game = GameController(Player(player1Name), Player(player2Name, 1));

        
        // generate board, reset and text DIsplay compoennets
        const form = document.querySelector("#playerForm");
        container.removeChild(form); 
        const textDisplay = document.createElement("div");
        textDisplay.classList.add("text-display")

        const reset = document.createElement("button");
        reset.textContent = "Reset";
        reset.classList.add("reset")

        const board = document.createElement("div");
        board.classList.add("board");

        container.appendChild(textDisplay);
        container.appendChild(board);
        container.appendChild(reset);

        displayBoard();
        updateTurnMessage(game.getActivePlayer());
        board.addEventListener("click", (e) => clickBoardHandler(e)); 
        reset.addEventListener("click", () => resetHandle());
    }

    // reset the state
    function resetHandle() { 
        // reset the board 
        const newGame = GameController(game.getPlayers()[0], game.getPlayers()[1])
        game = newGame; 
        displayBoard();
        updateTurnMessage(game.getActivePlayer());
    }

    const displayBoard = () => { 
        const boardDisplay = document.querySelector(".board");
        // reset board display 
        boardDisplay.innerHTML = '';
        // get the cell value and then render the board display 
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const newButt = document.createElement("button"); 
                newButt.textContent = game.getCellValue(i,j);
                newButt.classList.add("cell");
                newButt.setAttribute("data-row", `${i}`);
                newButt.setAttribute("data-col", `${j}`)
                boardDisplay.appendChild(newButt);
            }
        }
    }

    const updateTurnMessage = (activePlayer) => { 
        const textMessage = document.querySelector(".text-display")
        textMessage.textContent = `It's ${activePlayer.getName()}'s turn`;
    }

    // bubbles to the nearest cell, get the cooridnates, update board, update display 
    // get the value of the current cell if it's not empty then return 
    function clickBoardHandler(e) {
        if (e.target.classList.contains("cell") && !(game.getIsOver())) {
            // separation shouldnt it just return the data attribute
            const tgt = e.target 
            const res = game.playTurn(tgt.dataset.row, tgt.dataset.col);
            displayBoard();
            if (game.getIsOver()) {
                const textMessage = document.querySelector(".text-display");
                if (res == 0){ 
                    textMessage.textContent = `Tie Game! Good job guys. `;
                }
                else {
                    textMessage.textContent = `${game.getActivePlayer().getName()} Wins!`
                }
            } else {
            updateTurnMessage(game.getActivePlayer());
            }
        }
    }

    const form = document.querySelector("#playerForm");
    form.addEventListener("submit", (e) => handlePlayerForm(e))
    // when it returns the cooridnates use the board to check if its empty, if its not empty then add to board 
    // update screene
}())

// reset button restart button 