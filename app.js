//smaller game
const gridEl = document.querySelector('.gameboard-grid')
const gameStatus = document.querySelector('.game-status')
const startBtn = document.querySelector('.startBtn')
const nextBtn = document.querySelector('.nextBtn')
const width = 3
const grid = width * width
const audio = document.querySelector('#audio')

const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]


//larger game
const scoreA = document.getElementById('scoreA')
const scoreB = document.getElementById('scoreB')
const gameLevel = document.querySelector('.game-level')
const finalWinner = document.querySelector('.finalWinner')
const resetBtn = document.querySelector('.restartBtn')

//smaller game
let player = 'X'
let computer = 'O'
let currentPlayer = player
const gameArray = []
let running = false /*a variable to set the state or condition to control whether certain actions can occur*/

//larger game

let scorePlayerA = 0
let scoreComputer = 0
let gameLevelNum = 9
const resultArray = []

/*create a init function to wrap the displayGrid & startGame for DomContentLoaded's issue  */
function init() {

    //create grid for the game
    function displayGrid() {
        for (let i = 0; i < grid; i++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-index', i)
            cell.addEventListener('click',playAudio)
            cell.addEventListener('click', handleCellClick)
            gameArray.push(cell)
            gridEl.appendChild(cell)
        }
    }

    displayGrid()

    // audio "faster" 
    function playAudio(e) {
        console.log(e.target.textContent)

        if (e.target.textContent === '' && running === true){
            audio.src = './faster.wav'
            audio.play()}
    }


    // Disbale the next and reset button because not sure why it is not working inside the startGame()
    nextBtn.disabled = true
    resetBtn.disabled = true

    // smaller game - start the game

    startBtn.addEventListener('click', startGame)

    function startGame() {
        running = true
        gameStatus.textContent = `Player ${currentPlayer}'s turn`
        startBtn.disabled = true
        nextBtn.disabled = true
    }
}

// smaller game - Cell click & user's option

function handleCellClick(e) {
    //retrive value ('data-index') from the clicked cell by player
    const index = e.target.getAttribute('data-index')
    // console.log(index)

    if (!running || e.target.textContent !== '' || currentPlayer !== player)
        return

    e.target.textContent = currentPlayer

    if (checkWinner(currentPlayer)) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`
        running = false
        updateScore(currentPlayer)
        nextBtn.disabled = false
    } else if (gameArray.every(cell => cell.textContent !== '')) {
        gameStatus.textContent = `It's a draw!`
        running = false
        updateScore('draw')
        nextBtn.disabled = false
    } else {
        currentPlayer = computer;
        gameStatus.textContent = `Computer's turn`;
        setTimeout(computerMove, 600); // more natural feel for computer's move
    }
    //unable to disable the nextBtn if using (resultArray.length === 9) and I do not know why
    if (resultArray.length >= 9) {
        nextBtn.disabled = true
    }

}

// smaller game - Computer's option
function computerMove() {
    if (!running) return

    const availableCells = gameArray.filter(cell => cell.textContent === '')
    const randomIndex = Math.floor(Math.random() * availableCells.length)
    const cell = availableCells[randomIndex]

    if (cell) {
        cell.textContent = computer

        if (checkWinner(computer)) {
            gameStatus.textContent = `Computer wins!`
            updateScore(computer)
            running = false
            nextBtn.disabled = false
        } else if (gameArray.every(cell => cell.textContent !== '')) {
            gameStatus.textContent = `It's a draw!`
            running = false
            updateScore('draw')
            nextBtn.disabled = false
        } else {
            currentPlayer = player
            gameStatus.textContent = `Player ${currentPlayer}'s turn`
        }
    }

}


// smaller game - check winner
function checkWinner(currentPlayer) {
    // some() is used to determine in any of the predefined win patterns match the current player's moves
    // callback function 'combination' checks if every index in that pattern'combination.every()' matches the current player's symbol
    return win.some(combination => {
        return combination.every(index => {
            return gameArray[index].textContent === currentPlayer
        })
    })
}

//smaller game - next level button
nextBtn.addEventListener('click', () => {
    gameArray.forEach(cell => cell.textContent = '')
    currentPlayer = player
    gameStatus.textContent = `Player ${currentPlayer}'s turn`
    running = true
    nextBtn.disabled = true
})


//larger game - update score

function updateScore(winner) {
    if (winner === 'X') {
        scorePlayerA++
        scoreA.textContent = scorePlayerA
        gameLevelNum--
        gameLevel.textContent = gameLevelNum
    } else if (winner === 'O') {
        scoreComputer++
        scoreB.textContent = scoreComputer
        gameLevelNum--
        gameLevel.textContent = gameLevelNum
    } else if (winner === 'draw') {
        scorePlayerA++
        scoreComputer++
        scoreA.textContent = scorePlayerA
        scoreB.textContent = scoreComputer
        gameLevelNum--
        gameLevel.textContent = gameLevelNum
    }

    resultArray.push(winner)
    console.log('Game Results:', resultArray)

    if (resultArray.length >= 9) {
        determineFinalWinner()
    }
}

// larger game - final winner

function determineFinalWinner() {
    if (scorePlayerA > scoreComputer) {
        finalWinner.textContent = 'Player A'
    } else if (scoreComputer > scorePlayerA) {
        finalWinner.textContent = 'Computer'
    } else {
        finalWinner.textContent = "It's a tie!"
    }

    resetBtn.disabled = false
}

// larger game - restart button

resetBtn.addEventListener('click', () => {
    gameArray.forEach(cell => cell.textContent = '')
    resultArray.length = 0
    scorePlayerA = 0
    scoreComputer = 0
    gameLevelNum = 9
    scoreA.textContent = scorePlayerA
    scoreB.textContent = scoreComputer
    gameLevel.textContent = gameLevelNum
    finalWinner.textContent = 'Take a guess 🐶'
    currentPlayer = player
    gameStatus.textContent = ''
    running = false
    startBtn.disabled = false
    resetBtn.disabled = true
    nextBtn.disabled = true
});


document.addEventListener('DOMContentLoaded', init)

