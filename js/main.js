/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'orange',
    '-1': 'black',
};

/*----- state variables -----*/
const state = {
    board: null,
    turn: null,
    winner: null,
};

/*----- cached elements  -----*/
const elements = {
    message: document.querySelector('h1'),
    playAgain: document.querySelector('button'),
    markers: document.querySelectorAll('#markers > div'),
};

/*----- event listeners -----*/
document.getElementById('markers').addEventListener('click', handleDrop)

/*----- functions -----*/
init();
elements.playAgain.addEventListener('click', init);


function init () {
    //visualise board on it's side (also mirrored?)
    state.board = [
        [0, 0, 0, 0, 0, 0], //Column 0
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0], //Column 6
    ];
    state.turn = 1;
    state.winner = null;
    render();
}

function handleDrop (event) {
    console.log('drop detected');
    //To-do: handle the error

    //Find the column number
    const columnIndex = [...elements.markers].indexOf(event.target);
    if (columnIndex === -1) {
        return; //exit the function
    }

    //Find the column data
    const column = state.board[columnIndex];

    //Find next available slot
    const rowIndex = column.indexOf(0);

    //Assign the slot to current player
    column[rowIndex] = state.turn;

    //Change who's turn to the other player
    state.turn *= -1;

    //Check for winner
    state.winner = checkWinner(rowIndex, columnIndex);

    //Run render()
    render();
}

function checkWinner(row, column) {
    return (
        checkVertical(row, column) ||
        checkHorizontal(row, column) ||
        checkDiagonalUpperLeftToLowerRight(row, column) ||
        checkDiagonalLowerLeftToUpperRight(row, column)
    )
}

function checkVertical(row, column) {
    return countAdjacent(row, column, -1, 0) === 3 ? state.board[column][row] : null;
}

function checkHorizontal(row, column) {
    const countLeft = countAdjacent(row, column, 0, -1);
    const countRight = countAdjacent(row, column, 0, 1);
    return (countLeft + countRight === 3) ? state.board[column][row] : null;
}

function checkDiagonalUpperLeftToLowerRight(row, column) {
    const countLeft = countAdjacent(row, column, -1, -1);
    const countRight = countAdjacent(row, column, 1, 1);
    return (countLeft + countRight === 3) ? state.board[column][row] : null;
}

function checkDiagonalLowerLeftToUpperRight(row, column) {
    const countLeft = countAdjacent(row, column, 1, -1);
    const countRight = countAdjacent(row, column, -1, 1);
    return (countLeft + countRight === 3) ? state.board[column][row] : null;
}

function countAdjacent(row, column, rowOffset, columnOffset){
    //Who just played:
    const player = state.board[column][row];
    let count = 0;
    row += rowOffset;
    column += columnOffset;
    while (
        state.board[column] !== undefined &&
        state.board[column][row] !== undefined &&
        state.board[column][row] === player
    ) {
        count += 1;
        row += rowOffset;
        column += columnOffset;
    }
    return count;
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard () {
    state.board.forEach(function (column, columnIndex) {
        column.forEach(function (piece, rowIndex) {
            const id = `c${ columnIndex }r${ rowIndex }`;
            const circle = document.getElementById(id);
            circle.style.backgroundColor = COLORS[piece];
        });
    });
}

function renderMessage() {
    //Show winner or tie or who's turn:
    if (state.winner === 'Tie') {
        elements.message.innerHTML = `It's a draw`;
    } else if (state.winner) {
        elements.message.innerHTML = `<span style="color: ${ COLORS[ state.winner ] }">${ COLORS[ state.winner ] }</span> wins`;

    } else {
        elements.message.innerHTML = `<span style="color: ${ COLORS[ state.turn ] }">${ COLORS[ state.turn ] }</span>'s turn`;
    }
}

function renderControls() {
    // Hide controls if there is a winner or tie:
    elements.markers.forEach(function (marker) {
            marker.style.visibility = state.winner ? 'hidden' : 'visible';
    });
}